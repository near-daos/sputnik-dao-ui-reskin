import { Proposal } from '../../types/proposal';
import {
  checkIfAccountVoted,
  isApprovedProposal,
  isFailedProposal,
  isInVotingProposal,
} from '../../utils';
import {
  ProposalFilterOption,
  ProposalSort,
  ProposalSortOption,
} from './types';

const getWeight = (proposal: Proposal, account: string | null) => {
  let weight = 0;
  const [isVoted] = checkIfAccountVoted(proposal, account);

  if (isInVotingProposal(proposal) && isVoted) {
    weight = 3;
  } else if (isInVotingProposal(proposal) && !isVoted) {
    weight = 2;
  } else if (isApprovedProposal(proposal)) {
    weight = 1;
  }

  return weight;
};

export function searchProposals(proposalsToSearch: Proposal[], query: string) {
  if (!query) {
    return proposalsToSearch;
  }

  return proposalsToSearch.filter(
    (proposal) =>
      proposal.id.toString() === query ||
      proposal.description.includes(query) ||
      proposal.target.includes(query),
  );
}

export function sortProposals(
  proposalsToSort: Proposal[],
  account: string | null,
  filter: ProposalFilterOption,
  sort: ProposalSortOption,
) {
  if (filter.value === null) {
    return proposalsToSort.sort(
      (a, b) => getWeight(b, account) - getWeight(a, account),
    );
  }

  return proposalsToSort.sort((a, b) =>
    sort.value === ProposalSort.Oldest ? a.id - b.id : b.id - a.id,
  );
}

export function filterProposals(
  proposalsToFilter: Proposal[],
  filter: ProposalFilterOption,
) {
  if (filter.value === null) {
    return proposalsToFilter;
  }

  return proposalsToFilter.filter((proposal) => {
    switch (filter.value) {
      case 'Approved':
        return isApprovedProposal(proposal);
      case 'Voting':
        return isInVotingProposal(proposal);
      case 'Failed':
        return isFailedProposal(proposal);
      default:
        return true;
    }
  });
}
