/* eslint-disable no-param-reassign */
import React, { useEffect, useRef, useState } from 'react';
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
  accountSelector,
  daoListSelector,
  daoSelector,
  proposalListSelector,
} from 'redux/selectors';

import { StoreState } from 'types/store';
import { Proposal } from 'types/proposal';
import { DaoItem } from 'types/dao';

import { fetchProposals, login } from 'redux/actions';
import { appConfig } from 'config';
import s from './DaoPage.module.scss';

export const DaoPage: React.FC = () => {
  const dispatch = useDispatch();
  const params = useParams<{ id: string }>();
  const { path, url } = useRouteMatch();
  const [isShowCreateProposal, setIsShowCreateProposal] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const account = useSelector(accountSelector);
  const daoList = useSelector(daoListSelector);
  const reversDaoList = daoList.slice().reverse();
  // const [reversDaoList, setReversDaoList] = useState<DaoItem[]>([]);
  const dao = useSelector<StoreState, DaoItem | undefined>((state) =>
    daoSelector(state, params.id),
  );
  const proposals = useSelector<StoreState, Proposal[]>((state) =>
    proposalListSelector(state, params.id),
  );

  console.log(proposals);

  useEffect(() => {
    dispatch(fetchProposals.started(params.id));
  }, [dispatch, params.id]);

  const handleShowCreateProposalPopup = () => {
    if (account) {
      setIsShowCreateProposal(true);

      return;
    }

    dispatch(login.started());
  };

  const handleCreateProposal = () => {
    setIsShowCreateProposal(false);
  };

  return (
    <section className={s.root}>
      <section className={s.slider}>
        <SmallDaoSlider daos={reversDaoList} activeDaoId={params.id} />
      </section>
      <div className={s.content}>
        <section className={s.header}>
          <img
            ref={imgRef}
            className={s.picture}
            src={`${appConfig.logoPath}${dao?.id}.png`}
            alt="Logo"
          />
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
              onClick={handleShowCreateProposalPopup}
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
            {dao && <DaoProposals proposals={proposals} dao={dao} />}
          </Route>

          <Route path={`${path}`}>
            <Redirect to={`${url}/proposals`} />
          </Route>
        </Switch>
      </div>

      {isShowCreateProposal && dao && (
        <CreateProposalPopup dao={dao} onClose={handleCreateProposal} />
      )}
    </section>
  );
};
