import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { Link, useHistory } from 'react-router-dom';
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
  const [searchResultCount, setSearchResultCount] = useState(0);
  const history = useHistory();

  useEffect(() => {
    if (!searchText) {
      setDaoResult([]);
      setSearchResultCount(0);

      return;
    }

    const filtered = daoList.filter(
      (doa) => doa.id.toUpperCase().indexOf(searchText.toUpperCase()) !== -1,
    );

    setSearchResultCount(filtered.length);

    const firstTen = filtered.slice(0, 10);

    setDaoResult(firstTen);
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

  const handleSubmit = () => {
    if (daoResult.length > 0) {
      setIsShowResult(false);
      history.push(`/search/dao/?query=${searchText}`);
    }
  };

  return (
    <div className={cn(s.root, className)}>
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
            <div className={s.titleWrapper}>
              {daoResult.length > 0 && (
                <>
                  <p className={s.title}>DAOs</p>
                  <Link
                    to={`/search/dao/?query=${searchText}`}
                    className={s.link}
                  >
                    See All
                    <span className={s.count}>({searchResultCount})</span>
                  </Link>
                </>
              )}
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
          </div>
        </>
      )}
    </div>
  );
};
export default SearchAutoComplete;
