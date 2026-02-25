import React, { useEffect, useMemo, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import SafeStoryWrapper from "./SafeStoryWrapper";
import { createDynamicStoryDefaultArgs } from "./wickStoryFixtures";

type ComponentModule = Record<string, unknown> & {
  default?: unknown;
};

type DynamicComponentStoryProps = {
  componentName: string;
  loader: () => Promise<ComponentModule>;
  args?: Record<string, unknown>;
};

type DynamicStoryComponent = React.ComponentType<Record<string, unknown>>;
type StoryDndProviderProps = React.PropsWithChildren<
  Parameters<typeof DndProvider>[0]
>;
const StoryDndProvider =
  DndProvider as React.ComponentType<StoryDndProviderProps>;
const REQUIRED_ANCHOR_IDS: Record<string, string[]> = {
  CanvasActions: ["more-canvas-actions-popover-button"],
  Toolbox: ["more-canvas-actions-popover-button"],
};

const STORYBOOK_SELECT_OPTIONS = [
  { label: "Option A", value: "option-a" },
  { label: "Option B", value: "option-b" },
];

type StoryRecord = Record<string, unknown>;

function isReactComponentType(candidate: unknown): boolean {
  if (typeof candidate === "function") {
    return true;
  }

  if (typeof candidate === "object" && candidate !== null) {
    const reactType = (candidate as { $$typeof?: unknown }).$$typeof;
    if (typeof reactType === "symbol") {
      const token = String(reactType);
      return (
        token.includes("react.forward_ref") ||
        token.includes("react.memo") ||
        token.includes("react.lazy")
      );
    }
  }

  return false;
}

function resolveComponent(
  mod: ComponentModule,
  componentName: string
): DynamicStoryComponent {
  const candidates = [
    mod.default,
    mod[componentName as keyof ComponentModule],
    ...Object.values(mod),
  ];

  for (const candidate of candidates) {
    if (isReactComponentType(candidate)) {
      return candidate as DynamicStoryComponent;
    }
  }

  throw new Error(
    `No React component export found. Available exports: ${Object.keys(mod).join(", ") || "(none)"}`
  );
}

function isFunctionLikeProp(prop: string): boolean {
  const key = prop.toLowerCase();
  const hasOpenVerbPrefix = key.startsWith("open") && key.length > "open".length;
  const hasCloseVerbPrefix = key.startsWith("close") && key.length > "close".length;
  const hasInfixPredicatePrefix =
    /[a-z]Is[A-Z]/.test(prop) ||
    /[a-z]Has[A-Z]/.test(prop) ||
    /[a-z]Can[A-Z]/.test(prop);

  if (
    key.startsWith("on") ||
    key.startsWith("set") ||
    key.startsWith("get") ||
    key.startsWith("toggle") ||
    key.startsWith("change") ||
    key.startsWith("update") ||
    key.startsWith("create") ||
    key.startsWith("load") ||
    key.startsWith("save") ||
    hasOpenVerbPrefix ||
    hasCloseVerbPrefix ||
    key.startsWith("add") ||
    key.startsWith("remove") ||
    key.startsWith("delete") ||
    key.startsWith("copy") ||
    key.startsWith("paste") ||
    key.startsWith("import") ||
    key.startsWith("export") ||
    key.startsWith("render") ||
    key.startsWith("select") ||
    key.startsWith("clear") ||
    key.includes("action") ||
    key.includes("handler") ||
    key.includes("callback") ||
    key.endsWith("fn")
  ) {
    return true;
  }

  if (hasInfixPredicatePrefix) {
    return true;
  }

  // Predicates like `isAssetInLibrary` are often function props.
  return key.startsWith("is") && key.includes("in");
}

function isBooleanLikeProp(prop: string): boolean {
  const key = prop.toLowerCase();
  return (
    key === "open" ||
    key === "closed" ||
    key === "visible" ||
    key === "enabled" ||
    key === "disabled" ||
    key === "selected" ||
    key === "checked" ||
    key.startsWith("is") ||
    key.startsWith("has") ||
    key.startsWith("show") ||
    key.startsWith("can")
  );
}

function isCollectionLikeProp(prop: string): boolean {
  const key = prop.toLowerCase();
  return (
    key === "options" ||
    key.endsWith("options") ||
    key.includes("assets") ||
    key.includes("scripts") ||
    key.includes("items") ||
    key.includes("list") ||
    key.includes("rows") ||
    key.includes("children") ||
    key.includes("objects")
  );
}

function primitiveFallbackForProp(prop: string): unknown {
  const key = prop.toLowerCase();

  if (key.includes("tooltip")) return "Storybook tooltip";
  if (key.includes("title")) return "Storybook Title";
  if (key.includes("description")) return "Storybook description";
  if (key.includes("label")) return "Storybook Label";
  if (key.includes("placeholder")) return "Storybook placeholder";
  if (key.includes("name")) return "Storybook Name";
  if (key.includes("color")) return "#00a8ff";
  if (isBooleanLikeProp(prop)) {
    return false;
  }

  if (isCollectionLikeProp(prop)) {
    return key.includes("options") ? STORYBOOK_SELECT_OPTIONS : [];
  }

  if (
    key.includes("index") ||
    key.includes("count") ||
    key.includes("size") ||
    key.includes("width") ||
    key.includes("height") ||
    key.includes("opacity") ||
    key === "val"
  ) {
    return 1;
  }

  if (key === "value") return "1";
  if (key === "type") return "text";
  if (key.includes("id")) return "storybook-id";
  if (key.includes("classname")) return "";
  if (key.includes("hotkey")) return {};

  return undefined;
}

function createSafeObject(seed: StoryRecord = {}): StoryRecord {
  return new Proxy(seed, {
    get(target, prop, receiver) {
      if (prop === Symbol.iterator) {
        return function* () {
          return;
        };
      }

      if (prop === Symbol.toPrimitive) {
        return () => "";
      }

      if (typeof prop !== "string") {
        return Reflect.get(target, prop, receiver);
      }

      if (Reflect.has(target, prop)) {
        return Reflect.get(target, prop, receiver);
      }

      const key = prop.toLowerCase();
      if (key === "length") return 0;
      if (key === "map" || key === "filter") return () => [];
      if (key === "forEach") return () => undefined;
      if (key === "find") return () => undefined;
      if (key === "includes") return () => false;
      if (key === "replace") return () => "";
      if (key === "split") return () => [];
      if (key === "join") return () => "";
      if (key === "trim") return () => "";
      if (key === "tostring") return () => "";
      if (key === "valueof") return () => 0;

      const primitive = primitiveFallbackForProp(key);
      if (primitive !== undefined) {
        return primitive;
      }

      const nested = createSafeObject();
      target[prop] = nested;
      return nested;
    },
  });
}

function createSafeProject(): StoryRecord {
  const canvasNode =
    typeof document !== "undefined" ? document.createElement("canvas") : null;

  return createSafeObject({
    uuid: "storybook-project",
    name: "Storybook Project",
    width: 800,
    height: 600,
    framerate: 24,
    activeTool: "cursor",
    assets: [],
    selection: [],
    toolSettings: createSafeObject({
      setSetting: () => undefined,
    }),
    view: createSafeObject({
      canvasBGColor: "#ffffff",
      canvasContainer: null,
      canvas: canvasNode,
      resize: () => undefined,
      on: () => undefined,
    }),
    undo: () => false,
    redo: () => false,
  });
}

function createFallbackFunction(key: string): (...args: unknown[]) => unknown {
  if (key.includes("rendersize")) {
    return () => ({ width: 800, height: 600 });
  }

  if (key.includes("toolname")) {
    return () => "cursor";
  }

  if (key.includes("selectiontype")) {
    return () => "none";
  }

  if (key.includes("restriction")) {
    return () => ({});
  }

  if (key.includes("hotkey")) {
    return () => ({});
  }

  if (key.includes("asset") || key.includes("list") || key.includes("items")) {
    return () => [];
  }

  if (key.startsWith("is") || key.startsWith("has") || key.startsWith("can")) {
    return () => false;
  }

  if (key.startsWith("get")) {
    const derivedKey = key.slice(3);
    const derivedFallback = primitiveFallbackForProp(derivedKey);
    if (derivedFallback !== undefined) {
      return () => derivedFallback;
    }

    return () => createSafeObject();
  }

  return () => undefined;
}

function fallbackForProp(prop: string): unknown {
  const key = prop.toLowerCase();

  const primitive = primitiveFallbackForProp(key);
  if (primitive !== undefined) {
    return primitive;
  }

  if (isFunctionLikeProp(prop)) {
    return createFallbackFunction(key);
  }

  if (key === "project" || key.endsWith("project")) {
    return createSafeProject();
  }

  if (key.includes("file")) {
    return createSafeObject({
      name: "storybook-file.wick",
      type: "application/octet-stream",
      size: 0,
    });
  }

  if (key === "warningmodalinfo" || key.endsWith("modalinfo")) {
    return createSafeObject({
      title: "Storybook Warning",
      description: "Mock warning modal message.",
      acceptText: "Accept",
      cancelText: "Cancel",
      acceptAction: () => undefined,
      cancelAction: () => undefined,
    });
  }

  if (
    key.includes("editor") ||
    key.includes("modal") ||
    key.includes("state") ||
    key.includes("info") ||
    key.includes("settings") ||
    key.includes("config") ||
    key.includes("data")
  ) {
    return createSafeObject();
  }

  return createSafeObject();
}

function shouldReplaceProvidedValue(prop: string, value: unknown): boolean {
  const key = prop.toLowerCase();
  if (value === undefined || value === null) {
    return true;
  }

  if (isBooleanLikeProp(prop) && typeof value !== "boolean") {
    return true;
  }

  if (isFunctionLikeProp(prop) && typeof value !== "function") {
    return true;
  }

  if (isCollectionLikeProp(prop) && !Array.isArray(value)) {
    return true;
  }

  if (key === "value" && typeof value !== "string" && typeof value !== "number") {
    return true;
  }

  return false;
}

function createSafeArgs(args: Record<string, unknown>): Record<string, unknown> {
  return new Proxy(args, {
    get(target, prop, receiver) {
      if (typeof prop !== "string") {
        return Reflect.get(target, prop, receiver);
      }

      const value = Reflect.get(target, prop, receiver);
      if (!shouldReplaceProvidedValue(prop, value)) {
        return value;
      }

      return fallbackForProp(prop);
    },
  });
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  if (Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function mergeArgsWithDefaults(
  defaults: Record<string, unknown>,
  overrides: Record<string, unknown>
): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...defaults };

  Object.entries(overrides).forEach(([key, overrideValue]) => {
    if (overrideValue === undefined) {
      return;
    }

    const defaultValue = merged[key];

    if (isPlainRecord(defaultValue) && isPlainRecord(overrideValue)) {
      merged[key] = mergeArgsWithDefaults(defaultValue, overrideValue);
      return;
    }

    merged[key] = overrideValue;
  });

  return merged;
}

export default function DynamicComponentStory({
  componentName,
  loader,
  args = {},
}: DynamicComponentStoryProps): JSX.Element {
  const [LoadedComponent, setLoadedComponent] = useState<DynamicStoryComponent | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoadedComponent(null);
    setLoadError(null);

    loader()
      .then((mod) => {
        if (!cancelled) {
          setLoadedComponent(() => resolveComponent(mod, componentName));
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : "Unknown import error.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [componentName, loader]);

  const defaultArgs = useMemo(
    () => createDynamicStoryDefaultArgs(componentName),
    [componentName]
  );
  const mergedArgs = useMemo(
    () => mergeArgsWithDefaults(defaultArgs, args),
    [defaultArgs, args]
  );
  const hasFixtureDefaults = useMemo(
    () => Object.keys(defaultArgs).length > 0,
    [defaultArgs]
  );
  const resolvedArgs = useMemo(
    () => (hasFixtureDefaults ? mergedArgs : createSafeArgs(mergedArgs)),
    [hasFixtureDefaults, mergedArgs]
  );
  const requiredAnchorIds = REQUIRED_ANCHOR_IDS[componentName] ?? [];

  if (loadError) {
    return (
      <div
        style={{
          margin: "1rem",
          padding: "1rem",
          borderRadius: "6px",
          border: "1px solid #f5c2c7",
          backgroundColor: "#f8d7da",
          color: "#842029",
          fontFamily: "system-ui, sans-serif",
          fontSize: "14px",
          lineHeight: 1.4,
        }}
      >
        <strong>{componentName}</strong> failed to import.
        <div>{loadError}</div>
      </div>
    );
  }

  if (!LoadedComponent) {
    return (
      <div
        style={{
          margin: "1rem",
          padding: "1rem",
          borderRadius: "6px",
          border: "1px solid #ced4da",
          backgroundColor: "#f8f9fa",
          color: "#212529",
          fontFamily: "system-ui, sans-serif",
          fontSize: "14px",
          lineHeight: 1.4,
        }}
      >
        Loading <strong>{componentName}</strong>...
      </div>
    );
  }

  return (
    <SafeStoryWrapper componentName={componentName}>
      {requiredAnchorIds.map((anchorId) => (
        <div
          key={anchorId}
          id={anchorId}
          style={{
            width: 1,
            height: 1,
            opacity: 0,
            pointerEvents: "none",
          }}
        />
      ))}
      <StoryDndProvider backend={HTML5Backend}>
        <LoadedComponent {...resolvedArgs} />
      </StoryDndProvider>
    </SafeStoryWrapper>
  );
}
