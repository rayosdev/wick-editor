let logIdCounter = 0;

const METHODS_TO_MONITOR = ["log", "info", "warn", "error", "debug"];
const CLEAR_METHOD = "clear";

function buildLogEntry(method, args) {
  return {
    id: `${Date.now()}-${logIdCounter++}`,
    method,
    data: Array.from(args),
    timestamp: Date.now(),
  };
}

/**
 * Attaches listeners to the provided console object so that every call to a monitored
 * console method is reported through the `onEntry` callback. The original console methods
 * are preserved and restored when the returned cleanup function is executed.
 *
 * @param {(entry: { id: string; method: string; data: any[]; timestamp: number; type?: string }) => void} onEntry
 * @param {Console} targetConsole
 * @returns {() => void}
 */
export function attachConsoleListener(onEntry, targetConsole = console) {
  if (typeof onEntry !== "function") {
    throw new Error("attachConsoleListener requires an onEntry callback");
  }

  const consoleRef = targetConsole;
  const originals = new Map();

  const wrapMethod = (method) => {
    const original = consoleRef[method];
    if (typeof original !== "function") {
      return;
    }

    originals.set(method, original);

    consoleRef[method] = function patchedConsoleMethod(...args) {
      if (method === CLEAR_METHOD) {
        onEntry({ type: "clear" });
      } else {
        onEntry(buildLogEntry(method, args));
      }

      return original.apply(this, args);
    };
  };

  METHODS_TO_MONITOR.forEach(wrapMethod);
  wrapMethod(CLEAR_METHOD);

  return function detachConsoleListener() {
    originals.forEach((original, method) => {
      consoleRef[method] = original;
    });
  };
}
