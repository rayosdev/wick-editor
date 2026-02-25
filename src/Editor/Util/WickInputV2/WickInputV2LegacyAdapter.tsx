import { type ReactNode } from "react";
import WickInputV2, { type WickInputV2Option } from "./WickInputV2";

type LegacyValue = string | number | boolean;

export type WickInputV2LegacySelectOption = {
  label: string;
  value: LegacyValue;
  disabled?: boolean;
};

export type WickInputV2LegacyAdapterProps = {
  type?:
    | "numeric"
    | "text"
    | "slider"
    | "select"
    | "color"
    | "checkbox"
    | "button";
  id?: string;
  label?: string;
  hint?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  value?: LegacyValue;
  min?: number;
  max?: number;
  step?: number;
  options?: WickInputV2LegacySelectOption[];
  children?: ReactNode;
  onChange?: (value: LegacyValue) => void;
  onClick?: () => void;
  [key: string]: unknown;
};

function toSafeString(value: unknown, fallback = ""): string {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return fallback;
}

function toSafeNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function toSafeBoolean(value: unknown): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }

  if (typeof value === "number") {
    return value !== 0;
  }

  return false;
}

function toSelectOptions(
  options: WickInputV2LegacySelectOption[]
): WickInputV2Option[] {
  return options.map((option) => ({
    label: option.label,
    value: String(option.value),
    disabled: option.disabled,
  }));
}

export default function WickInputV2LegacyAdapter(
  props: WickInputV2LegacyAdapterProps
): JSX.Element {
  const sharedProps = {
    id: props.id,
    label: props.label,
    hint: props.hint,
    error: props.error,
    className: props.className,
    disabled: props.disabled,
    readOnly: props.readOnly,
    required: props.required,
  };

  switch (props.type) {
    case "numeric":
      return (
        <WickInputV2
          {...sharedProps}
          kind="number"
          value={toSafeNumber(props.value)}
          min={props.min}
          max={props.max}
          step={props.step}
          onChange={(value) => props.onChange?.(value)}
        />
      );

    case "slider":
      return (
        <WickInputV2
          {...sharedProps}
          kind="range"
          value={toSafeNumber(props.value)}
          min={props.min}
          max={props.max}
          step={props.step}
          onChange={(value) => props.onChange?.(value)}
        />
      );

    case "select": {
      const legacyOptions = props.options ?? [];
      const optionByStringValue = new Map<string, LegacyValue>(
        legacyOptions.map((option) => [String(option.value), option.value])
      );

      return (
        <WickInputV2
          {...sharedProps}
          kind="select"
          value={toSafeString(props.value)}
          options={toSelectOptions(legacyOptions)}
          onChange={(selectedValue) =>
            props.onChange?.(
              optionByStringValue.get(selectedValue) ?? selectedValue
            )
          }
        />
      );
    }

    case "checkbox":
      return (
        <WickInputV2
          {...sharedProps}
          kind="checkbox"
          checked={toSafeBoolean(props.value)}
          onChange={(checked) => props.onChange?.(checked)}
        />
      );

    case "button":
      return (
        <WickInputV2
          {...sharedProps}
          kind="action"
          onClick={() => props.onClick?.()}
        >
          {props.children ?? props.label ?? "Action"}
        </WickInputV2>
      );

    case "color":
      return (
        <WickInputV2
          {...sharedProps}
          kind="color"
          value={toSafeString(props.value, "#4fa3ff")}
          onChange={(value) => props.onChange?.(value)}
        />
      );

    case "text":
    case undefined:
    default:
      return (
        <WickInputV2
          {...sharedProps}
          value={toSafeString(props.value)}
          onChange={(value) => props.onChange?.(value)}
        />
      );
  }
}
