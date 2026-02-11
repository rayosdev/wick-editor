import { beforeAll, describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

type JsdomModule = {
  JSDOM: new (
    html: string,
    options: {
      runScripts: "outside-only";
      resources: "usable";
      pretendToBeVisual: true;
    }
  ) => {
    window: Window & typeof globalThis;
  };
};

type CanvasModule = {
  Canvas: new (width: number, height: number) => {
    style?: Record<string, string>;
    addEventListener?: () => void;
    removeEventListener?: () => void;
    getBoundingClientRect?: () => {
      top: number;
      left: number;
      width: number;
      height: number;
    };
  };
};

type EngineWindow = Window &
  typeof globalThis & {
    Wick?: {
      version?: string;
      Project?: new () => Record<string, unknown>;
      Tools?: Record<string, unknown>;
      Clip?: unknown;
      Frame?: unknown;
      Layer?: unknown;
      ImageAsset?: unknown;
      SoundAsset?: unknown;
      [key: string]: unknown;
    };
    WICK_ENGINE_BUILD_VERSION?: string;
  };

describe.skip("Engine API (Node.js - Optional)", () => {
  let windowRef: EngineWindow;

  beforeAll(() => {
    const enginePath = path.resolve(process.cwd(), "engine/dist/wickengine.js");

    if (!fs.existsSync(enginePath)) {
      throw new Error("wickengine.js not found. Run: cd engine && npm run build");
    }

    const engineCode = fs.readFileSync(enginePath, "utf8");

    const { JSDOM } = require("jsdom") as JsdomModule;
    const { Canvas } = require("canvas") as CanvasModule;

    const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
      runScripts: "outside-only",
      resources: "usable",
      pretendToBeVisual: true,
    });

    windowRef = dom.window as EngineWindow;
    windowRef.console = console;

    const originalCreateElement = windowRef.document.createElement.bind(windowRef.document);
    windowRef.document.createElement = ((tagName: string): HTMLElement => {
      if (tagName.toLowerCase() === "canvas") {
        const canvasElement = new Canvas(800, 600);
        canvasElement.style = {};
        canvasElement.addEventListener = () => {};
        canvasElement.removeEventListener = () => {};
        canvasElement.getBoundingClientRect = () => ({
          top: 0,
          left: 0,
          width: 800,
          height: 600,
        });

        return canvasElement as unknown as HTMLElement;
      }

      return originalCreateElement(tagName);
    }) as typeof windowRef.document.createElement;

    try {
      windowRef.eval(engineCode);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Failed to load engine:", message);
    }
  });

  it("defines Wick global", () => {
    expect(windowRef.Wick).toBeDefined();
    expect(typeof windowRef.Wick).toBe("object");
  });

  it("has version property", () => {
    expect(windowRef.Wick?.version).toBeDefined();
    expect(typeof windowRef.Wick?.version).toBe("string");
  });

  it("has build version constant", () => {
    expect(windowRef.WICK_ENGINE_BUILD_VERSION).toBeDefined();
    expect(typeof windowRef.WICK_ENGINE_BUILD_VERSION).toBe("string");
  });

  it("has Project class", () => {
    expect(windowRef.Wick?.Project).toBeDefined();
    expect(typeof windowRef.Wick?.Project).toBe("function");
  });

  it("has Tools object", () => {
    expect(windowRef.Wick?.Tools).toBeDefined();
    expect(typeof windowRef.Wick?.Tools).toBe("object");
  });

  it("has common tool classes", () => {
    const tools = ["Pencil", "Brush", "Cursor", "Eraser"];
    tools.forEach((tool) => {
      expect(windowRef.Wick?.Tools?.[tool]).toBeDefined();
    });
  });

  it("can create a project", () => {
    const ProjectClass = windowRef.Wick?.Project;
    expect(ProjectClass).toBeDefined();
    const project = ProjectClass ? new ProjectClass() : null;
    expect(project).toBeDefined();
    expect(project).not.toBeNull();
  });

  it("created project has expected properties", () => {
    const ProjectClass = windowRef.Wick?.Project;
    const project = (ProjectClass ? new ProjectClass() : {}) as Record<string, unknown>;
    expect(project.name).toBeDefined();
    expect(project.width).toBeDefined();
    expect(project.height).toBeDefined();
  });

  it("has Base classes", () => {
    expect(windowRef.Wick?.Clip).toBeDefined();
    expect(windowRef.Wick?.Frame).toBeDefined();
    expect(windowRef.Wick?.Layer).toBeDefined();
  });

  it("has asset classes", () => {
    expect(windowRef.Wick?.ImageAsset).toBeDefined();
    expect(windowRef.Wick?.SoundAsset).toBeDefined();
  });
});
