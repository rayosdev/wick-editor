import type { AnyRecord } from "../types";
import { deepGet, deepSet } from "./deepObject";

export class ApiRegistry {
  private readonly overrides = new Map<string, unknown>();

  constructor(private readonly rootApi: AnyRecord) {}

  register(path: string, value: unknown, patchRoot = true): void {
    this.overrides.set(path, value);

    if (patchRoot) {
      deepSet(this.rootApi, path, value);
    }
  }

  resolve<T = unknown>(path: string): T | undefined {
    if (this.overrides.has(path)) {
      return this.overrides.get(path) as T;
    }

    return deepGet(this.rootApi, path) as T | undefined;
  }
}
