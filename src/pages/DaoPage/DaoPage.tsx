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
  daoListSelector,
  daoSelector,
  proposalListSelector,
} from 'redux/selectors';

import { StoreState } from 'types/store';
import { Proposal } from 'types/proposal';
import { DaoItem } from 'types/dao';

import { fetchProposals } from 'redux/actions';
import imgPlaceholder from 'images/placeholder.png';
import { appConfig } from 'config';
import s from './DaoPage.module.scss';

export const DaoPage: React.FC = () => {
  const dispatch = useDispatch();
  const params = useParams<{ id: string }>();
  const { path, url } = useRouteMatch();
  const [isShowCreateProposal, setIsShowCreateProposal] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleError = (event: any) => {
    event.target.onerror = null;
    event.target.src = imgPlaceholder;
    event.target.style = 'background-image: none';
  };

  return (
    <section className={s.root}>
      <section className={s.slider}>
        <SmallDaoSlider daos={daoList} activeDaoId={params.id} />
      </section>
      <div className={s.content}>
        <section className={s.header}>
          <img
            ref={imgRef}
            className={s.picture}
            src={`${appConfig.logoPath}${dao?.id}.png`}
            onError={handleError}
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
            {dao && <DaoProposals proposals={proposals} dao={dao} />}
          </Route>

          <Route path={`${path}`}>
            <Redirect to={`${url}/proposals`} />
          </Route>
        </Switch>
      </div>

      {isShowCreateProposal && dao && (
        <CreateProposalPopup
          dao={dao}
          onClose={() => {
            setIsShowCreateProposal(false);
          }}
        />
      )}
    </section>
  );
};
