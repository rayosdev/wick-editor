import type { AnyRecord } from "../types";
import { ProjectTracker } from "./projectTracker";

const WRAPPED_FLAG = Symbol("wick-engine-next-wrapped");

type AnyFn = (...args: any[]) => any;

type AnyConstructor = new (...args: any[]) => any;

function isFunction(value: unknown): value is AnyFn {
  return typeof value === "function";
}

function isWrapped(value: unknown): boolean {
  return Boolean((value as Record<PropertyKey, unknown> | undefined)?.[WRAPPED_FLAG]);
}

function markWrapped(value: unknown): void {
  if (!value || (typeof value !== "function" && typeof value !== "object")) {
    return;
  }

  Object.defineProperty(value, WRAPPED_FLAG, {
    value: true,
    configurable: false,
    enumerable: false,
    writable: false
  });
}

export function wrapProjectClass(ProjectCtor: AnyConstructor, tracker: ProjectTracker): AnyConstructor {
  if (!isFunction(ProjectCtor) || isWrapped(ProjectCtor)) {
    return ProjectCtor;
  }

  class ProjectCompat extends ProjectCtor {
    constructor(...args: any[]) {
      super(...args);
      tracker.set(this);
    }

    loadFromData(...args: any[]): unknown {
      const baseLoadFromData = (ProjectCtor.prototype as AnyRecord).loadFromData;

      if (!isFunction(baseLoadFromData)) {
        return undefined;
      }

      const result = baseLoadFromData.apply(this, args);
      tracker.set(this);
      return result;
    }
  }

  const baseFromData = (ProjectCtor as AnyRecord).fromData;
  if (isFunction(baseFromData)) {
    (ProjectCompat as AnyRecord).fromData = (...args: any[]) => {
      const project = baseFromData.apply(ProjectCtor, args);
      if (project && typeof project === "object") {
        tracker.set(project);
      }
      return project;
    };
  }

  markWrapped(ProjectCompat);
  return ProjectCompat;
}

export function wrapCallbackWithProjectTracking(
  host: AnyRecord,
  methodName: string,
  callbackIndex: number,
  tracker: ProjectTracker
): void {
  const originalMethod = host[methodName];

  if (!isFunction(originalMethod) || isWrapped(originalMethod)) {
    return;
  }

  const wrapped: AnyFn = function wrappedMethod(this: unknown, ...args: any[]): unknown {
    const callbackCandidate = args[callbackIndex];

    if (isFunction(callbackCandidate)) {
      args[callbackIndex] = (...callbackArgs: any[]) => {
        const projectCandidate = callbackArgs[0];
        if (projectCandidate && typeof projectCandidate === "object") {
          tracker.set(projectCandidate);
        }

        return callbackCandidate(...callbackArgs);
      };
    }

    return originalMethod.apply(this, args);
  };

  markWrapped(wrapped);
  host[methodName] = wrapped;
}
