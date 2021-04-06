export enum ProposalStatus {
  Delayed = 'Delayed',
  Approved = 'Approved',
  Rejected = 'Rejected',
  InProgress = 'Voting is in progress',
}

export type Proposal = {
  id: string;
  name: string;
  daoName: string;
  status: ProposalStatus;
  target: string;
  about: string;
  payout: number;
  proposer: string;
  approveCount: number;
  rejectCount: number;
};
