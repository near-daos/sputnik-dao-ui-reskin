import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import { Button, NavTabs } from 'components/UILib';
import { DaoCardMini } from 'components/DaoCardMini';
import { DaoDetails } from 'components/DaoDetails';
import { DaoProposals } from 'components/DaoProposals';

import { mockDaos, proposals } from './mockData';

import s from './DaoPage.module.scss';

const CURRENT_DAO_ID = '7'; // TODO: remove after integration

export const DaoPage: React.FC = () => {
  const { path } = useRouteMatch();

  return (
    <section className={s.root}>
      <section className={s.slider}>
        <div className={s.sliderContainer}>
          {mockDaos.map((dao) => (
            <DaoCardMini
              key={dao.id}
              className={s.daoCard}
              dao={dao}
              active={dao.id === CURRENT_DAO_ID}
            />
          ))}
        </div>
      </section>
      <div className={s.content}>
        <section className={s.header}>
          <img
            className={s.picture}
            src="https://reactjs.org/logo-og.png"
            alt=""
          />
          <h1 className={s.heading}>DAO name_7</h1>
          <div className={s.nav}>
            <NavTabs
              className={s.navTabs}
              options={[
                { name: 'Proposals', route: `${path}/proposals` },
                { name: 'Details', route: `${path}/details` },
              ]}
            />
          </div>
          <div className={s.buttons}>
            <Button className={s.button} variant="outline">
              Create new proposal
            </Button>
          </div>
        </section>

        <Switch>
          <Route path={`${path}/details`}>
            <DaoDetails />
          </Route>

          <Route path={`${path}/proposals`}>
            <DaoProposals proposals={proposals} />
          </Route>

          <Route path={`${path}/`}>
            <Redirect to={`${path}/details`} />
          </Route>
        </Switch>
      </div>
    </section>
  );
};
