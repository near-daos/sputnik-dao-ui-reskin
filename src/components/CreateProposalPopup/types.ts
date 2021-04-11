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
