/* eslint-disable no-param-reassign */
import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import cn from 'classnames';
import InfiniteScroll from 'react-infinite-scroller';

import { Button, SvgIcon } from 'components/UILib';
import { DaoProposals } from 'components/DaoProposals';
import { CreateProposalPopup } from 'components/CreateProposalPopup';
import { MembersPopup } from 'components/MembersPopup';
import { PurposePopup } from 'components/PurposePopup';
import { DaoDetailPopup } from 'components/DaoDetailPopup';

import { accountSelector, daoSelector } from 'redux/selectors';

import { StoreState } from 'types/store';
import { Proposal } from 'types/proposal';
import { DaoItem } from 'types/dao';

import { NearService } from 'services/NearService';

import { login } from 'redux/actions';
import { appConfig, nearConfig } from 'config';

import s from './DaoPage.module.scss';

export const DaoPage: React.FC = () => {
  const dispatch = useDispatch();
  const params = useParams<{ id: string }>();
  const [isShowCreateProposal, setIsShowCreateProposal] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const [isShowMembersPopup, setIsShowMembersPopup] = useState(false);
  const [isShowPurposePopup, setIsShowPurposePopup] = useState(false);
  const [isShowDaoDetailPopup, setIsShowDaoDetailPopup] = useState(false);

  const account = useSelector(accountSelector);
  const dao = useSelector<StoreState, DaoItem | undefined>((state) =>
    daoSelector(state, params.id),
  );
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [proposalsLoading, setProposalsLoading] = useState(false);
  const [offset, setOffset] = useState(50);

  const daoName = dao?.id.replace(`.${nearConfig.contractName}`, '');
  const numberOfProposals = dao?.numberOfProposals || 0;

  useEffect(() => {
    if (daoName) {
      document.title = daoName;
    }
  }, [daoName]);

  useEffect(() => {
    const DEFAULT_LIMIT = 50;

    if (!numberOfProposals) return;

    setProposalsLoading(true);

    const newOffset = numberOfProposals - offset;
    const limit = newOffset < 0 ? DEFAULT_LIMIT + newOffset : DEFAULT_LIMIT;

    NearService.getProposals(params.id, Math.max(newOffset, 0), limit)
      .then((response) => {
        setProposals((prev) => [...prev, ...response]);
      })
      .finally(() => {
        setTimeout(() => {
          setProposalsLoading(false);
        }, 80);
      });
  }, [params.id, numberOfProposals, offset]);

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

  const handleLoadMore = () => {
    if (!proposalsLoading) {
      setOffset((prev) => prev + 50);
    }
  };

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
        <InfiniteScroll
          loadMore={handleLoadMore}
          threshold={1000}
          initialLoad={false}
          hasMore={numberOfProposals > offset}
        >
          <DaoProposals
            proposals={proposals}
            dao={dao}
            loading={proposalsLoading}
          />
        </InfiniteScroll>
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
