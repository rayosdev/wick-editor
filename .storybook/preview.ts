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

  if (!window.JSZip) {
    window.JSZip = JSZip;
  }

  initializeDefaultFileHandlers();

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
