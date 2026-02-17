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

import { createRoot } from "react-dom/client";
import JSZip from "jszip";
import "./index.css";
import "./styles/tailwind.css";
import Editor from "./Editor/Editor";
import * as serviceWorker from "./serviceWorker";
import initializeDefaultFileHandlers from "./files/filehandler";

declare global {
    interface Window {
        process?: ProcessShim;
        __REACT_MODAL_APP_ELEMENT?: string;
        JSZip?: typeof JSZip;
    }
}

type ProcessShim = {
    env: Record<string, unknown>;
};

// Ensure a global `process` shim exists so dependencies referencing `process.env`
// do not throw in the browser.
if (typeof window !== "undefined") {
    const existingProcess = window.process as ProcessShim | undefined;
    if (!existingProcess) {
        (window as Window & { process: ProcessShim }).process = { env: {} };
    } else if (typeof existingProcess.env !== "object") {
        existingProcess.env = {};
    }

    if (!window.JSZip) {
        window.JSZip = JSZip;
    }
}

// Prefer willReadFrequently for 2D canvas readbacks to reduce warnings
// and improve performance for code that frequently calls getImageData.
// This mirrors the browser recommendation. We patch getContext so libraries
// that call `canvas.getContext('2d')` receive { willReadFrequently: true }
// when appropriate.
if (typeof HTMLCanvasElement !== "undefined") {
    try {
        const origGetContext = HTMLCanvasElement.prototype.getContext;
        if (typeof origGetContext === "function") {
            HTMLCanvasElement.prototype.getContext = function patchedGetContext(
                this: HTMLCanvasElement,
                ...args: Parameters<typeof origGetContext>
            ) {
                const [contextId, options] = args;

                if (contextId === "2d") {
                    const newOptions = {
                        ...(typeof options === "object" && options !== null
                            ? options
                            : {}),
                    } as CanvasRenderingContext2DSettings;

                    if (typeof newOptions.willReadFrequently === "undefined") {
                        newOptions.willReadFrequently = true;
                    }

                    return origGetContext.call(this, contextId, newOptions);
                }

                return origGetContext.apply(this, args);
            } as typeof origGetContext;
        }
    } catch (error) {
        // Ignore in environments without DOM / canvas available.
    }
}

// If react-modal is present, ensure the app element is set so it doesn't add
// aria-hidden to <body> incorrectly; prefer #root if available.
if (typeof document !== "undefined") {
    const targetSelector = window.__REACT_MODAL_APP_ELEMENT ?? "#root";
    void import("react-modal")
        .then(({ default: ReactModal }) => {
            if (typeof ReactModal?.setAppElement === "function") {
                const rootEl = document.querySelector(targetSelector);
                if (rootEl) {
                    ReactModal.setAppElement(targetSelector);
                }
            }
        })
        .catch(() => {
            // react-modal not installed or failed to load; ignore gracefully.
        });
}

// Development-only: filter noisy, benign React/3rd-party warnings from console.error
// This makes local dev and automated runs (Playwright) less noisy while you
// incrementally address the underlying deprecations.
try {
    const viteMeta = import.meta as ImportMeta & {
        env?: { DEV?: boolean };
    };
    const isDev =
        Boolean(viteMeta.env?.DEV) ||
        (typeof window !== "undefined" &&
            window.location?.hostname === "localhost");

    if (isDev && typeof console !== "undefined" && console.error) {
        const origError = console.error.bind(console);
        const ignorePatterns = [
            /Support for defaultProps will be removed/, // reactstrap defaultProps warning
            /findDOMNode is deprecated/, // react-sizeme and similar
            /transition\.timeout/, // reactstrap PopperContent2 propType warning
            /Failed %s type: %s%s prop/, // generic prop-type format message
        ];

        console.error = function filteredConsoleError(...args: unknown[]) {
            try {
                const text = args
                    .map((value) => (typeof value === "string" ? value : String(value)))
                    .join(" ");
                const shouldIgnore = ignorePatterns.some((rx) => rx.test(text));
                if (shouldIgnore) {
                    return;
                }
            } catch (error) {
                // fallback to original if anything goes wrong
            }

            origError(...args);
        };
    }
} catch (error) {
    // ignore
}

// Creates file handlers in the window.
initializeDefaultFileHandlers();

const container = document.getElementById("root");
if (!container) {
    throw new Error("Failed to find root element with id 'root'.");
}

const root = createRoot(container);
root.render(<Editor />);

// Defensive cleanup: some modal libraries set aria-hidden on <body> and may not
// clean up correctly in dev/hot-reload flows. If it's present and hides the
// entire accessibility tree, restore it.
try {
    const body = typeof document !== "undefined" ? document.body : undefined;
    if (
        body &&
        typeof body.hasAttribute === "function" &&
        body.hasAttribute("aria-hidden") &&
        body.getAttribute("aria-hidden") === "true"
    ) {
        body.removeAttribute("aria-hidden");
    }
} catch (error) {
    // ignore in non-DOM environments
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
