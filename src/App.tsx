import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, RouteProps, Switch } from 'react-router-dom';
import debounce from 'lodash.debounce';

import { NearService } from 'services/NearService';
import { useDispatch } from 'react-redux';
import { fetchAccount, fetchDaoList } from 'redux/actions';
import LogoRegenerationPage from 'pages/LogoRegenerationPage';
import RedirectRoute from 'components/RedirectRoute';
import useClearNearCache from 'hooks/use-clear-near-cache';
import { MainLayout } from './components';
import { LandingPage } from './pages/LandingPage/LandingPage';
import { SelectDao } from './pages/SelectDao/SelectDao';
import { SelectProposals } from './pages/SelectProposal/SelectProposal';
import { Proposals } from './pages/Proposals/Proposals';
import { DaoPage } from './pages/DaoPage/DaoPage';
import { SearchPage } from './pages/SearchPage';
import { ProposalPage } from './pages/ProposalPage';

import 'normalize.css/normalize.css';
import 'swiper/swiper.scss';
import './styles/theme.scss';
import './styles/main.scss';

interface RouteInfo extends RouteProps {
  path: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    path: '/dao/:daoId/proposals/:proposalId',
    component: ProposalPage,
  },
  {
    path: '/dao/:id',
    component: DaoPage,
  },
  {
    path: '/search',
    component: SearchPage,
  },
  {
    // only for internal usage
    path: '/logo-regenerate-d1a6e16c',
    component: LogoRegenerationPage,
  },
];

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const mainLayoutPaths = routes.map((route) => route.path);
  const dispatch = useDispatch();

  useClearNearCache();

  const setVH = () => {
    // dynamically set 1vh value for mobile full height bug fix
    const vh = window.innerHeight * 0.01;

    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  useEffect(() => {
    setVH();
    window.addEventListener('resize', debounce(setVH, 100));
  }, []);

  useEffect(() => {
    NearService.init().then(async () => {
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
      <RedirectRoute
        from="/#/:daoId/:proposalId"
        to="/dao/:daoId/proposals/:proposalId"
      />
      <RedirectRoute from="/#/:daoId" to="/dao/:daoId" />
      <Route exact path="/">
        <LandingPage />
      </Route>
      <Route path={mainLayoutPaths}>
        <MainLayout>
          <Switch>
            {routes.map((route, i) => (
              <Route key={String(i)} {...route} />
            ))}
          </Switch>
        </MainLayout>
      </Route>
    </BrowserRouter>
  );
};

export default App;
