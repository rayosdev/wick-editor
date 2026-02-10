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

interface LogEntry {
  id: string;
  method: string;
  data: any[];
  timestamp: number;
  type?: string;
}

function shouldIgnoreLog(args: any[]): boolean {
  const message = args.map(arg => 
    typeof arg === 'string' ? arg : String(arg)
  ).join(' ');

  return IGNORE_PATTERNS.some(pattern => pattern.test(message));
}

function buildLogEntry(method: string, args: IArguments): LogEntry {
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
 * @param onEntry - Callback function that receives log entries
 * @param targetConsole - Console object to monitor (defaults to global console)
 * @returns Cleanup function to restore original console methods
 */
export function attachConsoleListener(
  onEntry: (entry: LogEntry) => void, 
  targetConsole: Console = console
): () => void {
  if (typeof onEntry !== "function") {
    throw new Error("attachConsoleListener requires an onEntry callback");
  }

  const consoleRef = targetConsole;
  const originals = new Map<string, Function>();

  const wrapMethod = (method: string): void => {
    const original = consoleRef[method as keyof Console];
    if (typeof original !== "function") {
      return;
    }

    originals.set(method, original as Function);

    (consoleRef as any)[method] = function patchedConsoleMethod(...args: any[]) {
      if (method === CLEAR_METHOD) {
        onEntry({ type: "clear" } as LogEntry);
      } else if (!shouldIgnoreLog(args)) {
        // Only log entries that don't match ignore patterns
        onEntry(buildLogEntry(method, arguments));
      }

      return (original as Function).apply(this, args);
    };
  };

  METHODS_TO_MONITOR.forEach(wrapMethod);
  wrapMethod(CLEAR_METHOD);

  return function detachConsoleListener(): void {
    originals.forEach((original, method) => {
      (consoleRef as any)[method] = original;
    });
  };
}
