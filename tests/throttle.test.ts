import { afterEach, describe, expect, it, vi } from "vitest";
import { throttle } from "Editor/Util/throttle";

describe("throttle", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("runs on leading edge and trailing edge with latest args", () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled("first");
    throttled("second");

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenNthCalledWith(1, "first");

    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenNthCalledWith(2, "second");
  });

  it("cancel drops pending trailing call", () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled("first");
    throttled("second");
    throttled.cancel();
    vi.advanceTimersByTime(200);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("first");
  });

  it("flush invokes pending trailing call immediately", () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled("first");
    throttled("second");
    throttled.flush();

    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenNthCalledWith(2, "second");
  });
});
