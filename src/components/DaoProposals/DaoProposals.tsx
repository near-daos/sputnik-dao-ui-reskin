import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import cn from 'classnames';

import SearchBar from 'components/SearchBar';
import { ProposalCard } from 'components/ProposalCard';
import { Loader, Select } from 'components/UILib';

import { NearService } from 'services/NearService';

import { DaoItem } from 'types/dao';
import { Proposal } from 'types/proposal';

import { accountSelector } from 'redux/selectors';

import {
  countFailedProposals,
  countInVotingProposals,
  countApprovedProposals,
} from 'utils';

import {
  ProposalFilterOption,
  ProposalSort,
  ProposalSortOption,
} from './types';
import { ChipFilter } from './components/ChipFilter';
import { filterProposals, searchProposals, sortProposals } from './utils';

import s from './DaoProposals.module.scss';

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
  dao: DaoItem | null;
  loading?: boolean;
}

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
  const filterOptions = useMemo(
    () => getFilterOptions(proposals, dao?.numberOfProposals || 0),
    [proposals, dao?.numberOfProposals],
  );

  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<ProposalSortOption>(sortOptions[0]);
  const [filter, setFilter] = useState<ProposalFilterOption>(filterOptions[0]);

  const account = useSelector(accountSelector);

  const isMember = dao?.members.includes(account || '');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const findProposalName = urlParams.get('proposal');

    if (findProposalName) {
      setQuery(findProposalName);
    }
  }, [location]);

  const handleChangeFilters = useCallback(
    (filterOption: ProposalFilterOption) => {
      setFilter(filterOption);
    },
    [],
  );

  const handleApprove = useCallback(
    (proposalId: number) => {
      if (dao) {
        NearService.vote(dao.id, proposalId, 'Yes');
      }
    },
    [dao],
  );

  const handleReject = useCallback(
    (proposalId: number) => {
      if (dao) {
        NearService.vote(dao.id, proposalId, 'No');
      }
    },
    [dao],
  );

  const handleFinalize = useCallback(
    (proposalId: number) => {
      if (dao) {
        NearService.finalize(dao.id, proposalId);
      }
    },
    [dao],
  );

  function renderProposals(finalProposals: Proposal[]) {
    return (
      <div className={s.proposalList}>
        <Loader className={cn(s.loader, { [s.showLoader]: loading })} />
        {finalProposals.map((proposal) => (
          <ProposalCard
            key={proposal.id}
            proposal={proposal}
            isMember={isMember}
            onApprove={handleApprove}
            onReject={handleReject}
            onFinalize={handleFinalize}
          />
        ))}
      </div>
    );
  }

  function renderPageContent() {
    let finalProposals = proposals;

    finalProposals = searchProposals(finalProposals, query);
    finalProposals = filterProposals(finalProposals, filter);
    finalProposals = sortProposals(finalProposals, account, filter, sort);

    if (!loading && isEmpty(finalProposals)) {
      return (
        <div className={s.emptyWrapper}>
          <div className={s.emptyImage} />
          <p className={s.emptyText}>No proposals here</p>
        </div>
      );
    }

    return renderProposals(finalProposals);
  }

  return (
    <section className={cn(s.root, className)}>
      <SearchBar
        name="search-proposals"
        value={query}
        onChange={setQuery}
        placeholder="Search for proposal, target, ID or proposer"
        size="md"
        debounceTime={300}
      />
      <div className={s.panel}>
        <div className={s.filters}>
          {filterOptions.map((filterOption) => (
            <ChipFilter
              key={filterOption.label}
              filterOption={filterOption}
              onClick={handleChangeFilters}
              active={filter.value === filterOption.value}
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
      {renderPageContent()}
    </section>
  );
};

export default DaoProposals;
