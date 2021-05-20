import React, { useEffect, useState } from 'react';
import {
  HashRouter,
  Redirect,
  Route,
  RouteProps,
  Switch,
} from 'react-router-dom';
import debounce from 'lodash.debounce';

import { NearService } from 'services/NearService';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAccount, fetchDaoList } from 'redux/actions';
import LogoRegenerationPage from 'pages/LogoRegenerationPage';
import { accountSelector } from 'redux/selectors';
import { checkIfNearAuthKeysExist, clearNearAuth } from 'utils';
import { Page404 } from 'pages/Page404';
import TagManager from 'react-gtm-module';
import { MainLayout } from './components';
import { LandingPage } from './pages/LandingPage/LandingPage';
import { SelectDao } from './pages/SelectDao/SelectDao';
import { SelectProposals } from './pages/SelectProposal/SelectProposal';
// import { Proposals } from './pages/Proposals/Proposals';
import { DaoPage } from './pages/DaoPage/DaoPage';
import { SearchPage } from './pages/SearchPage';
import { ProposalPage } from './pages/ProposalPage';

import 'normalize.css/normalize.css';
import 'swiper/swiper.scss';
import './styles/theme.scss';
import './styles/main.scss';

const tagManagerArgs = {
  gtmId: 'GTM-NJ4LDQC',
};

TagManager.initialize(tagManagerArgs);

interface RouteInfo extends RouteProps {
  path: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.FC<any>;
}

const routes: RouteInfo[] = [
  {
    exact: true,
    path: '/select-dao',
    component: SelectDao,
  },
  {
    exact: true,
    path: '/select-proposal',
    component: SelectProposals,
  },
  // {
  //   path: '/proposals',
  //   component: Proposals,
  // },
  {
    exact: true,
    path: '/dao/:daoId/proposals/:proposalId',
    component: ProposalPage,
  },
  {
    exact: true,
    path: '/dao/:id',
    component: DaoPage,
  },
  {
    exact: true,
    path: '/search',
    component: SearchPage,
  },
  {
    // only for internal usage
    exact: true,
    path: '/logo-regenerate-d1a6e16c',
    component: LogoRegenerationPage,
  },
];

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const account = useSelector(accountSelector);
  const dispatch = useDispatch();

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
    // clear all query params
    if (window.location.search) {
      window.location.search = '';
    }
  }, []);

  useEffect(() => {
    NearService.init().then(async () => {
      if (!NearService.isAuthorized() && checkIfNearAuthKeysExist()) {
        clearNearAuth();
      }

      dispatch(fetchAccount.started());
      dispatch(fetchDaoList.started());
      setIsInitialized(true);
    });

    // clear non-hash routes
    if (window.location.pathname && window.location.pathname !== '/') {
      window.location.pathname = '';
    }

    // clear all query params
    if (window.location.search) {
      window.location.search = '';
      window.location.href = window.location.href.replace('?', '');
    }
  }, [account, dispatch]);

  if (!isInitialized) {
    return null; // todo add loader
  }

  return (
    <HashRouter>
      <Route exact path="/">
        <LandingPage />
      </Route>
      <Route path="*">
        <MainLayout>
          <Switch>
            {routes.map((route, i) => (
              <Route key={String(i)} {...route} />
            ))}
            <Redirect exact from="/:daoId" to="/dao/:daoId" />
            <Redirect
              exact
              from="/:daoId/:proposalId"
              to="/dao/:daoId/proposals/:proposalId"
            />
            <Route path="*" component={Page404} />
          </Switch>
        </MainLayout>
      </Route>
    </HashRouter>
  );
};

export default App;
