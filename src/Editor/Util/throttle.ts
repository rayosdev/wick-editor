export type ThrottledFunction<T extends (...args: never[]) => unknown> = ((
  ...args: Parameters<T>
) => void) & {
  cancel: () => void;
  flush: () => void;
};

const now = (): number => Date.now();

export const throttle = <T extends (...args: never[]) => unknown>(
  func: T,
  waitMs: number,
): ThrottledFunction<T> => {
  let timeoutId: number | null = null;
  let lastInvokeTime = 0;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: unknown = null;

  const invoke = (): void => {
    lastInvokeTime = now();
    const args = lastArgs;
    const context = lastThis as ThisParameterType<T>;
    lastArgs = null;
    lastThis = null;
    if (args) {
      func.apply(context, args);
    }
  };

  const scheduleTrailing = (remainingMs: number): void => {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(() => {
      timeoutId = null;
      if (lastArgs) {
        invoke();
      }
    }, Math.max(0, remainingMs));
  };

  const throttled = function (
    this: ThisParameterType<T>,
    ...args: Parameters<T>
  ): void {
    const currentTime = now();
    const elapsedMs = currentTime - lastInvokeTime;
    const remainingMs = waitMs - elapsedMs;
    const shouldInvoke = lastInvokeTime === 0 || elapsedMs >= waitMs;
    lastArgs = args;
    lastThis = this;

    if (shouldInvoke) {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }
      invoke();
      return;
    }

    if (timeoutId === null) {
      scheduleTrailing(remainingMs);
    }
  } as ThrottledFunction<T>;

  throttled.cancel = (): void => {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastArgs = null;
    lastThis = null;
    lastInvokeTime = 0;
  };

  throttled.flush = (): void => {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
    if (lastArgs) {
      invoke();
    }
  };

  return throttled;
};
