import tinycolor from "tinycolor2";
import type { PickerColorValue, PickerColorChange, PickerColorRGB } from "./ColorPicker";

export interface HSVAColor {
  h: number;
  s: number;
  v: number;
  a: number;
}

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, value));
};

export const getColorString = (color: PickerColorValue): string => {
  if (typeof color === "string") {
    return color;
  }

  return color.rgba ?? String(color);
};

export const toHsva = (color: PickerColorValue): HSVAColor => {
  const parsed = tinycolor(getColorString(color)).toHsv();

  return {
    h: Number.isFinite(parsed.h) ? parsed.h : 0,
    s: clamp(parsed.s ?? 0, 0, 1),
    v: clamp(parsed.v ?? 0, 0, 1),
    a: clamp(parsed.a ?? 1, 0, 1),
  };
};

export const hsvaToRgb = (hsva: HSVAColor): PickerColorRGB => {
  const rgb = tinycolor({
    h: hsva.h,
    s: clamp(hsva.s, 0, 1),
    v: clamp(hsva.v, 0, 1),
    a: clamp(hsva.a, 0, 1),
  }).toRgb();

  return {
    r: rgb.r,
    g: rgb.g,
    b: rgb.b,
    a: rgb.a,
  };
};

export const hsvaToHex = (hsva: HSVAColor): string => {
  return tinycolor({
    h: hsva.h,
    s: clamp(hsva.s, 0, 1),
    v: clamp(hsva.v, 0, 1),
    a: clamp(hsva.a, 0, 1),
  }).toHexString();
};

export const hsvaToRgbaString = (hsva: HSVAColor): string => {
  const rgb = hsvaToRgb(hsva);
  return `rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`;
};

export const hsvaToPickerColor = (hsva: HSVAColor): PickerColorChange => {
  return {
    hex: hsvaToHex(hsva),
    rgb: hsvaToRgb(hsva),
  };
};

export const parseHexToPickerColor = (hex: string): PickerColorChange => {
  const parsed = tinycolor(hex);
  const rgb = parsed.toRgb();
  return {
    hex: parsed.toHexString(),
    rgb: {
      r: rgb.r,
      g: rgb.g,
      b: rgb.b,
      a: rgb.a,
    },
  };
};
