import type { WickNamespace } from "Editor/types/engine.types";

type WickRuntime = Partial<WickNamespace>;
export type WickColorLike = {
  rgba?: string;
  hex?: string;
};

const getWickRuntime = (): WickRuntime | null => {
  const wickGlobal = window.Wick as WickRuntime | undefined;
  if (!wickGlobal || typeof wickGlobal !== "object") {
    return null;
  }

  return wickGlobal;
};

export const createWickColor = (value: string): string | WickColorLike => {
  const colorConstructor = getWickRuntime()?.Color;
  if (!colorConstructor) {
    return value;
  }

  return new colorConstructor(value) as WickColorLike;
};

export const getWickTweenEasingTypes = (): string[] => {
  const easingTypes = getWickRuntime()?.Tween?.VALID_EASING_TYPES;
  if (!Array.isArray(easingTypes)) {
    return [];
  }

  return easingTypes.filter((option): option is string => typeof option === "string");
};
