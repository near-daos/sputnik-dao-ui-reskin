import React, { useState } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { Header, Footer } from './components';
import { Landing } from './pages/Landing/Landing';
import { createBrowserHistory } from 'history';
import { SelectProposals } from './pages/SelectProposal/SelectProposal';
import { Proposals } from './pages/Proposals/Proposals';
import { DaoDetails } from './pages/DaoDetails/DaoDetails';
import { CreateDao } from './pages/CreateDao/CreateDao';
import { CreateProposal } from './pages/CreateProposal/CreateProposal';

import 'normalize.css/normalize.css';
import './styles/theme.scss';
import './styles/main.scss';

import s from './App.module.scss';

const history = createBrowserHistory();

const routes = [
  {
    path: '/',
    component: Landing,
    exact: true,
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
];

function App() {
  const [theme, setTheme] = useState(document.documentElement.dataset['theme']);

  const toggleTheme = () => {
    const updatedTheme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.classList.add('color-theme-in-transition');
    setTheme(updatedTheme);
    document.documentElement.setAttribute('data-theme', updatedTheme);
    window.setTimeout(() => {
      document.documentElement.classList.remove('color-theme-in-transition');
    }, 1000);
  };

  return (
    <Router history={history}>
      <div className={s.root}>
        <Header className={s.header} toggleTheme={toggleTheme} />
        <section className={s.content}>
          <Switch>
            {routes.map((route) => (
              <Route {...route} />
            ))}
          </Switch>
        </section>
        <Footer className={s.footer} />
      </div>
    </Router>
  );
}

export default App;
