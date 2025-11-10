import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validator function to check if the control's value contains only numbers (digits 0-9).
 * * @returns A ValidationErrors object if the input is not a number, otherwise null.
 */
export function onlyNumbersValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    // Get the value from the control
    const value = control.value;

    // If there's no value, or it's an empty string, don't validate (let 'required' handle it)
    if (!value) {
      return null;
    }

    // Regular expression to test for only digits
    const onlyNumbersRegex = /^[0-9]+$/;

    // Test the value against the regex
    const isValid = onlyNumbersRegex.test(value);

    // If valid, return null. If invalid, return an error object.
    return isValid ? null : { 'onlyNumbers': { value: control.value } };
  };
}
