export type Dao = {
  id: string;
  name: string;
  purpose: string;
  numberOfProposals: number;
  bond: number;
  amountMembers: number;
  daoFunds: number;
  image: string;
  members: string[];
  network: string;
  votePeriod: Date;
};
