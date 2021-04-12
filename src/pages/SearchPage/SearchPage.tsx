import React, { useEffect, useState } from 'react';
import cn from 'classnames';

import SearchBar from 'components/SearchBar';
import {
  Redirect,
  Route,
  Switch,
  useRouteMatch,
  useLocation,
  useHistory,
} from 'react-router-dom';
import { NavTabs } from 'components/UILib';
import { NavItem } from 'components/UILib/NavTabs/NavTabs';

import { SearchDaoPage } from 'pages/SearchDaoPage';
import { DaoItem } from 'types/dao';
import { useSelector } from 'react-redux';
import { daoListSelector } from 'redux/selectors';
import s from './SearchPage.module.scss';

export interface SearchPageProps {
  className?: string;
}

const SearchPage: React.FC<SearchPageProps> = ({ className }) => {
  const { path } = useRouteMatch();
  const location = useLocation();
  const history = useHistory();
  const urlParams = new URLSearchParams(location.search);
  const [searchQuery, setSearchQuery] = useState(urlParams.get('query') || '');
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
    if (!searchQuery) {
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

    const filtered = daoList.filter(
      (item) => item.id.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1,
    );

    setDaos(filtered);
    setTabOptions([
      {
        name: 'DAOs',
        route: `/search/dao`,
        count: filtered.length,
      },
    ]);
  }, [daoList, searchQuery]);

  // const [sort, setSort] = useState<Sort>(sortOptions[0]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery) {
      params.append('query', searchQuery);
    } else {
      params.delete('query');
    }

    history.push({ search: params.toString() });
  }, [searchQuery, history]);

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
      <div className={s.sortWrapper}>
        {/* <Select
          label="Sorting"
          value={sort}
          options={sortOptions}
          pickLabel={(item) => item.name}
          pickValue={(item) => item.value}
          onChange={setSort}
          className={s.sortSelect}
        /> */}
      </div>
      <div className={s.resultWrapper}>
        <Switch>
          <Route path={`${path}/dao`}>
            <SearchDaoPage daos={daos} />
          </Route>
          {/* <Route path={`${path}/proposal`}>
            <SearchProposalPage proposals={proposals} />
          </Route> */}
          <Route path={`${path}/`}>
            <Redirect to={`${path}/dao`} />
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default SearchPage;
