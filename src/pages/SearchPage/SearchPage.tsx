import React, { useEffect, useState } from 'react';
import cn from 'classnames';

import SearchBar from 'components/SearchBar';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { NavTabs } from 'components/UILib';
import { NavItem } from 'components/UILib/NavTabs/NavTabs';

import { SearchDaoPage } from 'pages/SearchDaoPage';
import { DaoItem } from 'types/dao';
import { useSelector } from 'react-redux';
import { daoListSelector } from 'redux/selectors';
import { DAO_PROPOSAL_IDS_SEARCH_SEPARATOR } from '../../constants/searchConstants';
import { filterDaoBySearchStr } from '../../utils/filterDaoBySearchStr';

import s from './SearchPage.module.scss';

export interface SearchPageProps {
  className?: string;
}

const SearchPage: React.FC<SearchPageProps> = ({ className }) => {
  const route = useRouteMatch<{ searchPhrase: string }>();

  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState(route.params.searchPhrase);
  const daoList = useSelector(daoListSelector);
  const [daos, setDaos] = useState<DaoItem[]>([]);

  const [tabsOptions, setTabOptions] = useState<NavItem[]>([
    {
      name: 'DAOs',
      route: `/search/dao`,
      count: 0,
    },
  ]);

  useEffect(() => {
    const daoSearchStr = searchQuery.split(
      DAO_PROPOSAL_IDS_SEARCH_SEPARATOR,
    )[0];

    if (!daoSearchStr) {
      setDaos([]);

      setTabOptions([
        {
          name: 'DAOs',
          route: `/search/dao`,
          count: 0,
        },
      ]);

      return;
    }

    const filtered = filterDaoBySearchStr(daoSearchStr, daoList);

    setDaos(filtered);
    setTabOptions([
      {
        name: 'DAOs',
        route: `/search/dao`,
        count: filtered.length,
      },
    ]);
  }, [daoList, searchQuery]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  useEffect(() => {
    if (searchQuery && searchQuery !== route.params.searchPhrase) {
      history.push(route.path.replace(':searchPhrase', searchQuery));
    }
  }, [searchQuery, history, route]);

  useEffect(() => {
    document.title = 'SputnikDAO';
  }, []);

  return (
    <div className={cn(s.root, className)}>
      <SearchBar
        value={searchQuery}
        name="search"
        onChange={setSearchQuery}
        onSubmit={handleSearch}
        placeholder="Search for DAO or proposal"
      />
      <NavTabs options={tabsOptions} className={s.tabs} />
      <div className={s.resultWrapper}>
        <SearchDaoPage daos={daos} />
      </div>
    </div>
  );
};

export default SearchPage;
