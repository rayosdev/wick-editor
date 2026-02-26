import { type ReactNode } from "react";
import WickInputV2, { type WickInputV2Option } from "./WickInputV2";

type SharedFieldProps = {
  id?: string;
  label?: string;
  hint?: string;
  error?: string;
  className?: string;
  controlClassName?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  "aria-label"?: string;
  "data-testid"?: string;
};

type TextFieldProps = SharedFieldProps & {
  kind?: "text";
  value: string;
  onValueChange: (value: string) => void;
  maxLength?: number;
};

type NumberFieldProps = SharedFieldProps & {
  kind: "number";
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
};

export type WickFieldOption = WickInputV2Option;

type SelectFieldProps = SharedFieldProps & {
  kind: "select";
  value: string;
  options: WickFieldOption[];
  onValueChange: (value: string) => void;
};

type ToggleFieldProps = SharedFieldProps & {
  kind: "toggle";
  checked: boolean;
  onValueChange: (checked: boolean) => void;
};

type RangeFieldProps = SharedFieldProps & {
  kind: "range";
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
};

type ColorFieldProps = SharedFieldProps & {
  kind: "color";
  value: string;
  onValueChange: (value: string) => void;
  disableAlpha?: boolean;
  colorPickerType?: "swatches" | "spectrum" | string;
  changeColorPickerType?: (type: "swatches" | "spectrum") => void;
  lastColorsUsed?: string[];
  updateLastColors?: (color: string) => void;
};

type ActionFieldProps = SharedFieldProps & {
  kind: "action";
  children: ReactNode;
  onPress: () => void;
  intent?: "neutral" | "primary" | "danger";
};

export type WickFieldProps =
  | TextFieldProps
  | NumberFieldProps
  | SelectFieldProps
  | ToggleFieldProps
  | RangeFieldProps
  | ColorFieldProps
  | ActionFieldProps;

export default function WickField(props: WickFieldProps): JSX.Element {
  const sharedProps = {
    id: props.id,
    label: props.label,
    hint: props.hint,
    error: props.error,
    className: props.className,
    controlClassName: props.controlClassName,
    disabled: props.disabled,
    required: props.required,
    readOnly: props.readOnly,
    placeholder: props.placeholder,
    "aria-label": props["aria-label"],
    "data-testid": props["data-testid"],
  };

  switch (props.kind) {
    case "number":
      return (
        <WickInputV2
          {...sharedProps}
          kind="number"
          value={props.value}
          onChange={props.onValueChange}
          min={props.min}
          max={props.max}
          step={props.step}
          precision={props.precision}
        />
      );

    case "select":
      return (
        <WickInputV2
          {...sharedProps}
          kind="select"
          value={props.value}
          options={props.options}
          onChange={props.onValueChange}
        />
      );

    case "toggle":
      return (
        <WickInputV2
          {...sharedProps}
          kind="checkbox"
          checked={props.checked}
          onChange={props.onValueChange}
        />
      );

    case "range":
      return (
        <WickInputV2
          {...sharedProps}
          kind="range"
          value={props.value}
          onChange={props.onValueChange}
          min={props.min}
          max={props.max}
          step={props.step}
        />
      );

    case "color":
      return (
        <WickInputV2
          {...sharedProps}
          kind="color"
          value={props.value}
          onChange={props.onValueChange}
          disableAlpha={props.disableAlpha}
          colorPickerType={props.colorPickerType}
          changeColorPickerType={props.changeColorPickerType}
          lastColorsUsed={props.lastColorsUsed}
          updateLastColors={props.updateLastColors}
        />
      );

    case "action":
      return (
        <WickInputV2
          {...sharedProps}
          kind="action"
          intent={props.intent}
          onClick={() => props.onPress()}
        >
          {props.children}
        </WickInputV2>
      );

    case "text":
    default:
      return (
        <WickInputV2
          {...sharedProps}
          value={props.value}
          onChange={props.onValueChange}
          maxLength={props.maxLength}
        />
      );
  }
}
