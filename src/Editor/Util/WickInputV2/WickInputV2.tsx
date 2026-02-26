import { type FocusEvent, type MouseEvent, type ReactNode, useId } from "react";
import classNames from "classnames";
import ColorPicker, {
  type PickerColorChange,
} from "Editor/Util/ColorPicker/ColorPicker";
import "./WickInputV2.css";

export type WickInputV2Option = {
  label: string;
  value: string;
  disabled?: boolean;
};

type SharedProps = {
  id?: string;
  name?: string;
  label?: string;
  hint?: string;
  error?: string;
  className?: string;
  controlClassName?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  maxLength?: number;
  onFocus?: (event: FocusEvent<HTMLElement>) => void;
  onBlur?: (event: FocusEvent<HTMLElement>) => void;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  "aria-label"?: string;
  "data-testid"?: string;
};

type TextInputProps = SharedProps & {
  kind?: "text";
  value: string;
  onChange: (value: string) => void;
};

type NumberInputProps = SharedProps & {
  kind: "number";
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
};

type SelectInputProps = SharedProps & {
  kind: "select";
  value: string;
  onChange: (value: string) => void;
  options: WickInputV2Option[];
};

type CheckboxInputProps = SharedProps & {
  kind: "checkbox";
  checked: boolean;
  onChange: (checked: boolean) => void;
};

type RangeInputProps = SharedProps & {
  kind: "range";
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
};

type ColorInputProps = SharedProps & {
  kind: "color";
  value: string;
  onChange: (value: string) => void;
  stroke?: boolean;
  placement?:
    | "auto"
    | "auto-start"
    | "auto-end"
    | "top"
    | "top-start"
    | "top-end"
    | "right"
    | "right-start"
    | "right-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "left"
    | "left-start"
    | "left-end";
  colorPickerType?: "swatches" | "spectrum" | string;
  changeColorPickerType?: (type: "swatches" | "spectrum") => void;
  disableAlpha?: boolean;
  lastColorsUsed?: string[];
  updateLastColors?: (color: string) => void;
};

type ActionInputProps = SharedProps & {
  kind: "action";
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  intent?: "neutral" | "primary" | "danger";
  children: ReactNode;
};

export type WickInputV2Props =
  | TextInputProps
  | NumberInputProps
  | SelectInputProps
  | CheckboxInputProps
  | RangeInputProps
  | ColorInputProps
  | ActionInputProps;

type ControlA11y = {
  describedBy?: string;
  invalid: boolean;
};

const DEFAULT_RANGE_MIN = 0;
const DEFAULT_RANGE_MAX = 100;
const DEFAULT_RANGE_STEP = 1;

function clampNumber(value: number, min?: number, max?: number): number {
  let output = value;
  if (min !== undefined) {
    output = Math.max(output, min);
  }

  if (max !== undefined) {
    output = Math.min(output, max);
  }

  return output;
}

function applyPrecision(value: number, precision?: number): number {
  if (precision === undefined || precision < 0) {
    return value;
  }

  const multiplier = 10 ** precision;
  return Math.round(value * multiplier) / multiplier;
}

function normalizeColor(value: string): string {
  const normalized = value.trim();
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(normalized)) {
    return normalized;
  }

  return "#4fa3ff";
}

function toColorString(color: PickerColorChange): string {
  if (color.rgb) {
    const { r, g, b, a } = color.rgb;
    return `rgba(${r},${g},${b},${a})`;
  }

  if (typeof color.hex === "string") {
    return color.hex;
  }

  return "#4fa3ff";
}

function renderControl(
  props: WickInputV2Props,
  controlId: string,
  a11y: ControlA11y
): ReactNode {
  const baseControlClass = classNames("wick-input-v2-control", props.controlClassName);
  switch (props.kind) {
    case "number":
      return (
        <input
          id={controlId}
          type="number"
          className={classNames(baseControlClass, "wick-input-v2-control--number")}
          value={props.value}
          min={props.min}
          max={props.max}
          step={props.step}
          name={props.name}
          onChange={(event) => {
            const parsed = Number(event.currentTarget.value);
            if (Number.isNaN(parsed)) {
              return;
            }

            const clamped = clampNumber(parsed, props.min, props.max);
            props.onChange(applyPrecision(clamped, props.precision));
          }}
          disabled={props.disabled}
          readOnly={props.readOnly}
          required={props.required}
          aria-label={props["aria-label"]}
          aria-invalid={a11y.invalid || undefined}
          aria-describedby={a11y.describedBy}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          onClick={props.onClick}
        />
      );

    case "select":
      return (
        <select
          id={controlId}
          className={classNames(baseControlClass, "wick-input-v2-control--select")}
          value={props.value}
          name={props.name}
          onChange={(event) => props.onChange(event.currentTarget.value)}
          disabled={props.disabled}
          required={props.required}
          aria-label={props["aria-label"]}
          aria-invalid={a11y.invalid || undefined}
          aria-describedby={a11y.describedBy}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          onClick={props.onClick}
        >
          {props.options.map((option: WickInputV2Option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
      );

    case "checkbox":
      return (
        <label
          htmlFor={controlId}
          className={classNames(baseControlClass, "wick-input-v2-control--checkbox")}
        >
          <input
            id={controlId}
            type="checkbox"
            className="wick-input-v2-checkbox"
            name={props.name}
            checked={props.checked}
            onChange={(event) => props.onChange(event.currentTarget.checked)}
            disabled={props.disabled}
            required={props.required}
            aria-label={props["aria-label"]}
            aria-invalid={a11y.invalid || undefined}
            aria-describedby={a11y.describedBy}
            onFocus={props.onFocus}
            onBlur={props.onBlur}
            onClick={props.onClick}
          />
          <span className="wick-input-v2-checkbox-label">{props.label ?? "Enabled"}</span>
        </label>
      );

    case "range":
      return (
        <input
          id={controlId}
          type="range"
          className={classNames(baseControlClass, "wick-input-v2-control--range")}
          value={props.value}
          min={props.min ?? DEFAULT_RANGE_MIN}
          max={props.max ?? DEFAULT_RANGE_MAX}
          step={props.step ?? DEFAULT_RANGE_STEP}
          name={props.name}
          onChange={(event) => {
            const next = Number(event.currentTarget.value);
            if (!Number.isNaN(next)) {
              props.onChange(next);
            }
          }}
          disabled={props.disabled}
          readOnly={props.readOnly}
          required={props.required}
          aria-label={props["aria-label"]}
          aria-invalid={a11y.invalid || undefined}
          aria-describedby={a11y.describedBy}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          onClick={props.onClick}
        />
      );

    case "color":
      if (
        props.placement !== undefined ||
        props.colorPickerType !== undefined ||
        props.changeColorPickerType !== undefined ||
        props.disableAlpha !== undefined ||
        props.stroke !== undefined ||
        props.updateLastColors !== undefined ||
        props.lastColorsUsed !== undefined
      ) {
        return (
          <ColorPicker
            id={controlId}
            className={classNames(baseControlClass, "wick-input-v2-control--color")}
            color={props.value}
            stroke={props.stroke}
            placement={props.placement}
            colorPickerType={props.colorPickerType}
            changeColorPickerType={props.changeColorPickerType}
            disableAlpha={props.disableAlpha}
            lastColorsUsed={props.lastColorsUsed}
            onChangeComplete={(color) => {
              const nextColor = toColorString(color);
              props.updateLastColors?.(nextColor);
              props.onChange(nextColor);
            }}
          />
        );
      }

      return (
        <input
          id={controlId}
          type="color"
          className={classNames(baseControlClass, "wick-input-v2-control--color")}
          value={normalizeColor(props.value)}
          name={props.name}
          onChange={(event) => props.onChange(event.currentTarget.value)}
          disabled={props.disabled}
          readOnly={props.readOnly}
          required={props.required}
          aria-label={props["aria-label"]}
          aria-invalid={a11y.invalid || undefined}
          aria-describedby={a11y.describedBy}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          onClick={props.onClick}
        />
      );

    case "action":
      return (
        <button
          id={controlId}
          type="button"
          className={classNames(
            baseControlClass,
            "wick-input-v2-control--action",
            `wick-input-v2-control--${props.intent ?? "neutral"}`
          )}
          name={props.name}
          onClick={props.onClick}
          disabled={props.disabled}
          aria-label={props["aria-label"]}
          aria-describedby={a11y.describedBy}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
        >
          {props.children}
        </button>
      );

    case "text":
    case undefined:
    default: {
      const textProps = props as TextInputProps;
      return (
        <input
          id={controlId}
          type="text"
          className={classNames(baseControlClass, "wick-input-v2-control--text")}
          value={textProps.value}
          name={textProps.name}
          onChange={(event) => textProps.onChange(event.currentTarget.value)}
          placeholder={textProps.placeholder}
          maxLength={textProps.maxLength}
          disabled={textProps.disabled}
          readOnly={textProps.readOnly}
          required={textProps.required}
          aria-label={textProps["aria-label"]}
          aria-invalid={a11y.invalid || undefined}
          aria-describedby={a11y.describedBy}
          onFocus={textProps.onFocus}
          onBlur={textProps.onBlur}
          onClick={textProps.onClick}
        />
      );
    }
  }
}

export default function WickInputV2(props: WickInputV2Props): JSX.Element {
  const generatedId = useId().replace(/:/g, "");
  const controlId = props.id ?? `wick-input-v2-${generatedId}`;
  const hintId = props.hint ? `${controlId}-hint` : undefined;
  const errorId = props.error ? `${controlId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  const kind = props.kind ?? "text";
  const showTopLabel =
    Boolean(props.label) && kind !== "checkbox" && kind !== "action";
  const compactLegacyLayout = !showTopLabel && !props.hint && !props.error;

  return (
    <div
      className={classNames("wick-input-v2-field", props.className, {
        "wick-input-v2-field--error": Boolean(props.error),
        "wick-input-v2-field--disabled": props.disabled,
        "wick-input-v2-field--compact": compactLegacyLayout,
      })}
      data-testid={props["data-testid"]}
    >
      {showTopLabel && (
        <label htmlFor={controlId} className="wick-input-v2-label">
          {props.label}
          {props.required && (
            <span className="wick-input-v2-required" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      {renderControl(props, controlId, {
        describedBy,
        invalid: Boolean(props.error),
      })}

      {props.error ? (
        <p id={errorId} className="wick-input-v2-message wick-input-v2-message--error">
          {props.error}
        </p>
      ) : props.hint ? (
        <p id={hintId} className="wick-input-v2-message">
          {props.hint}
        </p>
      ) : null}
    </div>
  );
}
