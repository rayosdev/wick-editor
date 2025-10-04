// Minimal shims to mimic browser/node environment bits used by the app
if (typeof globalThis.process === "undefined") {
  globalThis.process = { env: {} };
}

if (typeof globalThis.platform === "undefined") {
  globalThis.platform = {
    os: { architecture: "x64", family: "unknown", version: "0" },
  };
}

// Basic canvas mocking used by some components
if (!globalThis.HTMLCanvasElement) {
  class CanvasMock {}
  globalThis.HTMLCanvasElement = CanvasMock;
}

// Ensure React is available globally for files that expect a global React variable
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require("react");
  globalThis.React = React;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ReactDOM = require("react-dom");
  globalThis.ReactDOM = ReactDOM;
} catch (e) {
  // ignore if react isn't resolvable in some environments
}

// Provide a small console.error spy helper in tests if needed
