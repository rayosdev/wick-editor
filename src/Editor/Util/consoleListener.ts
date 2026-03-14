import type { ConsoleMethod } from "Editor/types";

let logIdCounter = 0;

const METHODS_TO_MONITOR = ["log", "info", "warn", "error", "debug"] as const;
const CLEAR_METHOD = "clear";

// Patterns to filter out third-party library warnings
const IGNORE_PATTERNS = [
  /Support for defaultProps will be removed/,
  /findDOMNode is deprecated/,
  /transition\.timeout/,
  /Failed .* type:.*prop/,
];

export interface ConsoleListenerLogEntry {
  id: string;
  method: ConsoleMethod;
  data: unknown[];
  timestamp: number;
  type?: undefined;
}

export type ConsoleListenerClearEntry = {
  type: "clear";
};

export type ConsoleListenerEntry =
  | ConsoleListenerLogEntry
  | ConsoleListenerClearEntry;

type ConsoleMethodFn = (...args: unknown[]) => unknown;
type ConsoleRef = Console & Record<string, ConsoleMethodFn>;

function shouldIgnoreLog(args: unknown[]): boolean {
  const message = args.map(arg => 
    typeof arg === 'string' ? arg : String(arg)
  ).join(' ');

  return IGNORE_PATTERNS.some(pattern => pattern.test(message));
}

function buildLogEntry(
  method: ConsoleMethod,
  args: unknown[]
): ConsoleListenerLogEntry {
  return {
    id: `${Date.now()}-${logIdCounter++}`,
    method,
    data: args,
    timestamp: Date.now(),
  };
}

/**
 * Attaches listeners to the provided console object so that every call to a monitored
 * console method is reported through the `onEntry` callback. The original console methods
 * are preserved and restored when the returned cleanup function is executed.
 *
 * @param onEntry - Callback function that receives log entries
 * @param targetConsole - Console object to monitor (defaults to global console)
 * @returns Cleanup function to restore original console methods
 */
export function attachConsoleListener(
  onEntry: (entry: ConsoleListenerEntry) => void,
  targetConsole: Console = console
): () => void {
  if (typeof onEntry !== "function") {
    throw new Error("attachConsoleListener requires an onEntry callback");
  }

  const consoleRef = targetConsole as ConsoleRef;
  const originals = new Map<string, ConsoleMethodFn>();

  const wrapMethod = (method: string): void => {
    const original = consoleRef[method];
    if (typeof original !== "function") {
      return;
    }

    originals.set(method, original);

    consoleRef[method] = function patchedConsoleMethod(...args: unknown[]) {
      if (method === CLEAR_METHOD) {
        onEntry({ type: "clear" });
      } else if (!shouldIgnoreLog(args)) {
        // Only log entries that don't match ignore patterns
        onEntry(buildLogEntry(method as ConsoleMethod, args));
      }

      return original.apply(this, args);
    };
  };

  METHODS_TO_MONITOR.forEach(wrapMethod);
  wrapMethod(CLEAR_METHOD);

  return function detachConsoleListener(): void {
    originals.forEach((original, method) => {
      consoleRef[method] = original;
    });
  };
}
