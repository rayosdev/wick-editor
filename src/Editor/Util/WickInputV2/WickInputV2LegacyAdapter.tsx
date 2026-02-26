import {
  type ButtonHTMLAttributes,
  type FocusEvent,
  type MouseEvent,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import LegacyWickInput from "Editor/Util/WickInput/WickInput";
import WickInputV2, { type WickInputV2Option } from "./WickInputV2";

type LegacyValue = string | number | boolean | object | null;

export type WickInputV2LegacySelectOption = {
  label: string;
  value: LegacyValue;
  disabled?: boolean;
};

type SharedAdapterProps = {
  id?: string;
  name?: string;
  label?: string;
  hint?: string;
  error?: string;
  className?: string;
  containerclassname?: string;
  tooltip?: string;
  tooltipID?: string;
  tooltipPlace?: "top" | "bottom" | "left" | "right";
  tooltipDelayMs?: number;
  tooltipLongPressMs?: number;
  mobileTooltipMode?: "off" | "long-press";
  hasLongPressAction?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  onFocus?: (event: FocusEvent<HTMLElement>) => void;
  onBlur?: (event: FocusEvent<HTMLElement>) => void;
  min?: number;
  max?: number;
  step?: number;
  "aria-label"?: string;
  "data-testid"?: string;
  onClick?: (event?: MouseEvent<HTMLElement>) => void;
  onTouch?: (event?: MouseEvent<HTMLElement>) => void;
  buttonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
  secondaryAction?: () => void;
  disableBasePadding?: boolean;
};

type TextAdapterProps = SharedAdapterProps & {
  type?: "text";
  value?: string;
  onChange?: (value: string) => void;
};

type NumericAdapterProps = SharedAdapterProps & {
  type: "numeric";
  value?: number;
  onChange?: (value: number) => void;
};

type SliderAdapterProps = SharedAdapterProps & {
  type: "slider";
  value?: number;
  onChange?: (value: number) => void;
};

type SelectAdapterProps = SharedAdapterProps & {
  type: "select";
  value?: LegacyValue;
  options?: WickInputV2LegacySelectOption[];
  onChange?: (value: unknown) => void;
};

type CheckboxAdapterProps = SharedAdapterProps & {
  type: "checkbox";
  checked?: boolean;
  value?: boolean;
  onChange?: (value: boolean) => void;
};

type ColorAdapterProps = SharedAdapterProps & {
  type: "color";
  color?: string;
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
  colorPickerType?: string;
  changeColorPickerType?: (type: "swatches" | "spectrum") => void;
  disableAlpha?: boolean;
  lastColorsUsed?: string[];
  updateLastColors?: (color: string) => void;
  value?: string;
  onChange?: (value: string) => void;
};

type ButtonAdapterProps = SharedAdapterProps & {
  type: "button";
  children?: ReactNode;
  onClick?: (event?: MouseEvent<HTMLElement>) => void;
};

export type WickInputV2LegacyAdapterProps =
  | TextAdapterProps
  | NumericAdapterProps
  | SliderAdapterProps
  | SelectAdapterProps
  | CheckboxAdapterProps
  | ColorAdapterProps
  | ButtonAdapterProps;

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

export default function WickInputV2LegacyAdapter(
  props: WickInputV2LegacyAdapterProps
): JSX.Element {
  const legacyAriaLabel = props["aria-label"] ?? props.label;
  const sharedProps = {
    id: props.id,
    name: props.name,
    label: props.label,
    hint: props.hint,
    error: props.error,
    className: props.containerclassname,
    controlClassName: props.className,
    disabled: props.disabled,
    readOnly: props.readOnly,
    required: props.required,
    placeholder: props.placeholder,
    maxLength: props.maxLength,
    onFocus: props.onFocus,
    onBlur: props.onBlur,
    onClick: props.onClick,
    "aria-label": props["aria-label"],
    "data-testid": props["data-testid"],
  };

  switch (props.type) {
    case "numeric":
      return (
        <LegacyWickInput
          type="numeric"
          id={props.id}
          className={props.className}
          containerclassname={props.containerclassname}
          tooltip={props.tooltip}
          tooltipID={props.tooltipID}
          tooltipPlace={props.tooltipPlace}
          tooltipDelayMs={props.tooltipDelayMs}
          tooltipLongPressMs={props.tooltipLongPressMs}
          mobileTooltipMode={props.mobileTooltipMode}
          hasLongPressAction={props.hasLongPressAction}
          value={toSafeNumber(props.value)}
          min={props.min}
          max={props.max}
          step={props.step}
          readOnly={props.readOnly}
          disableBasePadding={props.disableBasePadding}
          aria-label={legacyAriaLabel}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          onChange={(value) => props.onChange?.(toSafeNumber(value))}
          onClick={(event?: SyntheticEvent) =>
            props.onClick?.(event as MouseEvent<HTMLElement> | undefined)
          }
        />
      );

    case "slider":
      return (
        <LegacyWickInput
          type="slider"
          id={props.id}
          className={props.className}
          containerclassname={props.containerclassname}
          tooltip={props.tooltip}
          tooltipID={props.tooltipID}
          tooltipPlace={props.tooltipPlace}
          tooltipDelayMs={props.tooltipDelayMs}
          tooltipLongPressMs={props.tooltipLongPressMs}
          mobileTooltipMode={props.mobileTooltipMode}
          hasLongPressAction={props.hasLongPressAction}
          value={toSafeNumber(props.value)}
          min={props.min}
          max={props.max}
          step={props.step}
          readOnly={props.readOnly}
          aria-label={legacyAriaLabel}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          onChange={(value) => props.onChange?.(toSafeNumber(value))}
          onClick={(event?: SyntheticEvent) =>
            props.onClick?.(event as MouseEvent<HTMLElement> | undefined)
          }
        />
      );

    case "select": {
      const legacyOptions = props.options ?? [];
      const tokenizedOptions = legacyOptions.map((option, index) => ({
        token: `wick-opt-${index}`,
        option,
      }));
      const selectedToken =
        tokenizedOptions.find(({ option }) => Object.is(option.value, props.value))
          ?.token ??
        tokenizedOptions.find(
          ({ option }) => String(option.value) === String(props.value)
        )?.token ??
        tokenizedOptions[0]?.token ??
        "";
      const selectOptions: WickInputV2Option[] = tokenizedOptions.map(
        ({ token, option }) => ({
          label: option.label,
          value: token,
          disabled: option.disabled,
        })
      );

      return (
        <WickInputV2
          {...sharedProps}
          kind="select"
          value={selectedToken}
          options={selectOptions}
          onChange={(selectedValue) => {
            const matchedOption = tokenizedOptions.find(
              ({ token }) => token === selectedValue
            )?.option;
            props.onChange?.(
              matchedOption ? matchedOption.value : selectedValue
            );
          }}
        />
      );
    }

    case "checkbox":
      return (
        <WickInputV2
          {...sharedProps}
          kind="checkbox"
          checked={toSafeBoolean(props.checked ?? props.value)}
          onChange={(checked) => props.onChange?.(checked)}
        />
      );

    case "button":
      return (
        <LegacyWickInput
          type="button"
          className={props.className}
          containerclassname={props.containerclassname}
          tooltip={props.tooltip}
          tooltipID={props.tooltipID}
          tooltipPlace={props.tooltipPlace}
          tooltipDelayMs={props.tooltipDelayMs}
          tooltipLongPressMs={props.tooltipLongPressMs}
          mobileTooltipMode={props.mobileTooltipMode}
          hasLongPressAction={props.hasLongPressAction}
          aria-label={legacyAriaLabel}
          onClick={(event?: SyntheticEvent) =>
            props.onClick?.(event as MouseEvent<HTMLElement> | undefined)
          }
          onTouch={(event?: SyntheticEvent) =>
            props.onTouch?.(event as MouseEvent<HTMLElement> | undefined)
          }
          buttonProps={props.buttonProps}
          secondaryAction={props.secondaryAction}
        >
          {props.children ?? props.label ?? "Action"}
        </LegacyWickInput>
      );

    case "color":
      return (
        <LegacyWickInput
          type="color"
          id={props.id}
          className={props.className}
          containerclassname={props.containerclassname}
          tooltip={props.tooltip}
          tooltipID={props.tooltipID}
          tooltipPlace={props.tooltipPlace}
          tooltipDelayMs={props.tooltipDelayMs}
          tooltipLongPressMs={props.tooltipLongPressMs}
          mobileTooltipMode={props.mobileTooltipMode}
          hasLongPressAction={props.hasLongPressAction}
          aria-label={legacyAriaLabel}
          color={toSafeString(props.color ?? props.value, "#4fa3ff")}
          stroke={props.stroke}
          placement={props.placement}
          colorPickerType={props.colorPickerType}
          changeColorPickerType={
            props.changeColorPickerType
              ? (type: string) =>
                  props.changeColorPickerType?.(
                    type === "spectrum" ? "spectrum" : "swatches"
                  )
              : undefined
          }
          disableAlpha={props.disableAlpha}
          lastColorsUsed={props.lastColorsUsed}
          updateLastColors={props.updateLastColors}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          onClick={(event?: SyntheticEvent) =>
            props.onClick?.(event as MouseEvent<HTMLElement> | undefined)
          }
          onChange={(value) =>
            props.onChange?.(
              toSafeString(value, toSafeString(props.color ?? props.value, "#4fa3ff"))
            )
          }
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
