/*
 * Copyright 2020 WICKLETS LLC
 *
 * This file is part of Wick Editor.
 *
 * Wick Editor is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Wick Editor is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Wick Editor.  If not, see <https://www.gnu.org/licenses/>.
 */

// Ensure a global `process` shim exists in the browser so libraries that
// reference `process.env` (common in many npm packages) don't throw.
if (typeof window !== "undefined" && typeof window.process === "undefined") {
  // Minimal stub – expand if you need NODE_ENV or other keys during dev.
  window.process = { env: {} };
}

// Prefer willReadFrequently for 2D canvas readbacks to reduce warnings
// and improve performance for code that frequently calls getImageData.
// This mirrors the browser recommendation. We patch getContext so libraries
// that call `canvas.getContext('2d')` receive { willReadFrequently: true }
// when appropriate.
try {
  const origGetContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, opts) {
    if (type === "2d") {
      // If options are undefined or don't set willReadFrequently, prefer true.
      const newOpts = Object.assign({}, opts);
      if (typeof newOpts.willReadFrequently === "undefined") {
        newOpts.willReadFrequently = true;
      }
      return origGetContext.call(this, type, newOpts);
    }
    return origGetContext.call(this, type, opts);
  };
} catch (e) {
  // If the host environment doesn't expose HTMLCanvasElement (tests, SSR), ignore.
}

// If react-modal is present, ensure the app element is set so it doesn't add
// aria-hidden to <body> incorrectly; prefer #root if available.
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ReactModal = require("react-modal");
  if (ReactModal && typeof ReactModal.setAppElement === "function") {
    const rootEl = document.getElementById("root");
    if (rootEl) ReactModal.setAppElement("#root");
  }
} catch (e) {
  // react-modal not installed or not available at runtime — ignore.
}

// Development-only: filter noisy, benign React/3rd-party warnings from console.error
// This makes local dev and automated runs (Playwright) less noisy while you
// incrementally address the underlying deprecations.
try {
  const isDev =
    (typeof import.meta !== "undefined" &&
      import.meta.env &&
      import.meta.env.DEV) ||
    (window && window.location && window.location.hostname === "localhost");
  if (isDev && typeof console !== "undefined") {
    const origError = console.error.bind(console);
    const ignorePatterns = [
      /Support for defaultProps will be removed/, // reactstrap defaultProps warning
      /findDOMNode is deprecated/, // react-sizeme and similar
      /transition\.timeout/, // reactstrap PopperContent2 propType warning
      /Failed %s type: %s%s prop/, // generic prop-type format message
    ];

    console.error = function (...args) {
      try {
        const text = args
          .map((a) => (typeof a === "string" ? a : String(a)))
          .join(" ");
        const shouldIgnore = ignorePatterns.some((rx) => rx.test(text));
        if (shouldIgnore) return;
      } catch (e) {
        // fallback to original if anything goes wrong
      }
      origError(...args);
    };
  }
} catch (e) {
  // ignore
}

import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Editor from "./Editor/Editor";
import * as serviceWorker from "./serviceWorker";
import initializeDefaultFileHandlers from "./files/filehandler";

// Creates file handlers in the window.
initializeDefaultFileHandlers();

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<Editor />);

// Defensive cleanup: some modal libraries set aria-hidden on <body> and may not
// clean up correctly in dev/hot-reload flows. If it's present and hides the
// entire accessibility tree, restore it.
try {
  const body = document && document.body;
  if (
    body &&
    body.hasAttribute &&
    body.getAttribute("aria-hidden") === "true"
  ) {
    // Only remove if it's blocking the accessibility tree for the whole page.
    body.removeAttribute("aria-hidden");
  }
} catch (e) {
  // ignore in non-DOM environments
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
