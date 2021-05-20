/* eslint-disable no-param-reassign */
import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import cn from 'classnames';

import { Button, SvgIcon } from 'components/UILib';
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
import { appConfig, nearConfig } from 'config';
import s from './DaoPage.module.scss';
import { MembersPopup } from '../../components/MembersPopup';
import { PurposePopup } from '../../components/PurposePopup';
import { DaoDetailPopup } from '../../components/DaoDetailPopup';

export const DaoPage: React.FC = () => {
  const dispatch = useDispatch();
  const params = useParams<{ id: string }>();
  const [isShowCreateProposal, setIsShowCreateProposal] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const [isShowMembersPopup, setIsShowMembersPopup] = useState(false);
  const [isShowPurposePopup, setIsShowPurposePopup] = useState(false);
  const [isShowDaoDetailPopup, setIsShowDaoDetailPopup] = useState(false);

  const account = useSelector(accountSelector);
  const daoList = useSelector(daoListSelector);
  const reversDaoList = daoList.slice().reverse();
  const dao = useSelector<StoreState, DaoItem | undefined>((state) =>
    daoSelector(state, params.id),
  );
  const proposals = useSelector<StoreState, Proposal[]>((state) =>
    proposalListSelector(state, params.id),
  );

  const daoName = dao?.id.replace(`.${nearConfig.contractName}`, '');

  useEffect(() => {
    if (daoName) {
      document.title = daoName;
    }
  }, [daoName]);

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

  // console.log(document.location);

  // const meta1 = document.createElement('meta');
  //
  // meta1.setAttribute('property', 'og:url');
  // meta1.content = document.location.href;
  //
  // document.head.appendChild(meta1);

  const metaURL = document.querySelector('meta[property="og:url"]');
  const metaTitle = document.querySelector('meta[property="og:title"]');
  const metaDescription = document.querySelector(
    'meta[property="og:description"]',
  );
  const metaImage = document.querySelector('meta[property="og:image"]');

  if (metaURL) {
    metaURL.setAttribute('content', document.location.href);
  }

  if (metaTitle && daoName) {
    metaTitle.setAttribute('content', daoName);
  }

  if (metaDescription) {
    metaDescription.setAttribute('content', 'some description');
  }

  if (metaImage) {
    metaImage.setAttribute('content', `${appConfig.logoPath}${dao?.id}.png`);
  }

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
        <DaoProposals proposals={proposals} dao={dao} />
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
