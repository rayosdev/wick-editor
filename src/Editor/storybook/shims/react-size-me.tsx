import {
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type SizeSnapshot = {
  width: number;
  height: number;
};

type SizeMeRenderProps = {
  size: SizeSnapshot;
};

type SizeMeProps = {
  children: (props: SizeMeRenderProps) => ReactNode;
};

export function SizeMe({ children }: SizeMeProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<SizeSnapshot>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const updateSize = () => {
      setSize({
        width: container.clientWidth,
        height: container.clientHeight,
      });
    };

    updateSize();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(() => {
      updateSize();
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} style={{ height: "100%", width: "100%" }}>
      {children({ size })}
    </div>
  );
}

export default SizeMe;
