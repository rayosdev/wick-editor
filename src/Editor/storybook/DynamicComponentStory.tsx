import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import SafeStoryWrapper from "./SafeStoryWrapper";

type ComponentModule = Record<string, unknown> & {
  default?: unknown;
};

type DynamicComponentStoryProps = {
  componentName: string;
  loader: () => Promise<ComponentModule>;
  args?: Record<string, unknown>;
};

type DynamicStoryComponent = React.ComponentType<Record<string, unknown>>;
const DndProviderComponent = DndProvider as unknown as React.ComponentType<{
  backend: unknown;
  children?: React.ReactNode;
}>;

const STORYBOOK_SELECT_OPTIONS = [
  { label: "Option A", value: "option-a" },
  { label: "Option B", value: "option-b" },
];

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

function fallbackForProp(prop: string): unknown {
  const key = prop.toLowerCase();
  if (
    key.startsWith("on") ||
    key.startsWith("set") ||
    key.startsWith("get") ||
    key.includes("action") ||
    key.includes("handler") ||
    key.includes("callback")
  ) {
    return () => undefined;
  }

  if (key.includes("tooltip")) return "Storybook tooltip";
  if (key.includes("title")) return "Storybook Title";
  if (key.includes("label")) return "Storybook Label";
  if (key.includes("name")) return "Storybook Name";
  if (key.includes("color")) return "#00a8ff";
  if (key.includes("checked") || key.startsWith("is") || key.startsWith("has")) {
    return false;
  }

  if (
    key === "options" ||
    key.endsWith("options") ||
    key.includes("assets") ||
    key.includes("scripts") ||
    key.includes("items") ||
    key.includes("list")
  ) {
    return key.includes("options") ? STORYBOOK_SELECT_OPTIONS : [];
  }

  if (
    key.includes("index") ||
    key.includes("count") ||
    key.includes("size") ||
    key.includes("width") ||
    key.includes("height") ||
    key.includes("opacity") ||
    key === "val" ||
    key === "value"
  ) {
    return 1;
  }

  if (key === "type") return "text";
  if (key.includes("id")) return "storybook-id";
  if (key.includes("classname")) return "";
  if (key.includes("project")) return { name: "Storybook Project", assets: [] };

  return undefined;
}

function createSafeArgs(args: Record<string, unknown>): Record<string, unknown> {
  return new Proxy(args, {
    get(target, prop, receiver) {
      if (typeof prop !== "string") {
        return Reflect.get(target, prop, receiver);
      }

      if (Reflect.has(target, prop)) {
        const value = Reflect.get(target, prop, receiver);
        if (value !== undefined) {
          return value;
        }
      }

      return fallbackForProp(prop);
    },
  });
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
  }, [loader]);

  const safeArgs = createSafeArgs(args);

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
      <DndProviderComponent backend={HTML5Backend}>
        <LoadedComponent {...safeArgs} />
      </DndProviderComponent>
    </SafeStoryWrapper>
  );
}
