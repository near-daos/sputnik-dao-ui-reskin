/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/no-children-prop */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable padding-line-between-statements */
/* eslint-disable react/no-children-prop */
/* eslint-disable arrow-body-style */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { BrowserRouter, Route, RouteProps } from 'react-router-dom';
import { LandingLayout, MainLayout } from './components';
import { Landing } from './pages/Landing/Landing';
import { SelectDao } from './pages/SelectDao/SelectDao';
import { SelectProposals } from './pages/SelectProposal/SelectProposal';
import { Proposals } from './pages/Proposals/Proposals';
import { DaoPage } from './pages/DaoPage/DaoPage';
import { CreateDao } from './pages/CreateDao/CreateDao';
import { CreateProposal } from './pages/CreateProposal/CreateProposal';

import 'normalize.css/normalize.css';
import 'slick-carousel/slick/slick.css';
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
    path: '/dao',
    component: DaoPage,
  },
  {
    path: '/create-dao',
    component: CreateDao,
  },
  {
    path: '/create-proposal',
    component: CreateProposal,
  },
];

const App: React.FC = () => {
  const mainLayoutPaths = routes.map((route) => route.path);

  return (
    <BrowserRouter>
      <Route exact path="/">
        <LandingLayout>
          <Landing />
        </LandingLayout>
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
