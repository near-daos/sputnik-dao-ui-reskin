import React, { useState } from 'react';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import SearchBar, { SearchBarProps } from 'components/SearchBar/SearchBar';
import { highlightSubstring } from 'utils/highlightSubstring';
import s from './SearchAutoComplete.module.scss';

export type Dao = {
  name: string;
  id: string;
};

export type Proposal = {
  name: string;
  id: string;
};

export interface SearchAutoCompleteProps {
  className?: string;
  searchBarSize?: SearchBarProps['size'];
}

const SearchAutoComplete: React.FC<SearchAutoCompleteProps> = ({
  className,
  searchBarSize = 'sm',
}) => {
  const [searchText, setSearchText] = useState('');
  const [isShowResult, setIsShowResult] = useState(false);
  const [daoResult, setDaoResult] = useState<Dao[]>([]);
  const [proposalResult, setProposalResult] = useState<Proposal[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSearch = (value: string) => {
    setIsShowResult(true);
    setDaoResult([{ name: 'testDao', id: '1' }]);
    setProposalResult([{ name: 'testProposal', id: '2' }]);
  };

  const renderName = (name: string) => {
    const string = highlightSubstring(name, searchText);

    // eslint-disable-next-line react/no-danger
    return <p dangerouslySetInnerHTML={{ __html: string.result }} />;
  };

  return (
    <div className={cn(s.root, className)}>
      <SearchBar
        value={searchText}
        onChange={setSearchText}
        placeholder="Search for DAO or proposal"
        name="search"
        className={s.search}
        onSubmit={handleSearch}
        size={searchBarSize}
      />
      {isShowResult && (
        <>
          <div
            aria-label="overlay"
            role="button"
            tabIndex={0}
            className={s.overlay}
            onKeyPress={() => {
              setIsShowResult(false);
            }}
            onClick={() => {
              setIsShowResult(false);
            }}
          />
          <div className={s.resultWrapper}>
            <div className={s.titleWrapper}>
              <p className={s.title}>DAOs</p>
              <Link to="/" className={s.link}>
                See All
                <span className={s.count}>({daoResult.length})</span>
              </Link>
            </div>
            {daoResult.length > 0 ? (
              <>
                {daoResult.map((item) => (
                  <Link to="/" className={s.item} key={item.id}>
                    {renderName(item.name)}
                  </Link>
                ))}
              </>
            ) : (
              <p className={s.emptyText}>DAO not found</p>
            )}
            <div className={s.border} />
            <div className={s.titleWrapper}>
              <p className={s.title}>Proposals</p>
              <Link to={`/query=${searchText}`} className={s.link}>
                See All
                <span className={s.count}>({proposalResult.length})</span>
              </Link>
            </div>
            {proposalResult.length > 0 ? (
              <>
                {proposalResult.map((item) => (
                  <Link
                    to={`/query=${searchText}`}
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
            <Link to="/" className={cn(s.link, s.all)}>
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
