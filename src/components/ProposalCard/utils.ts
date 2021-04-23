import { Proposal, ProposalType } from 'types/proposal';

export const getTitle = (proposal: Proposal): string => {
  switch (proposal.kind.type) {
    case ProposalType.ChangePurpose:
      return `Change DAO Purpose`;
    case ProposalType.NewCouncil:
      return `New Council Member`;
    case ProposalType.RemoveCouncil:
      return `Remove Council Member`;
    case ProposalType.ChangeVotePeriod:
      return `Change Vote Period`;
    case ProposalType.Payout:
      return 'Payout';
    default:
      return '';
  }
};
