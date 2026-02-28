export type SelectionColorValue =
  | string
  | {
      toCSS?: (() => string | null | undefined) | undefined;
      rgba?: string | null | undefined;
      hex?: string | null | undefined;
    }
  | null
  | undefined;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function selectionColorToCss(
  value: SelectionColorValue,
  fallback = "#000000"
): string {
  if (isNonEmptyString(value)) {
    return value;
  }

  if (value && typeof value === "object") {
    const toCSS = value.toCSS;
    if (typeof toCSS === "function") {
      try {
        const fromToCSS = toCSS.call(value);
        if (isNonEmptyString(fromToCSS)) {
          return fromToCSS;
        }
      } catch {
        // Ignore invalid toCSS implementations and continue with fallback fields.
      }
    }

    if (isNonEmptyString(value.rgba)) {
      return value.rgba;
    }

    if (isNonEmptyString(value.hex)) {
      return value.hex;
    }
  }

  return fallback;
}
