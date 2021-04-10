import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Redirect,
  Route,
  Switch,
  useParams,
  useRouteMatch,
} from 'react-router-dom';

import { Button, NavTabs } from 'components/UILib';
import { DaoDetails } from 'components/DaoDetails';
import { DaoProposals } from 'components/DaoProposals';
import { SmallDaoSlider } from 'components/SmallDaoSlider';
import { CreateProposalPopup } from 'components/CreateProposalPopup';

import {
  daoListSelector,
  daoSelector,
  proposalListSelector,
} from 'redux/selectors';

import { StoreState } from 'types/store';
import { Proposal } from 'types/proposal';
import { DaoItem } from 'types/dao';

import { fetchProposals } from 'redux/actions';
import s from './DaoPage.module.scss';

export const DaoPage: React.FC = () => {
  const dispatch = useDispatch();
  const params = useParams<{ id: string }>();
  const { path, url } = useRouteMatch();
  const [isShowCreateProposal, setIsShowCreateProposal] = useState(false);

  const daoList = useSelector(daoListSelector);
  const dao = useSelector<StoreState, DaoItem | undefined>((state) =>
    daoSelector(state, params.id),
  );
  const proposals = useSelector<StoreState, Proposal[]>((state) =>
    proposalListSelector(state, params.id),
  );

  useEffect(() => {
    dispatch(fetchProposals.started(params.id));
  }, [dispatch, params.id]);

  return (
    <section className={s.root}>
      <section className={s.slider}>
        <SmallDaoSlider daos={daoList} activeDaoId={daoList[0].id} />
      </section>
      <div className={s.content}>
        <section className={s.header}>
          <img className={s.picture} src="{currentDao.image}" alt="" />
          <h1 className={s.heading}>DAO {dao?.id}</h1>
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
            {dao && <DaoDetails dao={dao} />}
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
          daoName={dao?.id || ''}
          onClose={() => {
            setIsShowCreateProposal(false);
          }}
        />
      )}
    </section>
  );
};
