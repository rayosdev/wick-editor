declare module "*.module.scss" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.scss" {
  const content: string;
  export default content;
}

declare module "*.css" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  const src: string;
  export default src;
}

declare module "tinycolor2";
declare module "react-color";
declare module "react-color/lib/components/common";
declare module "react-color/lib/components/sketch/SketchFields";
declare module "react-modal";

type RuntimeBridgeValue = ReturnType<typeof JSON.parse>;

// Wick Engine global
interface Window {
  Wick: RuntimeBridgeValue;
  editor: RuntimeBridgeValue;
  project?: RuntimeBridgeValue;
  paper?: RuntimeBridgeValue;
  wickEditor?: RuntimeBridgeValue;
  Croquis?: RuntimeBridgeValue;
  potrace?: RuntimeBridgeValue;
  GlobalAPI?: RuntimeBridgeValue;
  localforage?: RuntimeBridgeValue;
  __wickDebug?: RuntimeBridgeValue;
  WickObjectCache?: RuntimeBridgeValue;
  WICK_ENGINE_BUILD_VERSION?: string;
  openWickLocalFileViewer?: (files: unknown[]) => void;
  projectDidChangeCallCount?: number;
  setStateCallCount?: number;
  consoleErrors?: unknown[];
  [key: string]: unknown;
}
