import React, { useEffect, useMemo, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import SafeStoryWrapper from "./SafeStoryWrapper";

type ComponentModule = Record<string, unknown> & {
  default?: unknown;
};

type WickComponentStoryProps = {
  componentName: string;
  loader: () => Promise<ComponentModule>;
  args?: Record<string, unknown>;
  defaultArgs?: Record<string, unknown>;
  withDndProvider?: boolean;
};

type DynamicStoryComponent = React.ComponentType<Record<string, unknown>>;
type StoryDndProviderProps = React.PropsWithChildren<
  Parameters<typeof DndProvider>[0]
>;

const StoryDndProvider =
  DndProvider as React.ComponentType<StoryDndProviderProps>;

const basePanelStyle: React.CSSProperties = {
  margin: "1rem",
  padding: "1rem",
  borderRadius: "8px",
  border: "1px solid #ced4da",
  backgroundColor: "#f8f9fa",
  color: "#212529",
  fontFamily: "system-ui, sans-serif",
  fontSize: "14px",
  lineHeight: 1.4,
};

function isReactComponentType(candidate: unknown): boolean {
  if (typeof candidate === "function") return true;

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

export default function WickComponentStory({
  componentName,
  loader,
  args = {},
  defaultArgs = {},
  withDndProvider = true,
}: WickComponentStoryProps): JSX.Element {
  const [LoadedComponent, setLoadedComponent] =
    useState<DynamicStoryComponent | null>(null);
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

  const resolvedArgs = useMemo(
    () => ({
      ...defaultArgs,
      ...args,
    }),
    [defaultArgs, args]
  );

  if (loadError) {
    return (
      <div
        style={{
          ...basePanelStyle,
          border: "1px solid #f5c2c7",
          backgroundColor: "#f8d7da",
          color: "#842029",
        }}
      >
        <strong>{componentName}</strong> failed to import.
        <div>{loadError}</div>
      </div>
    );
  }

  if (!LoadedComponent) {
    return (
      <div style={basePanelStyle}>
        Loading <strong>{componentName}</strong>...
      </div>
    );
  }

  const storyNode = <LoadedComponent {...resolvedArgs} />;

  return (
    <SafeStoryWrapper componentName={componentName}>
      {withDndProvider ? (
        <StoryDndProvider backend={HTML5Backend}>{storyNode}</StoryDndProvider>
      ) : (
        storyNode
      )}
    </SafeStoryWrapper>
  );
}
