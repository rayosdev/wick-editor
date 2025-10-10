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

export * from "./index.tsx";
