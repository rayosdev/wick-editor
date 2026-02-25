import React from "react";
import * as ReactDOM from "react-dom";

class CanvasMock {}

type ProcessGlobal = {
  process?: {
    env: Record<string, string | undefined>;
  };
};

type PlatformGlobal = {
  platform?: {
    os: {
      architecture: string;
      family: string;
      version: string;
    };
  };
};

type CanvasGlobal = {
  HTMLCanvasElement?: typeof CanvasMock;
};

type ReactGlobal = {
  React?: typeof React;
  ReactDOM?: typeof ReactDOM;
};

const processGlobal = globalThis as ProcessGlobal;
if (typeof processGlobal.process === "undefined") {
  processGlobal.process = { env: {} };
}

const platformGlobal = globalThis as PlatformGlobal;
if (typeof platformGlobal.platform === "undefined") {
  platformGlobal.platform = {
    os: { architecture: "x64", family: "unknown", version: "0" },
  };
}

const canvasGlobal = globalThis as CanvasGlobal;
if (!canvasGlobal.HTMLCanvasElement) {
  canvasGlobal.HTMLCanvasElement = CanvasMock;
}

const reactGlobal = globalThis as ReactGlobal;
reactGlobal.React = React;
reactGlobal.ReactDOM = ReactDOM;
