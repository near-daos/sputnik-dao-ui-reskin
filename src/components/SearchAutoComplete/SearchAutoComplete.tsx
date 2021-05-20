import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { Link, useHistory } from 'react-router-dom';
import SearchBar, { SearchBarProps } from 'components/SearchBar/SearchBar';
import { highlightSubstring } from 'utils/highlightSubstring';
import { DaoItem } from 'types/dao';
import { Proposal, ProposalStatus } from '../../types/proposal';
import { NearService } from '../../services/NearService';
import { DAO_PROPOSAL_IDS_SEARCH_SEPARATOR } from '../../constants/searchConstants';
import { filterDaoBySearchStr } from '../../utils/filterDaoBySearchStr';

import s from './SearchAutoComplete.module.scss';

export interface SearchAutoCompleteProps {
  id?: string;
  className?: string;
  searchBarSize?: SearchBarProps['size'];
  daoList: DaoItem[];
}

const SearchAutoComplete: React.FC<SearchAutoCompleteProps> = ({
  className,
  searchBarSize = 'sm',
  daoList,
  id,
}) => {
  const history = useHistory();

  const [searchText, setSearchText] = useState('');
  const [isShowResult, setIsShowResult] = useState(false);
  const [daoResult, setDaoResult] = useState<DaoItem[]>([]);
  const [searchResultCount, setSearchResultCount] = useState(0);
  const [proposalsByDao, setProposalsByDao] = useState<
    Record<string, Proposal[]>
  >({});

  useEffect(() => {
    const daoSearchStr = searchText.split(DAO_PROPOSAL_IDS_SEARCH_SEPARATOR)[0];

    if (!daoSearchStr) {
      setDaoResult([]);
      setSearchResultCount(0);

      return;
    }

    const filtered = filterDaoBySearchStr(daoSearchStr, daoList);

    setSearchResultCount(filtered.length);

    const firstTen = filtered.slice(0, 10);

    setDaoResult(firstTen);
  }, [searchText, daoList]);

  useEffect(() => {
    setProposalsByDao({});

    daoResult.forEach(({ id: daoId }) => {
      NearService.getAllProposals(daoId).then((data) => {
        setProposalsByDao((prevState) => ({
          ...prevState,
          [daoId]: data,
        }));
      });
    });
  }, [daoResult]);

  const renderName = (name: string) => {
    const string = highlightSubstring(name, searchText);

    // eslint-disable-next-line react/no-danger
    return <p dangerouslySetInnerHTML={{ __html: string.result }} />;
  };

  const closeResults = () => {
    setIsShowResult(false);
  };

  const onChangeSearch = (value: string) => {
    if (!isShowResult) {
      setIsShowResult(true);
    }

    setSearchText(value);
  };

  const handleSubmit = () => {
    if (daoResult.length > 0) {
      setIsShowResult(false);
      history.push(`/search/dao/?query=${searchText}`);
    }
  };

  function getProposalsToShow(daoId: string) {
    let proposalsOfDao = proposalsByDao[daoId] || [];

    if (proposalsOfDao.length > 0) {
      const proposalsSearchStr = searchText.split(
        DAO_PROPOSAL_IDS_SEARCH_SEPARATOR,
      )[1];

      if (proposalsSearchStr) {
        proposalsOfDao = proposalsOfDao.filter(({ id: proposalId }) =>
          proposalId.toString().includes(proposalsSearchStr),
        );

        return proposalsOfDao.slice(0, 10);
      }
    }

    return [];
  }

  function renderSingleDao(item: DaoItem) {
    const { id: daoId } = item;
    const proposalsOfDao = getProposalsToShow(daoId);

    const daoUrl = `/dao/${daoId}`;

    return (
      <div>
        <Link to={daoUrl} className={s.item} key={daoId}>
          {renderName(daoId)}
        </Link>
        <div className={s.proposals}>
          {proposalsOfDao.map((proposal) => {
            const { id: proposalId, kind: { type } = {}, status } = proposal;

            const proposalClassName = cn({
              [s.red]:
                status === ProposalStatus.Fail ||
                status === ProposalStatus.Reject,
              [s.green]: status === ProposalStatus.Success,
              [s.purple]: status === ProposalStatus.Vote,
              [s.yellow]: status === ProposalStatus.Delay,
            });

            return (
              <Link to={`${daoUrl}/proposals/${proposalId}`} className={s.item}>
                <div>
                  <span className={proposalClassName}>{proposalId}</span>
                  {` ${type} `}
                  <span className={proposalClassName}>{status}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  function renderSearchResults() {
    if (daoResult.length > 0) {
      return (
        <>
          <div className={s.titleWrapper}>
            <p className={s.title}>DAOs</p>
            <Link to={`/search/dao/${searchText}`} className={s.link}>
              See All
              <span className={s.count}>({searchResultCount})</span>
            </Link>
          </div>
          {daoResult.map(renderSingleDao)}
        </>
      );
    }

    return <p className={s.emptyText}>DAO not found</p>;
  }

  return (
    <div className={cn(s.root, className)} id={id}>
      <SearchBar
        value={searchText}
        onChange={onChangeSearch}
        placeholder="Search for DAO"
        name="search"
        className={s.search}
        size={searchBarSize}
        onSubmit={handleSubmit}
      />
      {isShowResult && (
        <>
          <div
            aria-label="overlay"
            role="button"
            tabIndex={0}
            className={s.overlay}
            onKeyPress={closeResults}
            onClick={closeResults}
          />
          <div
            className={s.resultWrapper}
            role="button"
            tabIndex={0}
            onKeyPress={closeResults}
            onClick={closeResults}
          >
            {renderSearchResults()}
          </div>
        </>
      )}
    </div>
  );
};
export default SearchAutoComplete;
