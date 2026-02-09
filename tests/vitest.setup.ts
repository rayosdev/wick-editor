import React from "react";
import * as ReactDOM from "react-dom";

const globalAny = globalThis as any;

if (typeof globalAny.process === "undefined") {
  globalAny.process = { env: {} };
}

if (typeof globalAny.platform === "undefined") {
  globalAny.platform = {
    os: { architecture: "x64", family: "unknown", version: "0" },
  };
}

if (!globalAny.HTMLCanvasElement) {
  class CanvasMock {}
  globalAny.HTMLCanvasElement = CanvasMock;
}

globalAny.React = React;
globalAny.ReactDOM = ReactDOM;
