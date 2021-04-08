import React, { useState } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import { Button, NavTabs } from 'components/UILib';
import { DaoDetails } from 'components/DaoDetails';
import { DaoProposals } from 'components/DaoProposals';

import { SmallDaoSlider } from 'components/SmallDaoSlider';
import { mockDaos, proposals } from './mockData';

import s from './DaoPage.module.scss';
import CreateProposalPopup from '../../components/CreateProposalPopup/CreateProposalPopup';
import { Dao } from '../../types/dao';

export const DaoPage: React.FC = () => {
  const [isShowCreateProposal, setIsShowCreateProposal] = useState(false);
  const { path, url } = useRouteMatch();
  const currentDao: Dao = {
    id: '123',
    name: 'Name_7',
    purpose:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sagittis eleifend habitant laoreet ornare vitae consequat. Potenti ut urna, ultricies elit nam. Feugiat porta elit ultricies eu mollis. Faucibus mauris faucibus aliquam non. In in molestie netus vulputate odio risus aliquam. Blandit nulla convallis lorem condimentum non tortor. Blandit nulla convallis lorem condimentum non tortor to....',
    numberOfProposals: 313,
    bond: 123,
    amountMembers: 123,
    daoFunds: 12,
    image: 'https://reactjs.org/logo-og.png',
    members: [
      'mamber1',
      'mamber2',
      'mamber3',
      'mamber4',
      'mamber1',
      'mamber2',
      'mamber3',
      'mamber4',
      'mamber1',
      'mamber2',
      'mamber3',
      'mamber4',
    ],
    network: 'Test',
    votePeriod: new Date('May 3 2021 15:48:17 GMT+0300'),
  };

  return (
    <section className={s.root}>
      <section className={s.slider}>
        <SmallDaoSlider daos={mockDaos} activeDaoId={mockDaos[0].id} />
      </section>
      <div className={s.content}>
        <section className={s.header}>
          <img className={s.picture} src={currentDao.image} alt="" />
          <h1 className={s.heading}>DAO {currentDao.name}</h1>
          <div className={s.nav}>
            <NavTabs
              className={s.navTabs}
              options={[
                { name: 'Proposals', route: `${url}/proposals` },
                { name: 'Details', route: `${url}/details` },
              ]}
            />
          </div>
          <div className={s.buttons}>
            <Button
              className={s.button}
              variant="outline"
              onClick={() => {
                setIsShowCreateProposal(true);
              }}
            >
              Create new proposal
            </Button>
          </div>
        </section>

        <Switch>
          <Route path={`${path}/details`}>
            <DaoDetails dao={currentDao} />
          </Route>

          <Route path={`${path}/proposals`}>
            <DaoProposals proposals={proposals} />
          </Route>

          <Route path={`${path}`}>
            <Redirect to={`${url}/details`} />
          </Route>
        </Switch>
      </div>

      {isShowCreateProposal && (
        <CreateProposalPopup
          daoName={currentDao.name}
          onClose={() => {
            setIsShowCreateProposal(false);
          }}
        />
      )}
    </section>
  );
};
