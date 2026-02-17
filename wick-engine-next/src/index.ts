import { WickCompatKernel, type WickCompatKernelOptions } from "./kernel/wickCompatKernel";
import type { WickCompatApi } from "./types";

export { EDITOR_REQUIRED_SURFACE } from "./contracts/editorSurface";
export { WickCompatKernel } from "./kernel/wickCompatKernel";
export type { WickCompatKernelOptions } from "./kernel/wickCompatKernel";
export type { AnyRecord, WickCompatApi, WickCompatMeta } from "./types";

export function installWickCompat(
  wick: WickCompatApi,
  options: WickCompatKernelOptions = {}
): WickCompatApi {
  const kernel = new WickCompatKernel(wick, options);
  return kernel.install();
}
