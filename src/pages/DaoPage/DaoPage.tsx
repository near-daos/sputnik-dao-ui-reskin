/* eslint-disable no-param-reassign */
import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import cn from 'classnames';

import { Button, SvgIcon } from 'components/UILib';
import { DaoProposals } from 'components/DaoProposals';
import { CreateProposalPopup } from 'components/CreateProposalPopup';
import { MembersPopup } from 'components/MembersPopup';
import { PurposePopup } from 'components/PurposePopup';
import { DaoDetailPopup } from 'components/DaoDetailPopup';

import {
  daoSelector,
  accountSelector,
  selectDaosLoading,
} from 'redux/selectors';

import { StoreState } from 'types/store';
import { Proposal } from 'types/proposal';
import { DaoItem } from 'types/dao';

import { NearService } from 'services/NearService';
import useInfiniteScroll from 'hooks/use-infinite-scroll';

import { fetchDao, login } from 'redux/actions';
import { appConfig, nearConfig } from 'config';

import { NOT_FOUND_PAGE } from '../../constants/routingConstants';

import s from './DaoPage.module.scss';

export const DaoPage: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const params = useParams<{ id: string }>();
  const imgRef = useRef<HTMLImageElement>(null);

  const [isShowMembersPopup, setIsShowMembersPopup] = useState(false);
  const [isShowPurposePopup, setIsShowPurposePopup] = useState(false);
  const [isShowDaoDetailPopup, setIsShowDaoDetailPopup] = useState(false);
  const [isShowCreateProposal, setIsShowCreateProposal] = useState(false);

  const account = useSelector(accountSelector);
  const daosLoading = useSelector(selectDaosLoading);

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [proposalsLoading, setProposalsLoading] = useState(false);

  const dao = useSelector<StoreState, DaoItem | null>((state) =>
    daoSelector(state, params.id),
  );
  const daoName = dao?.id.replace(`.${nearConfig.contractName}`, '');
  const numberOfProposals = dao?.numberOfProposals || 0;

  useEffect(() => {
    if (daoName) {
      document.title = daoName;
    }
  }, [daoName]);

  useEffect(() => {
    setProposals([]);
    dispatch(fetchDao.started(params.id));
  }, [params.id, dispatch]);

  useEffect(() => {
    if (!daosLoading && !dao) {
      history.push(NOT_FOUND_PAGE);
    }
  });

  const handleLoadMore = () => {
    setProposalsLoading(true);

    NearService.getProposals(params.id, proposals.length)
      .then((response) => setProposals((prev) => [...prev, ...response]))
      .finally(() => {
        setProposalsLoading(false);
      });
  };

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

  const { infiniteScrollAnchor } = useInfiniteScroll({
    initialLoad: true,
    isLoading: proposalsLoading,
    hasMore: !proposalsLoading && numberOfProposals > proposals.length,
    onLoadMore: handleLoadMore,
    threshold: 500,
  });

  return (
    <section className={s.root}>
      <div className={s.content}>
        <section className={s.header}>
          <img
            ref={imgRef}
            className={s.picture}
            src={`${appConfig.logoPath}${dao?.id}.png`}
            alt="Logo"
          />
          <div className={s.heading}>
            <p className={s.name}>{daoName}</p>
            <p className={s.contractName}>.{nearConfig.contractName}</p>
            <div className={s.details}>
              <div className={s.detailWrapper}>
                <div className={s.subTitleWrapper}>
                  <p className={s.subTitle}>DAO Funds</p>
                  <SvgIcon icon="token" size={12} className={s.tokenIcon} />
                </div>
                <p className={s.value}>{dao?.amount}</p>
              </div>
              <div className={s.detailRow}>
                <button
                  className={cn(s.council, s.detailWrapper)}
                  onClick={() => {
                    setIsShowMembersPopup(true);
                  }}
                >
                  <p className={s.subTitle}>Council</p>
                  <p className={s.value}>
                    {dao?.members.length}
                    <SvgIcon icon="info" size={18} className={s.infoIcon} />
                  </p>
                </button>
                <div className={s.detailWrapper}>
                  <div className={s.subTitleWrapper}>
                    <p className={s.subTitle}>Bond</p>
                    <SvgIcon icon="token" size={12} className={s.tokenIcon} />
                  </div>
                  <p className={s.value}>{dao?.bond}</p>
                </div>
                <div className={s.detailWrapper}>
                  <p className={s.subTitle}>Vote Period</p>
                  <p className={s.value}>{dao?.votePeriod}</p>
                </div>
                <button
                  className={s.purposeButton}
                  onClick={() => {
                    setIsShowPurposePopup(true);
                  }}
                >
                  Purpose
                  <SvgIcon icon="info" size={18} className={s.infoIcon} />
                </button>
              </div>
            </div>
            <button
              className={s.detailsButton}
              onClick={() => {
                setIsShowDaoDetailPopup(true);
              }}
            >
              View DAO Details
              <SvgIcon icon="info" size={18} className={s.infoIcon} />
            </button>
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
        <DaoProposals
          proposals={proposals}
          dao={dao}
          loading={proposalsLoading}
        />
        {infiniteScrollAnchor}
      </div>

      {isShowCreateProposal && dao && (
        <CreateProposalPopup dao={dao} onClose={handleCreateProposal} />
      )}
      {isShowPurposePopup && dao && (
        <PurposePopup
          name={dao.id}
          purpose={dao.purpose}
          onClose={() => {
            setIsShowPurposePopup(false);
          }}
        />
      )}
      {isShowDaoDetailPopup && dao && (
        <DaoDetailPopup
          dao={dao}
          onClose={() => {
            setIsShowDaoDetailPopup(false);
          }}
          onOpenMembersModal={() => {
            setIsShowMembersPopup(true);
          }}
        />
      )}
      {isShowMembersPopup && dao && (
        <MembersPopup
          name={dao.id}
          membersNumber={dao.members.length}
          members={dao.members}
          onClose={() => {
            setIsShowMembersPopup(false);
          }}
        />
      )}
    </section>
  );
};
