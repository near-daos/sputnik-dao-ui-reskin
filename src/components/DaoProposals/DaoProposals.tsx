import React from 'react';
import cn from 'classnames';

import SearchBar from 'components/SearchBar';
import { ProposalCard } from 'components/ProposalCard';
import { Chip, ChipProps, Select } from 'components/UILib';
import { Proposal } from 'types/proposal';

import s from './DaoProposals.module.scss';

const filters: Array<ChipProps> = [
  {
    label: 'Show all',
    color: 'default',
    amount: 100,
  },
  {
    label: 'Delayed',
    color: 'warning',
    amount: 34,
  },
  {
    label: 'Approved',
    color: 'success',
    amount: 25,
  },
  {
    label: 'Rejected',
    color: 'error',
    amount: 33,
  },
  {
    label: 'Voting is in progress',
    color: 'inProgress',
    amount: 8,
  },
];

export interface DaoProposalsProps {
  className?: string;
  proposals: Array<Proposal>;
}

const DaoProposals: React.FC<DaoProposalsProps> = ({
  className,
  proposals,
}) => (
  <section className={cn(s.root, className)}>
    <SearchBar
      name="search-proposals"
      value=""
      onChange={() => ''}
      placeholder="Search for proposal, target, ID or proposer"
      size="md"
    />
    <div className={s.panel}>
      <div className={s.filters}>
        {filters.map((tag) => (
          <Chip key={tag.label} size="lg" {...tag} />
        ))}
      </div>
      {/* TODO: Integration required */}
      <Select
        className={s.sort}
        label="Sorting"
        options={['test']}
        value="test"
        pickLabel={() => 'test'}
        pickValue={() => 'test'}
        onChange={() => 'test'}
      />
    </div>
    <div className={s.proposalList}>
      {proposals.map((proposal) => (
        <ProposalCard key={proposal.id} proposal={proposal} />
      ))}
    </div>
  </section>
);

export default DaoProposals;
