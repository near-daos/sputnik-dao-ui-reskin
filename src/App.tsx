/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/no-children-prop */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable padding-line-between-statements */
/* eslint-disable react/no-children-prop */
/* eslint-disable arrow-body-style */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, RouteProps } from 'react-router-dom';
import { NearService } from 'services/NearService';
import { useDispatch } from 'react-redux';
import { fetchAccount, fetchDaoList } from 'redux/actions';
import { MainLayout } from './components';
import { LandingPage } from './pages/LandingPage/LandingPage';
import { SelectDao } from './pages/SelectDao/SelectDao';
import { SelectProposals } from './pages/SelectProposal/SelectProposal';
import { Proposals } from './pages/Proposals/Proposals';
import { DaoPage } from './pages/DaoPage/DaoPage';
import { SearchPage } from './pages/SearchPage';

import 'normalize.css/normalize.css';
import 'slick-carousel/slick/slick.css';
import 'swiper/swiper.scss';
import './styles/theme.scss';
import './styles/main.scss';

interface RouteInfo extends RouteProps {
  path: string;
  component: React.FC<any>;
}

const routes: RouteInfo[] = [
  {
    path: '/select-dao',
    component: SelectDao,
  },
  {
    path: '/select-proposal',
    component: SelectProposals,
  },
  {
    path: '/proposals',
    component: Proposals,
  },
  {
    path: '/dao/:id',
    component: DaoPage,
  },
  {
    path: '/search',
    component: SearchPage,
  },
];

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const mainLayoutPaths = routes.map((route) => route.path);
  const dispatch = useDispatch();

  useEffect(() => {
    NearService.init().then(() => {
      dispatch(fetchAccount.started());
      dispatch(fetchDaoList.started());
      setIsInitialized(true);
    });
  }, [dispatch]);

  if (!isInitialized) {
    return null; // todo add loader
  }

  return (
    <BrowserRouter>
      <Route exact path="/">
        <LandingPage />
      </Route>
      <Route path={mainLayoutPaths}>
        <MainLayout>
          {routes.map((route, i) => (
            <Route key={i} {...route} />
          ))}
        </MainLayout>
      </Route>
    </BrowserRouter>
  );
};

export default App;
