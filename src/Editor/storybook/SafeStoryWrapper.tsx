import React from "react";

type SafeStoryWrapperProps = {
  children: React.ReactNode;
  componentName: string;
};

type SafeStoryWrapperState = {
  hasError: boolean;
  errorMessage: string | null;
};

class SafeStoryWrapper extends React.Component<
  SafeStoryWrapperProps,
  SafeStoryWrapperState
> {
  public state: SafeStoryWrapperState = {
    hasError: false,
    errorMessage: null,
  };

  public static getDerivedStateFromError(error: Error): SafeStoryWrapperState {
    return {
      hasError: true,
      errorMessage: error.message,
    };
  }

  public componentDidCatch(error: Error): void {
    // Keep detailed diagnostics in Storybook's console while showing a readable fallback in the canvas.
    // eslint-disable-next-line no-console
    console.error(`[Storybook] ${this.props.componentName} crashed`, error);
  }

  public render(): React.ReactNode {
    if (this.state.hasError) {
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
          <strong>{this.props.componentName}</strong> failed to render.
          <div>{this.state.errorMessage ?? "Unknown error."}</div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SafeStoryWrapper;
