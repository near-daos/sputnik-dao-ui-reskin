import { compact, isFinite, isFunction } from 'lodash';

import {
  CreateProposalValidation,
  ValidationType,
} from '../components/CreateProposalPopup/types';
import { getStringSizeInBytes } from './getStringSizeInBytes';

// eslint-disable-next-line no-useless-escape
const validNameRegexp = /^(?=[0-9a-z])(?=.*[0-9a-z]$)(?!.*__.*)(?!.*--.*)[0-9a-z_\-]*$/;
// Validation rules: https://nomicon.io/DataStructures/Account.html
// eslint-disable-next-line no-useless-escape
const targetRegExp = /^(([a-z\d]+[\-_])*[a-z\d]+\.)*([a-z\d]+[\-_])*[a-z\d]+$/;

export function getValidatorValue(
  validator: ValidationType,
): number | undefined {
  return isFunction(validator) ? validator() : validator;
}

function validateMinLength(value: string, minLength: ValidationType) {
  const minLen = getValidatorValue(minLength) as number;

  return {
    minLen,
    valid: isFinite(minLen) ? value.length >= minLen : true,
  };
}

function validateMaxLength(
  value: string,
  maxLength: ValidationType,
  maxLengthInBytes?: boolean,
) {
  const maxLen = getValidatorValue(maxLength) as number;

  const length = maxLengthInBytes ? getStringSizeInBytes(value) : value.length;

  return {
    maxLen,
    valid: isFinite(maxLen) ? length <= maxLen : true,
  };
}

function validateMinLengthMessage(value: string, minLength: ValidationType) {
  const { valid, minLen } = validateMinLength(value, minLength);

  return valid ? '' : `Can not be less than ${minLen} chars.`;
}

function validateMaxLengthMessage(
  value: string,
  validationObj: CreateProposalValidation,
): string {
  const { maxLength, maxLengthInBytes } = validationObj;
  const { valid, maxLen } = validateMaxLength(
    value,
    maxLength,
    maxLengthInBytes,
  );

  return valid
    ? ''
    : `Can not be more than ${maxLen} chars. Some chars are more "expensive" and available string length might decrease.`;
}

export const validateCouncil = (value: string): boolean =>
  !!value && value.indexOf(',') === -1 && value.indexOf(' ') === -1;

export const validatePurpose = (value: string): boolean =>
  !!value && value.length >= 10 && value.length <= 280;

export const validateName = (value: string): boolean =>
  !!value &&
  value.length >= 2 &&
  value.length <= 35 &&
  validNameRegexp.test(value);

export const validateAmount = (value: string): boolean =>
  !!value && !Number.isNaN(value) && Number(value) >= 3.5;

export const validateNumber = (value: string): boolean =>
  !!value && !Number.isNaN(value) && value.length > 0;

export const validateTarget = (value: string): string => {
  if (targetRegExp.test(value)) {
    return '';
  }

  return 'User account not valid';
};

export function validateDescription(
  value: string,
  validationObj: CreateProposalValidation,
): string {
  if (!validationObj) {
    return '';
  }

  const maxLenError = validateMaxLengthMessage(value, validationObj);
  const minLenError = validateMinLengthMessage(value, validationObj.minLength);

  return compact([minLenError, maxLenError]).join(' ').trim();
}

export function validateForumLink(
  value: string,
  validationObj: CreateProposalValidation,
): string {
  return validationObj ? validateMaxLengthMessage(value, validationObj) : '';
}
