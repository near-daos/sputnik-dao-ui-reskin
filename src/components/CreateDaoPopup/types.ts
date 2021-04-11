export type CreateDaoValues = {
  name: string;
  purpose: string;
  council: string;
  bond: string;
  votePeriod: string;
  gracePeriod: string;
  amountToTransfer: string;
};

export type CreateDaoErrors = Partial<
  {
    [key in keyof CreateDaoValues]: string;
  }
>;
