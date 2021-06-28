import { compact, isFinite, isFunction } from 'lodash';

import {
  CreateProposalValidation,
  ValidationType,
} from '../components/CreateProposalPopup/types';

// eslint-disable-next-line no-useless-escape
const validNameRegexp = /^(?=[0-9a-z])(?=.*[0-9a-z]$)(?!.*__.*)(?!.*--.*)[0-9a-z_\-]*$/;
const targetRegExp = /^[0-9a-z][.0-9_a-z]{2,}((.sputnikdao)?.near|.testnet)$/;

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

function validateMaxLength(value: string, maxLength: ValidationType) {
  const maxLen = getValidatorValue(maxLength) as number;

  return {
    maxLen,
    valid: isFinite(maxLen) ? value.length <= maxLen : true,
  };
}

function validateMinLengthMessage(value: string, minLength: ValidationType) {
  const { valid, minLen } = validateMinLength(value, minLength);

  return valid ? '' : `Can not be less than ${minLen} chars.`;
}

function validateMaxLengthMessage(
  value: string,
  maxLength: ValidationType,
): string {
  const { valid, maxLen } = validateMaxLength(value, maxLength);

  return valid ? '' : `Can not be more than ${maxLen} chars.`;
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

  const maxLenError = validateMaxLengthMessage(value, validationObj.maxLength);
  const minLenError = validateMinLengthMessage(value, validationObj.minLength);

  return compact([minLenError, maxLenError]).join(' ').trim();
}

export function validateForumLink(
  value: string,
  validationObj: CreateProposalValidation,
): string {
  return validationObj
    ? validateMaxLengthMessage(value, validationObj.maxLength)
    : '';
}
