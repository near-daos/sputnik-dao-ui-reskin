/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import {
  accountSelector,
  daoSelector,
  proposalSelector,
} from 'redux/selectors';

import { Button, Chip, SvgIcon } from 'components/UILib';

import useMedia from 'hooks/use-media';

import { NearService } from 'services/NearService';
import { DaoItem } from 'types/dao';
import { StoreState } from 'types/store';
import { Proposal, ProposalStatus, ProposalType } from 'types/proposal';

import { convertDuration } from 'utils';
import numberReduction from 'utils/numberReduction';

import { getTitle } from 'components/ProposalCard/utils';
import { ButtonProps } from 'components/UILib/Button/Button';
import { MembersPopup } from 'components/MembersPopup';
import { fetchProposals } from 'redux/actions';
import s from './ProposalPage.module.scss';
import { nearConfig } from '../../config';

const NUMBER_OF_TOP_MEMBERS = 10;

type ActionProps = Pick<ButtonProps, 'onClick' | 'disabled'> & {
  label: string;
  count: number;
};

const Action: React.FC<ActionProps> = ({ label, count, disabled, onClick }) => {
  const media = useMedia();

  return (
    <Button
      size={media.mobile ? 'xs' : 'sm'}
      variant="outline"
      className={s.action}
      disabled={disabled}
      onClick={onClick}
    >
      <>
        {label}{' '}
        <span className={s.buttonTextCount}>({numberReduction(count)})</span>
      </>
    </Button>
  );
};

const getStatus = (status: ProposalStatus) => {
  switch (status) {
    case ProposalStatus.Success:
      return 'success';
    case ProposalStatus.Reject:
      return 'error';
    case ProposalStatus.Vote:
      return 'inProgress';
    case ProposalStatus.Delay:
      return 'warning';
    case ProposalStatus.Fail:
      return 'error';

    default:
      return 'default';
  }
};

const getStatusText = (status: ProposalStatus): string => {
  switch (status) {
    case ProposalStatus.Success:
      return 'Approved';
    case ProposalStatus.Reject:
      return 'Rejected';
    case ProposalStatus.Vote:
      return 'Voting is in progress';
    case ProposalStatus.Delay:
      return 'Delayed';
    case ProposalStatus.Fail:
      return 'Fail';

    default:
      return 'Fail';
  }
};

export const ProposalPage: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const media = useMedia();
  const params = useParams<{ daoId: string; proposalId: string }>();
  const { daoId } = params;
  const proposalId = Number(params.proposalId);
  const [isShowMembersPopup, setIsShowMembersPopup] = useState(false);

  const dao = useSelector<StoreState, DaoItem | null>(
    (state) => daoSelector(state, params.daoId) || null,
  );
  const proposal = useSelector<StoreState, Proposal | null>(
    (state) => proposalSelector(state, params.daoId, proposalId) || null,
  );
  const accountId = useSelector(accountSelector);

  const [firstTenMembers] = useState<string[]>(
    (dao?.members || []).slice(0, NUMBER_OF_TOP_MEMBERS),
  );

  const handleApprove = () => {
    NearService.vote(daoId, proposalId, 'Yes');
  };

  const handleFinalize = () => {
    NearService.finalize(daoId, proposalId);
  };

  const handleReject = () => {
    NearService.vote(daoId, proposalId, 'Yes');
  };

  const handleGoBack = () => {
    history.push(`/dao/${daoId}`);
  };

  useEffect(() => {
    dispatch(fetchProposals.started(daoId));
  }, [dispatch, daoId]);

  useEffect(() => {
    const daoName = dao?.id.replace(`.${nearConfig.contractName}`, '');

    if (daoName) {
      document.title = `${daoName} - #${proposalId}`;
    }
  }, [dao, proposalId]);

  if (!proposal) {
    return null;
  }

  console.log(proposal);

  const isMember = dao?.members.includes(accountId || '');

  const votePeriodEnd = convertDuration(proposal.votePeriodEnd);
  const isNotExpired = votePeriodEnd < new Date();
  const isActionDisabled =
    isNotExpired || proposal.status !== ProposalStatus.Vote;
  const isShowFinalize =
    isNotExpired &&
    proposal.proposer === accountId &&
    proposal.status === ProposalStatus.Vote;

  const [description, link] = proposal.description.split('/t/');
  const linkEl = !!link && (
    <a
      target="_blank"
      href={`https://gov.near.org/t/${link}`}
      rel="nofollow noreferrer"
    >
      {`https://gov.near.org/t/${link}`}
    </a>
  );

  const councilMembers = dao?.members.length || 0;

  return (
    <section className={s.root}>
      <div className={s.container}>
        <Button
          className={s.btnBack}
          size={media.mobile ? 'xs' : 'sm'}
          variant="monochrome"
          leftElement={<SvgIcon className={s.leftArrowIcon} icon="dd-arrow" />}
          onClick={handleGoBack}
        >
          Back to DAO
        </Button>

        <Chip
          className={s.status}
          label={getStatusText(proposal.status)}
          color={getStatus(proposal.status)}
          active
        />

        <div className={s.content}>
          <header className={s.header}>
            <h4 className={s.title}>{getTitle(proposal)}</h4>
            <p className={s.target}>
              <span>Target: </span>
              {proposal.target}
            </p>
          </header>

          {isMember && (
            <div className={s.actions}>
              <Action
                label="Approve"
                disabled={isActionDisabled}
                count={proposal.voteYes}
                onClick={handleApprove}
              />
              <Action
                label="Reject"
                disabled={isActionDisabled}
                count={proposal.voteNo}
                onClick={handleReject}
              />
            </div>
          )}

          <div className={s.about}>
            <h5 className={s.aboutTitle}>About</h5>
            <p className={s.aboutDesc}>
              {description}
              {linkEl}
            </p>
          </div>

          <div className={s.detailsWrapper}>
            <dl className={s.details}>
              <dt className={s.detailsLabel}>DAO name</dt>
              <dd className={s.detailsValue}>{dao?.id}</dd>
              <dt className={s.detailsLabel}>Voting deadline</dt>
              <dd className={s.detailsValue}>
                {convertDuration(proposal.votePeriodEnd).toLocaleDateString()}{' '}
                {convertDuration(proposal.votePeriodEnd).toLocaleTimeString()}
              </dd>
              <dt className={s.detailsLabel}>Proposer</dt>
              <dd className={s.detailsValue}>{proposal.proposer}</dd>
              {proposal.kind.type === ProposalType.Payout && (
                <>
                  <dt className={s.detailsLabel}>
                    Payout
                    <SvgIcon icon="token" size={10} className={s.tokenIcon} />
                  </dt>
                  <dd className={s.detailsValue}>{proposal.kind.amount}</dd>
                </>
              )}
              {proposal.kind.type === ProposalType.ChangeVotePeriod && (
                <>
                  <dt className={s.detailsLabel}>
                    Vote Period
                    <SvgIcon icon="token" size={10} className={s.tokenIcon} />
                  </dt>
                  <dd className={s.detailsValue}>{proposal.kind.votePeriod}</dd>
                </>
              )}
              {proposal.kind.type === ProposalType.ChangePurpose && (
                <>
                  <dt className={s.detailsLabel}>Purpose</dt>
                  <dd className={s.detailsValue}>{proposal.kind.purpose}</dd>
                </>
              )}
              <dt className={s.detailsLabel}>Proposal ID</dt>
              <dd className={s.detailsValue}>{proposalId}</dd>
            </dl>

            {isShowFinalize && (
              <Button
                size={media.mobile ? 'xs' : 'sm'}
                variant="monochrome"
                className={s.finalize}
                onClick={handleFinalize}
              >
                Finalise
              </Button>
            )}
          </div>

          <div className={s.council}>
            <h6 className={s.councilTitle}>Council</h6>
            <ul className={s.councilList}>
              {firstTenMembers.map((item) => (
                <li className={s.councilItem} key={item}>
                  {item}
                </li>
              ))}
            </ul>
            {councilMembers > NUMBER_OF_TOP_MEMBERS && (
              <Button
                variant="outline"
                rightElement={<span>({councilMembers})</span>}
                size="sm"
                className={s.button}
                onClick={() => {
                  setIsShowMembersPopup(true);
                }}
              >
                View All
              </Button>
            )}
          </div>

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
        </div>
      </div>
    </section>
  );
};
