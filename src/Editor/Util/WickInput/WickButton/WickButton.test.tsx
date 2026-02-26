import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

vi.mock("react-device-detect", () => ({
  isMobile: true,
}));

import WickButton from "Editor/Util/WickInput/WickButton/WickButton";
import {
  DEFAULT_DOUBLE_TAP_WINDOW_MS,
  TOOLTIP_LONG_PRESS_MS,
} from "Editor/Util/WickInput/tooltipBehavior";

describe("WickButton mobile touch behavior", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("triggers primary action on quick tap touchend", () => {
    const onClick = vi.fn();
    render(<WickButton onClick={onClick}>Tap</WickButton>);

    const button = screen.getByRole("button", { name: "Tap" });
    fireEvent.touchStart(button, {
      touches: [{ clientX: 8, clientY: 8 }],
    });

    expect(onClick).not.toHaveBeenCalled();

    fireEvent.touchEnd(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("fires onLongPress and consumes primary click when enabled", () => {
    const onClick = vi.fn();
    const onLongPress = vi.fn();
    render(
      <WickButton onClick={onClick} onLongPress={onLongPress}>
        Hold
      </WickButton>
    );

    const button = screen.getByRole("button", { name: "Hold" });
    fireEvent.touchStart(button, {
      touches: [{ clientX: 20, clientY: 20 }],
    });

    vi.advanceTimersByTime(TOOLTIP_LONG_PRESS_MS);
    expect(onLongPress).toHaveBeenCalledTimes(1);

    fireEvent.touchEnd(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("keeps secondary-action double-tap semantics on mobile", () => {
    const onClick = vi.fn();
    const secondaryAction = vi.fn();
    render(
      <WickButton onClick={onClick} secondaryAction={secondaryAction}>
        Double Tap
      </WickButton>
    );

    const button = screen.getByRole("button", { name: "Double Tap" });

    fireEvent.touchStart(button, {
      touches: [{ clientX: 12, clientY: 12 }],
    });
    fireEvent.touchEnd(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(secondaryAction).not.toHaveBeenCalled();

    vi.advanceTimersByTime(DEFAULT_DOUBLE_TAP_WINDOW_MS / 2);

    fireEvent.touchStart(button, {
      touches: [{ clientX: 13, clientY: 13 }],
    });
    fireEvent.touchEnd(button);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(secondaryAction).toHaveBeenCalledTimes(1);
  });
});
