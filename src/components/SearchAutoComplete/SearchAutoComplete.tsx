import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import SearchBar, { SearchBarProps } from 'components/SearchBar/SearchBar';
import { highlightSubstring } from 'utils/highlightSubstring';
import { DaoItem } from 'types/dao';
import s from './SearchAutoComplete.module.scss';

export type Dao = {
  name: string;
  id: string;
};

export type Proposal = {
  name: string;
  id: string;
  daoId: string;
};

export interface SearchAutoCompleteProps {
  className?: string;
  searchBarSize?: SearchBarProps['size'];
  daoList: DaoItem[];
}

const SearchAutoComplete: React.FC<SearchAutoCompleteProps> = ({
  className,
  searchBarSize = 'sm',
  daoList,
}) => {
  const [searchText, setSearchText] = useState('');
  const [isShowResult, setIsShowResult] = useState(false);
  const [daoResult, setDaoResult] = useState<DaoItem[]>([]);
  const [proposalResult, setProposalResult] = useState<Proposal[]>([]);

  useEffect(() => {
    if (!searchText) {
      setDaoResult([]);
      setProposalResult([]);

      return;
    }

    const filtered = daoList.filter(
      (doa) => doa.id.toUpperCase().indexOf(searchText.toUpperCase()) !== -1,
    );

    setDaoResult(filtered);
    setProposalResult([]);
  }, [searchText, daoList]);

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

  return (
    <div className={cn(s.root, className)}>
      <SearchBar
        value={searchText}
        onChange={onChangeSearch}
        placeholder="Search for DAO or proposal"
        name="search"
        className={s.search}
        size={searchBarSize}
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
            <div className={s.titleWrapper}>
              <p className={s.title}>DAOs</p>
              <Link to={`/search/dao/?query=${searchText}`} className={s.link}>
                See All
                <span className={s.count}>({daoResult.length})</span>
              </Link>
            </div>
            {daoResult.length > 0 ? (
              <>
                {daoResult.map((item) => (
                  <Link to={`/dao/${item.id}`} className={s.item} key={item.id}>
                    {renderName(item.id)}
                  </Link>
                ))}
              </>
            ) : (
              <p className={s.emptyText}>DAO not found</p>
            )}
            <div className={s.border} />
            <div className={s.titleWrapper}>
              <p className={s.title}>Proposals</p>
              <Link
                to={`/search/proposal/?query=${searchText}`}
                className={s.link}
              >
                See All
                <span className={s.count}>({proposalResult.length})</span>
              </Link>
            </div>
            {proposalResult.length > 0 ? (
              <>
                {proposalResult.map((item) => (
                  <Link
                    to={`/dao/${item.daoId}/proposals?proposal=${item.name}`}
                    className={s.item}
                    key={item.id}
                  >
                    {renderName(item.name)}
                  </Link>
                ))}
              </>
            ) : (
              <p className={s.emptyText}>proposal not found</p>
            )}
            <Link
              to={`/search/dao/?query=${searchText}`}
              className={cn(s.link, s.all)}
            >
              Show all results
              <span className={s.count}>
                ({daoResult.length + proposalResult.length})
              </span>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};
export default SearchAutoComplete;
