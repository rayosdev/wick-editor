import { useState, useEffect, InputHTMLAttributes } from "react";

import classNames from "classnames";

interface WickTextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string | number;
  onChange?: (val: string) => void;
  isValid?: (val: string) => boolean;
  isValidRegex?: RegExp;
  cleanUp?: (val: string) => string;
}

/**
 * A delayed text input object that will not fire the provided onChange unless the value is valid, and
 * passes a provided isValid function.
 *
 * @param props - Component props
 * @param props.isValid - Returns true if the value provided is acceptable, false otherwise
 * @param props.isValidRegex - A regular expression to check against for validity
 * @param props.cleanUp - Valid values will be passed to this function prior to being displayed, and sent to the onChange function
 * @returns JSX.Element
 */
export default function WickTextInput(props: WickTextInputProps): JSX.Element {
  const [displayValue, setDisplayValue] = useState<string | number>(props.value);
  const [valueIsValid, setValueIsValid] = useState<boolean>(true);

  let { isValid, cleanUp, isValidRegex, ...rest } = props;

  // Update the display value if it's updated elsewhere.
  useEffect(() => {
    let val = props.value.toString();
    if (fullIsValid(val)) {
      val = internalCleanup(val);
    }

    setDisplayValue(val);
  }, [props.value]);

  function wrappedOnChange(val: string): void {
    props.onChange && props.onChange(val);
  }

  function internalCleanup(val: string): string {
    if (cleanUp) {
      return cleanUp(val);
    }
    return val;
  }

  /**
   * Returns true if all conditions for validity of this input are met.
   * If no validity methods have been passed to this object, returns true;
   */
  function fullIsValid(val: string): boolean {
    // Default to true;
    let valid = true;

    if (isValid) {
      valid = valid && isValid(val);
    }

    if (isValidRegex) {
      valid = valid && isValidRegex.test(val);
    }

    return valid;
  }

  /**
   * Updates the displayed and internal value of the input. Will fire on change if all
   * requirements for validity are satisfied, otherwise, does not.
   */
  function internalOnChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const val = e.target.value;

    let cleanVal = internalCleanup(val);

    if (fullIsValid(val)) {
      setValueIsValid(true);
      wrappedOnChange(cleanVal);
      setDisplayValue(cleanVal.toString());
    } else {
      setDisplayValue(cleanVal);
      setValueIsValid(false);
    }
  }

  return (
    <input
      {...rest}
      className={classNames(props.className, {
        invalid: !valueIsValid,
        valid: valueIsValid,
      })}
      value={displayValue}
      type="text"
      onChange={internalOnChange}
      onBlur={internalOnChange}
    />
  );
}
