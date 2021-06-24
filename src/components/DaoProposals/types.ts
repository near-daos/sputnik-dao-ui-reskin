import { ChipProps } from '../UILib';

export enum ProposalSort {
  Oldest = 'oldest',
  Newest = 'newest',
}

export type ProposalSortOption = {
  label: string;
  value: ProposalSort;
};

export type ProposalFilterOption = {
  label: string;
  color: ChipProps['color'];
  count: number;
  value: 'Voting' | 'Approved' | 'Failed' | null;
};
