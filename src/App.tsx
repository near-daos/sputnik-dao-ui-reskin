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
import { BrowserRouter, Route, RouteProps, Switch } from 'react-router-dom';
import debounce from 'lodash.debounce';

import { NearService } from 'services/NearService';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAccount, fetchDaoList } from 'redux/actions';
import { getRandomLogo } from 'services/LogoRandomizer';
import { daoListSelector } from 'redux/selectors';
import { checkIfLogoExist } from 'utils';
import { AwsUploader } from 'services/AwsUploader';
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
];

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const mainLayoutPaths = routes.map((route) => route.path);
  const dispatch = useDispatch();
  const daoList = useSelector(daoListSelector);

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

  useEffect(() => {
    if (!daoList[0]) return;

    checkIfLogoExist(daoList[0].id).then((isExist) => {
      if (isExist) return;

      daoList.forEach(async (dao) => {
        const isLogoExist = await checkIfLogoExist(dao.id);

        if (!isLogoExist) {
          const file = await getRandomLogo(dao.id);
          await AwsUploader.uploadToBucket(file);
        }
      });
    });
  }, [daoList]);

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
          <Switch>
            {routes.map((route, i) => (
              <Route key={i} {...route} />
            ))}
          </Switch>
        </MainLayout>
      </Route>
    </BrowserRouter>
  );
};

export default App;
