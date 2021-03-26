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
import { SelectProposals } from './pages/SelectProposal/SelectProposal';
import { Proposals } from './pages/Proposals/Proposals';
import { DaoDetails } from './pages/DaoDetails/DaoDetails';
import { CreateDao } from './pages/CreateDao/CreateDao';
import { CreateProposal } from './pages/CreateProposal/CreateProposal';

import 'normalize.css/normalize.css';
import './styles/theme.scss';
import './styles/main.scss';

interface LayoutProps {
  layout: React.FC<any>;
  routes: Array<RouteInfo>;
}

interface RouteInfo extends RouteProps {
  path: string;
}

const routes: LayoutProps[] = [
  {
    layout: LandingLayout,
    routes: [
      {
        path: '/',
        exact: true,
        component: Landing,
      },
    ],
  },
  {
    layout: MainLayout,
    routes: [
      {
        path: '/select-proposal',
        component: SelectProposals,
      },
      {
        path: '/proposals',
        component: Proposals,
      },
      {
        path: '/details',
        component: DaoDetails,
      },
      {
        path: '/create-dao',
        component: CreateDao,
      },
      {
        path: '/create-proposal',
        component: CreateProposal,
      },
    ],
  },
];

const Layout: React.FC<LayoutProps> = ({ layout: LayoutComponent, routes }) => {
  const paths = routes.map((route) => route.path);
  const layout = (
    <LayoutComponent
      children={routes.map((route) => (
        <Route key={route.path} {...route} />
      ))}
    />
  );
  return <Route exact path={paths} children={layout} />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      {routes.map((layoutProps, i) => (
        <Layout key={i} {...layoutProps} />
      ))}
    </BrowserRouter>
  );
};

export default App;
