import { ProposalType } from 'types/proposal';
import {
  validateDescription,
  validateNumber,
  validateTarget,
} from 'utils/validators';
import { CreateProposalValues, CreateProposalErrors } from './types';

export const validateSecondStep = (
  values: CreateProposalValues,
): CreateProposalErrors => {
  const errors: CreateProposalErrors = {};

  if (!validateTarget(values.target)) {
    errors.target = 'User account not valid';
  }

  if (!validateDescription(values.description)) {
    errors.description = 'Please enter between 3 and 240 chars';
  }

  return errors;
};

export const validateThirdStep = (
  values: CreateProposalValues,
  type: ProposalType,
): CreateProposalErrors => {
  const errors: CreateProposalErrors = {};

  // if (values.link && !URLTest(values.link)) {
  //   errors.link = 'Wrong format. Include a valid link including https://';
  // }

  if (
    type === ProposalType.ChangePurpose &&
    !validateDescription(values.purpose)
  ) {
    errors.purpose = 'Please enter between 3 and 240 chars';
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
