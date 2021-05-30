// eslint-disable-next-line no-useless-escape
const validNameRegexp = /^(?=[0-9a-z])(?=.*[0-9a-z]$)(?!.*__.*)(?!.*--.*)[0-9a-z_\-]*$/;
const targetRegExp = /^[0-9a-z][0-9_a-z]{2,}((.sputnikdao)?.near|.testnet)$/;

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

export const validateDescription = (value: string): boolean =>
  value.length >= 3 && value.length <= 240;

export const validateTarget = (value: string): boolean =>
  targetRegExp.test(value);
