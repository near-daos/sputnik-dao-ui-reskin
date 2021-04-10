export type CreateDaoParams = {
  name: string;
  amount: string;
  purpose: string;
  council: string;
  bond: string;
  votePeriod: string;
  gracePeriod: string;
};

export type DaoItem = {
  id: string;
  amount: string;
  bond: string;
  purpose: string;
  votePeriod: string;
  numberOfProposals: number;
  numberOfMembers: number;
};
