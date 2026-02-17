import type { AnyRecord } from "../types";

export function splitPath(path: string): string[] {
  return path.split(".").filter(Boolean);
}

export function deepGet(target: unknown, path: string): unknown {
  const keys = splitPath(path);

  let cursor: unknown = target;

  for (const key of keys) {
    if (!cursor || typeof cursor !== "object") {
      return undefined;
    }

    cursor = (cursor as AnyRecord)[key];
  }

  return cursor;
}

export function deepSet(target: unknown, path: string, value: unknown): void {
  const keys = splitPath(path);

  if (!target || typeof target !== "object") {
    throw new Error("deepSet() expected an object target.");
  }

  if (keys.length === 0) {
    throw new Error("deepSet() expected a non-empty path.");
  }

  let cursor = target as AnyRecord;

  for (let index = 0; index < keys.length - 1; index += 1) {
    const key = keys[index];
    const next = cursor[key];

    if (!next || typeof next !== "object") {
      cursor[key] = {};
    }

    cursor = cursor[key] as AnyRecord;
  }

  cursor[keys[keys.length - 1]] = value;
}
