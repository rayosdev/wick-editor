type WindowWithAppRuntime = Window & {
  project?: unknown;
  paper?: unknown;
};

export const setProjectRuntime = (projectRuntime: unknown): void => {
  (window as WindowWithAppRuntime).project = projectRuntime;
};

export const getPaperRuntime = <T = unknown>(): T | null => {
  const paperRuntime = (window as WindowWithAppRuntime).paper;
  if (paperRuntime === null || paperRuntime === undefined) {
    return null;
  }

  return paperRuntime as T;
};
