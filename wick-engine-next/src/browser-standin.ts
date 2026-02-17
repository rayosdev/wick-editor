import "../../engine/dist/wickengine.js";
import { installWickCompat } from "./index";
import type { WickCompatApi } from "./types";

declare global {
  interface Window {
    Wick?: WickCompatApi;
    __WICK_LEGACY__?: WickCompatApi;
  }
}

const runtimeWindow = (globalThis as { window?: Window }).window;

if (!runtimeWindow || !runtimeWindow.Wick) {
  throw new Error("wick-engine-next: legacy Wick engine failed to initialize.");
}

runtimeWindow.__WICK_LEGACY__ = runtimeWindow.Wick;
runtimeWindow.Wick = installWickCompat(runtimeWindow.Wick, { logger: console });

export default runtimeWindow.Wick;
