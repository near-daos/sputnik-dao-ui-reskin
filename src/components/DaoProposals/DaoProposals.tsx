import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import cn from 'classnames';

import SearchBar from 'components/SearchBar';
import { ProposalCard } from 'components/ProposalCard';
import { Chip, ChipProps, Loader, Select } from 'components/UILib';

import { NearService } from 'services/NearService';

import { DaoItem } from 'types/dao';
import { Proposal } from 'types/proposal';

import { accountSelector } from 'redux/selectors';

import {
  countFailedProposals,
  countInVotingProposals,
  countApprovedProposals,
  isFailedProposal,
  isInVotingProposal,
  isApprovedProposal,
} from 'utils';

import s from './DaoProposals.module.scss';

export type ProposalFilterOption = {
  label: string;
  color: ChipProps['color'];
  count: number;
  value: 'Voting' | 'Approved' | 'Failed' | null;
};

const getFilterOptions = (
  proposals: Proposal[],
  total: number,
): ProposalFilterOption[] => [
  {
    label: 'Show all',
    color: 'default',
    count: total,
    value: null,
  },
  {
    label: 'Voting is in progress',
    color: 'inProgress',
    count: countInVotingProposals(proposals),
    value: 'Voting',
  },
  {
    label: 'Approved',
    color: 'success',
    count: countApprovedProposals(proposals),
    value: 'Approved',
  },
  {
    label: 'Failed',
    color: 'failed',
    count: countFailedProposals(proposals),
    value: 'Failed',
  },
];

export interface DaoProposalsProps {
  className?: string;
  proposals: Array<Proposal>;
  dao?: DaoItem;
  loading?: boolean;
}

enum ProposalSort {
  Oldest = 'oldest',
  Newest = 'newest',
}

type ProposalSortOption = {
  label: string;
  value: ProposalSort;
};

const sortOptions: ProposalSortOption[] = [
  { label: 'Newest', value: ProposalSort.Newest },
  { label: 'Oldest', value: ProposalSort.Oldest },
];

const DaoProposals: React.FC<DaoProposalsProps> = ({
  className,
  dao,
  proposals,
  loading = false,
}) => {
  const location = useLocation();
  const [filteredProposals, setFilteredProposals] = useState<Proposal[]>([]);
  const [sortedProposals, setSortedProposals] = useState<Proposal[]>([]);
  const [resultingProposals, setResultingProposals] = useState<Proposal[]>([]);
  const filterOptions = useMemo(
    () => getFilterOptions(proposals, dao?.numberOfProposals || 0),
    [proposals, dao?.numberOfProposals],
  );
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<ProposalSortOption>(sortOptions[0]);
  const [filters, setFilters] = useState<ProposalFilterOption>(
    filterOptions[0],
  );

  const account = useSelector(accountSelector);

  const isMember = dao?.members.includes(account || '');

  useEffect(() => {
    if (filters.value === null) {
      setFilteredProposals(proposals);

      return;
    }

    setFilteredProposals(
      proposals.filter((proposal) => {
        switch (filters.value) {
          case 'Approved':
            return isApprovedProposal(proposal);
          case 'Voting':
            return isInVotingProposal(proposal);
          case 'Failed':
            return isFailedProposal(proposal);
          default:
            return true;
        }
      }),
    );
  }, [filters, proposals]);

  useEffect(() => {
    if (!query) {
      setResultingProposals(filteredProposals);

      return;
    }

    const searched = filteredProposals.filter(
      (proposal) =>
        proposal.id.toString() === query ||
        proposal.description.indexOf(query) !== -1 ||
        proposal.target.indexOf(query) !== -1,
    );

    setResultingProposals(searched);
  }, [filteredProposals, query]);

  useEffect(() => {
    setSortedProposals(
      [...resultingProposals].sort((a, b) =>
        sort.value === ProposalSort.Oldest ? a.id - b.id : b.id - a.id,
      ),
    );
  }, [resultingProposals, sort]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const findProposalName = urlParams.get('proposal');

    if (findProposalName) {
      setQuery(findProposalName);
    }
  }, [location]);

  const handleChangeFilters = (filterOption: ProposalFilterOption) => {
    setFilters(filterOption);
  };

  const handleApprove = (proposalId: number) => {
    if (dao) {
      NearService.vote(dao.id, proposalId, 'Yes');
    }
  };

  const handleReject = (proposalId: number) => {
    if (dao) {
      NearService.vote(dao.id, proposalId, 'No');
    }
  };

  const handleFinalize = (proposalId: number) => {
    if (dao) {
      NearService.finalize(dao.id, proposalId);
    }
  };

  return (
    <section className={cn(s.root, className)}>
      <SearchBar
        name="search-proposals"
        value={query}
        onChange={setQuery}
        placeholder="Search for proposal, target, ID or proposer"
        size="md"
      />
      <div className={s.panel}>
        <div className={s.filters}>
          {filterOptions.map((filterOption) => (
            <Chip
              key={filterOption.label}
              size="lg"
              active={filters.value === filterOption.value}
              label={filterOption.label}
              color={filterOption.color}
              amount={filterOption.count}
              onClick={() => handleChangeFilters(filterOption)}
            />
          ))}
        </div>
        <Select
          className={s.sort}
          label="Sorting"
          options={sortOptions}
          value={sort}
          pickLabel={(item) => item.label}
          pickValue={(item) => item.value}
          onChange={setSort}
        />
      </div>
      {!loading && sortedProposals.length === 0 && (
        <div className={s.emptyWrapper}>
          <div className={s.emptyImage} />
          <p className={s.emptyText}>No proposals here</p>
        </div>
      )}
      <div className={s.proposalList}>
        <Loader className={cn(s.loader, { [s.showLoader]: loading })} />
        {sortedProposals.map((proposal) => (
          <ProposalCard
            key={proposal.id}
            proposal={proposal}
            isMember={isMember}
            onApprove={() => handleApprove(proposal.id)}
            onReject={() => handleReject(proposal.id)}
            onFinalize={() => handleFinalize(proposal.id)}
          />
        ))}
      </div>
    </section>
  );
};

export default DaoProposals;
