import type { Preview } from "@storybook/react-vite";
import JSZip from "jszip";
import "bootstrap/dist/css/bootstrap.min.css";
import initializeDefaultFileHandlers from "../src/files/filehandler";
import "../src/styles/tailwind.css";
import "../src/Editor/styles/tokens.css";
import "../src/Editor/styles/default_styles.css";
import "../src/Editor/styles/default_theme.css";

type ProcessShim = {
  env: Record<string, unknown>;
};

type WickColorInput =
  | string
  | {
      rgba?: string;
      r?: number;
      g?: number;
      b?: number;
      a?: number;
      toString?: () => string;
    };

type WickColorClass = new (input?: WickColorInput) => {
  rgba?: string;
  toString(): string;
};

type WickRuntime = Record<string, unknown> & {
  resourcepath?: string;
  Color?: WickColorClass;
  Project?: unknown;
};

declare global {
  interface Window {
    Wick?: WickRuntime;
    process?: ProcessShim;
    JSZip?: typeof JSZip;
    __REACT_MODAL_APP_ELEMENT?: string;
    __STORYBOOK_CANVAS_2D_PATCHED__?: boolean;
    editor?: Record<string, unknown> & {
      setActiveTool?: (tool: string) => void;
      _onEyedropperPickedColor?: unknown;
    };
  }
}

class StorybookWickColor {
  public rgba: string;

  public constructor(input?: WickColorInput) {
    if (typeof input === "string" && input.trim().length > 0) {
      this.rgba = input;
      return;
    }

    if (typeof input === "object" && input !== null) {
      if (typeof input.rgba === "string" && input.rgba.trim().length > 0) {
        this.rgba = input.rgba;
        return;
      }

      if (
        typeof input.r === "number" &&
        typeof input.g === "number" &&
        typeof input.b === "number"
      ) {
        const alpha = typeof input.a === "number" ? input.a : 1;
        this.rgba = `rgba(${input.r}, ${input.g}, ${input.b}, ${alpha})`;
        return;
      }

      if (typeof input.toString === "function") {
        const rendered = input.toString();
        if (rendered && rendered !== "[object Object]") {
          this.rgba = rendered;
          return;
        }
      }
    }

    this.rgba = "#ffffff";
  }

  public toString(): string {
    return this.rgba;
  }
}

let wickEnginePromise: Promise<void> | null = null;
let reactModalSetupPromise: Promise<void> | null = null;

function ensureWickRoot(): WickRuntime {
  window.Wick = window.Wick ?? {};
  window.Wick.resourcepath = window.Wick.resourcepath ?? "/corelibs/wick-engine/";
  return window.Wick;
}

function ensureProcessShim(): void {
  const existingProcess = window.process;
  if (!existingProcess) {
    window.process = { env: {} };
    return;
  }

  if (typeof existingProcess.env !== "object" || existingProcess.env === null) {
    existingProcess.env = {};
  }
}

function ensureWickColorFallback(): void {
  const wick = ensureWickRoot();
  if (typeof wick.Color !== "function") {
    wick.Color = StorybookWickColor as unknown as WickColorClass;
  }
}

function ensureEditorStub(): void {
  window.editor = window.editor ?? {};
  window.editor.setActiveTool =
    window.editor.setActiveTool ??
    (() => {
      // Storybook-only noop fallback.
    });
}

function ensureStorybookAnchorNodes(): void {
  const anchorIds = ["more-canvas-actions-popover-button"];

  anchorIds.forEach((anchorId) => {
    if (document.getElementById(anchorId)) {
      return;
    }

    const anchor = document.createElement("div");
    anchor.id = anchorId;
    anchor.style.width = "1px";
    anchor.style.height = "1px";
    anchor.style.opacity = "0";
    anchor.style.pointerEvents = "none";
    document.body.appendChild(anchor);
  });
}

function ensureCanvas2DReadbackHint(): void {
  if (
    typeof window === "undefined" ||
    typeof HTMLCanvasElement === "undefined" ||
    window.__STORYBOOK_CANVAS_2D_PATCHED__
  ) {
    return;
  }

  try {
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    if (typeof originalGetContext !== "function") {
      return;
    }

    HTMLCanvasElement.prototype.getContext = function patchedGetContext(
      this: HTMLCanvasElement,
      ...args: Parameters<typeof originalGetContext>
    ) {
      const [contextId, options] = args;
      if (contextId !== "2d") {
        return originalGetContext.apply(this, args);
      }

      const mergedOptions = {
        ...(typeof options === "object" && options !== null ? options : {}),
      } as CanvasRenderingContext2DSettings;

      if (typeof mergedOptions.willReadFrequently === "undefined") {
        mergedOptions.willReadFrequently = true;
      }

      return originalGetContext.call(this, "2d", mergedOptions);
    } as typeof originalGetContext;

    window.__STORYBOOK_CANVAS_2D_PATCHED__ = true;
  } catch (error) {
    // Ignore in environments without canvas support.
  }
}

function ensureReactModalAppElement(): Promise<void> {
  if (reactModalSetupPromise) {
    return reactModalSetupPromise;
  }

  reactModalSetupPromise = import("react-modal")
    .then(({ default: ReactModal }) => {
      if (typeof document === "undefined") {
        return;
      }

      const appElement =
        document.querySelector("#storybook-root") ??
        document.querySelector("#root");

      if (!appElement || typeof ReactModal?.setAppElement !== "function") {
        return;
      }

      const selector = appElement.id === "storybook-root" ? "#storybook-root" : "#root";
      window.__REACT_MODAL_APP_ELEMENT = selector;
      ReactModal.setAppElement(appElement);
    })
    .catch(() => {
      // Ignore in storybook contexts without react-modal available.
    });

  return reactModalSetupPromise;
}

function ensureWickEngineLoaded(): Promise<void> {
  if (window.Wick?.Project) return Promise.resolve();
  if (wickEnginePromise) return wickEnginePromise;

  const wick = ensureWickRoot();
  const basePath = wick.resourcepath ?? "/corelibs/wick-engine/";
  const normalizedBasePath = basePath.startsWith("/") ? basePath : `/${basePath}`;
  const engineSrc = `${normalizedBasePath.replace(/\/+$/, "/")}wickengine.js`;

  wickEnginePromise = new Promise((resolve) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      "script[data-storybook-wick-engine='true']"
    );
    if (existingScript) {
      if (window.Wick?.Project) {
        resolve();
        return;
      }

      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => resolve(), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = engineSrc;
    script.async = true;
    script.setAttribute("data-storybook-wick-engine", "true");
    script.onload = () => resolve();
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });

  return wickEnginePromise;
}

async function bootstrapStorybookRuntime(): Promise<void> {
  if (typeof window === "undefined") return;

  ensureProcessShim();
  ensureWickRoot();
  ensureWickColorFallback();
  ensureEditorStub();
  ensureStorybookAnchorNodes();
  ensureCanvas2DReadbackHint();

  if (!window.JSZip) {
    window.JSZip = JSZip;
  }

  initializeDefaultFileHandlers();
  await ensureReactModalAppElement();

  await ensureWickEngineLoaded();
  ensureWickColorFallback();
}

if (typeof window !== "undefined") {
  void bootstrapStorybookRuntime();
}

const preview: Preview = {
  loaders: [
    async () => {
      await bootstrapStorybookRuntime();
      return {};
    },
  ],
  parameters: {
    layout: "fullscreen",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
};

export default preview;
