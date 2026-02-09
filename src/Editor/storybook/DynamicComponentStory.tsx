import React, { useEffect, useState } from "react";
import SafeStoryWrapper from "./SafeStoryWrapper";

type ComponentModule = Record<string, unknown> & {
  default?: unknown;
};

type DynamicComponentStoryProps = {
  componentName: string;
  loader: () => Promise<ComponentModule>;
  args?: Record<string, unknown>;
};

function resolveComponent(mod: ComponentModule): React.ComponentType<any> {
  if (typeof mod.default === "function") {
    return mod.default as React.ComponentType<any>;
  }

  for (const candidate of Object.values(mod)) {
    if (typeof candidate === "function") {
      return candidate as React.ComponentType<any>;
    }
  }

  throw new Error("No React component export found.");
}

export default function DynamicComponentStory({
  componentName,
  loader,
  args = {},
}: DynamicComponentStoryProps): JSX.Element {
  const [LoadedComponent, setLoadedComponent] = useState<React.ComponentType<any> | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoadedComponent(null);
    setLoadError(null);

    loader()
      .then((mod) => {
        if (!cancelled) {
          setLoadedComponent(() => resolveComponent(mod));
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
      <LoadedComponent {...args} />
    </SafeStoryWrapper>
  );
}
