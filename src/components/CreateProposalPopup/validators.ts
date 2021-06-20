import { URLTest } from 'services/NearService/NearService';
import { ProposalType } from 'types/proposal';
import {
  validateNumber,
  validateTarget,
  validateForumLink,
  validateDescription,
} from 'utils/validators';
import {
  CreateProposalValues,
  CreateProposalErrors,
  CreateProposalValidation,
  CreateProposalFormValidation,
} from './types';

export const validateSecondStep = (
  values: CreateProposalValues,
  validationObj: CreateProposalFormValidation,
): CreateProposalErrors => {
  const config: {
    method: (val: string, validationObj: CreateProposalValidation) => string;
    key: keyof CreateProposalValues;
  }[] = [
    { method: validateForumLink, key: 'link' },
    { method: validateTarget, key: 'target' },
    { method: validateDescription, key: 'description' },
  ];

  const errors: CreateProposalErrors = config.reduce((acc, { method, key }) => {
    const errorMsg = method(values[key], validationObj[key] || {});

    if (errorMsg) {
      acc[key] = errorMsg;
    }

    return acc;
  }, {} as Record<string, string>);

  return errors;
};

export const validateThirdStep = (
  values: CreateProposalValues,
  type: ProposalType,
  validationObj: CreateProposalFormValidation,
): CreateProposalErrors => {
  const errors: CreateProposalErrors = {};

  if (!URLTest(values.link)) {
    errors.link = 'Wrong format. Include a valid link including https://';
  }

  if (type === ProposalType.ChangePurpose) {
    const error = validateDescription(
      values.purpose,
      validationObj.purpose || {},
    );

    if (error) {
      errors.purpose = error;
    }
  }

  if (
    type === ProposalType.ChangeVotePeriod &&
    !validateNumber(values.votePeriod)
  ) {
    errors.votePeriod = 'Please enter number';
  }

  if (type === ProposalType.Payout && !validateNumber(values.payout)) {
    errors.payout = 'Please enter number';
  }

  return errors;
};
