import { nearConfig } from 'config';
import { DaoItem } from 'types/dao';
import { CreateDaoErrors, CreateDaoValues } from './types';

// eslint-disable-next-line no-useless-escape
const validNameRegexp = /^(?=[0-9a-zA-Z])(?=.*[0-9a-zA-Z]$)(?!.*__.*)(?!.*--.*)[0-9a-zA-Z_\-]*$/;

export const validateCouncil = (value: string): boolean =>
  !!value && value.indexOf(',') === -1;

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

export const validateFirstStep = (
  values: CreateDaoValues,
  daoList: DaoItem[],
): CreateDaoErrors => {
  const errors: CreateDaoErrors = {};

  if (!validateCouncil(values.council)) {
    errors.council = 'Please enter correct list of accounts';
  }

  if (!validatePurpose(values.purpose)) {
    errors.purpose = 'Please enter between 10 and 280 chars';
  }

  if (!validateName(values.name)) {
    errors.name =
      'Please enter between 2 and 35 chars, lowercase characters (a-z), digits (0-9),(_-) can be used as separators';
  }

  const existDao = daoList.find(
    (dao) => dao.id === `${values.name}.${nearConfig.contractName}`,
  );

  if (existDao) {
    errors.name = `Dao ${existDao.id} already exists`;
  }

  return errors;
};

export const validateSecondStep = (
  values: CreateDaoValues,
): CreateDaoErrors => {
  const errors: CreateDaoErrors = {};

  if (!validateAmount(values.amountToTransfer)) {
    errors.amountToTransfer = 'Minimum amount is 3.5 NEAR';
  }

  if (!validateNumber(values.bond)) {
    errors.bond = 'Please enter a valid number';
  }

  if (!validateNumber(values.votePeriod)) {
    errors.votePeriod = 'Please enter a valid number';
  }

  if (!validateNumber(values.gracePeriod)) {
    errors.gracePeriod = 'Please enter a valid number';
  }

  return errors;
};
