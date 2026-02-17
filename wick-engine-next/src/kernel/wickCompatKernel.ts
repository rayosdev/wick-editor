import { EDITOR_REQUIRED_SURFACE, findMissingSurface } from "../contracts/editorSurface";
import type { WickCompatApi, WickCompatMeta } from "../types";
import { ApiRegistry } from "./apiRegistry";
import { ProjectTracker } from "./projectTracker";
import { wrapCallbackWithProjectTracking, wrapProjectClass } from "./wrapLegacy";

const REWRITE_VERSION = "0.1.0";

export interface WickCompatKernelLogger {
  warn: (message: string, ...optionalParams: unknown[]) => void;
}

export interface WickCompatKernelOptions {
  strictSurface?: boolean;
  logger?: WickCompatKernelLogger;
}

export class WickCompatKernel {
  readonly registry: ApiRegistry;

  private readonly tracker: ProjectTracker;

  private readonly options: WickCompatKernelOptions;

  private missingSurface: string[] = [];

  constructor(private readonly wick: WickCompatApi, options: WickCompatKernelOptions = {}) {
    this.options = options;
    this.registry = new ApiRegistry(this.wick);
    this.tracker = new ProjectTracker(this.wick.project);
  }

  install(): WickCompatApi {
    this.installProjectProperty();
    this.installProjectConstructionTracking();
    this.installProjectLoaderTracking();
    this.validateSurface();
    this.installMetadata();

    return this.wick;
  }

  registerOverride(path: string, value: unknown, patchRoot = true): void {
    this.registry.register(path, value, patchRoot);
  }

  resolve<T = unknown>(path: string): T | undefined {
    return this.registry.resolve<T>(path);
  }

  getMissingSurface(): string[] {
    return [...this.missingSurface];
  }

  private installProjectProperty(): void {
    try {
      Object.defineProperty(this.wick, "project", {
        configurable: true,
        enumerable: true,
        get: () => this.tracker.get(),
        set: (nextProject: unknown) => {
          this.tracker.set(nextProject);
        }
      });
    } catch {
      this.wick.project = this.tracker.get();
    }
  }

  private installProjectConstructionTracking(): void {
    const projectCtor = this.resolve<new (...args: any[]) => unknown>("Project");

    if (typeof projectCtor !== "function") {
      return;
    }

    const wrappedProjectCtor = wrapProjectClass(projectCtor, this.tracker);
    this.registerOverride("Project", wrappedProjectCtor, true);
  }

  private installProjectLoaderTracking(): void {
    const wickFile = this.resolve<Record<string, unknown>>("WickFile");
    if (wickFile) {
      wrapCallbackWithProjectTracking(wickFile, "fromWickFile", 1, this.tracker);
    }

    const autoSave = this.resolve<Record<string, unknown>>("AutoSave");
    if (autoSave) {
      wrapCallbackWithProjectTracking(autoSave, "load", 1, this.tracker);
      wrapCallbackWithProjectTracking(autoSave, "generateProjectFromAutosaveData", 1, this.tracker);
    }
  }

  private validateSurface(): void {
    this.missingSurface = findMissingSurface(this.wick, EDITOR_REQUIRED_SURFACE);

    if (this.missingSurface.length === 0) {
      return;
    }

    if (this.options.strictSurface) {
      throw new Error(
        `wick-engine-next is missing required Wick API surface: ${this.missingSurface.join(", ")}`
      );
    }

    this.options.logger?.warn(
      `[wick-engine-next] Missing required Wick API surface: ${this.missingSurface.join(", ")}`
    );
  }

  private installMetadata(): void {
    const legacyVersion = String(this.wick.version ?? "unknown");

    const metadata: WickCompatMeta = {
      mode: "bridge",
      rewriteVersion: REWRITE_VERSION,
      legacyVersion,
      requiredSurface: EDITOR_REQUIRED_SURFACE,
      getMissingSurface: () => this.getMissingSurface(),
      registerOverride: (path: string, value: unknown) => {
        this.registerOverride(path, value, true);
      },
      resolve: <T = unknown>(path: string) => this.resolve<T>(path)
    };

    this.wick.__compat = metadata;
  }
}
