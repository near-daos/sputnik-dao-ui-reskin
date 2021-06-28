export type CreateProposalValues = {
  target: string;
  description: string;
  link: string;
  payout: string;
  purpose: string;
  votePeriod: string;
};

export type CreateProposalErrors = Partial<
  {
    [key in keyof CreateProposalValues]: string;
  }
>;

export type ValidationType = number | (() => number) | undefined;

export type CreateProposalValidation = {
  maxLength?: ValidationType;
  minLength?: ValidationType;
};

export type CreateProposalFormValidation = Partial<
  {
    [key in keyof CreateProposalValues]?: CreateProposalValidation;
  }
>;
