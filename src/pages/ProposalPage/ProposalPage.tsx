/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import cn from 'classnames';
import {
  accountSelector,
  daoSelector,
  proposalSelector,
} from 'redux/selectors';

import { Button, Chip, SvgIcon, Tooltip } from 'components/UILib';

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
import { appConfig, nearConfig } from '../../config';
import { VotedMembersPopup } from '../../components/VotedMembersPopup';

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

  const acceptUsers: string[] = [];
  const rejectUsers: string[] = [];

  const getVotes = () => {
    Object.keys(proposal.votes).forEach((key) => {
      const user = key
        .split(/(?=[A-Z])/)
        .join('.')
        .toLowerCase();

      if (proposal.votes[key] === 'Yes') {
        acceptUsers.push(user);
      } else if (proposal.votes[key] === 'No') {
        rejectUsers.push(user);
      }
    });
  };

  getVotes();

  const isVoteApprove = (name: string): boolean =>
    acceptUsers.findIndex((item) => item === name) !== -1;

  const isVoteReject = (name: string): boolean =>
    rejectUsers.findIndex((item) => item === name) !== -1;

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
        <div className={s.topWrapper}>
          <Button
            className={s.btnBack}
            size={media.mobile ? 'xs' : 'sm'}
            variant="monochrome"
            leftElement={
              <SvgIcon className={s.leftArrowIcon} icon="dd-arrow" />
            }
            onClick={handleGoBack}
          >
            Back to
          </Button>
          <div className={s.daoData}>
            <img
              className={s.daoLogo}
              src={`${appConfig.logoPath}${dao?.id}.png`}
              alt="Logo"
            />
            <p className={s.daoName}>{dao?.id}</p>
          </div>
        </div>

        <Chip
          className={s.status}
          label={getStatusText(proposal.status)}
          color={getStatus(proposal.status)}
          active
        />

        <div className={s.content}>
          <header className={s.header}>
            <p className={s.title}>{getTitle(proposal)}</p>

            {isMember && (
              <div className={s.actions}>
                <Tooltip
                  className={s.action}
                  containerClassName={s.membersTooltip}
                  position="bottom"
                  triggerElem={
                    <Action
                      label="Approve"
                      disabled={isActionDisabled}
                      count={proposal.voteYes}
                      onClick={handleApprove}
                    />
                  }
                >
                  {acceptUsers.length === 0 && (
                    <p className={s.tooltipNothing}>No votes yet.</p>
                  )}
                  {acceptUsers.slice(-5).map((item) => (
                    <p className={s.tooltipMember}>{item}</p>
                  ))}
                </Tooltip>

                <Tooltip
                  className={s.action}
                  containerClassName={s.membersTooltip}
                  position="bottom"
                  triggerElem={
                    <Action
                      label="Reject"
                      disabled={isActionDisabled}
                      count={proposal.voteNo}
                      onClick={handleReject}
                    />
                  }
                >
                  {rejectUsers.length === 0 && (
                    <p className={s.tooltipNothing}>No votes yet.</p>
                  )}
                  {rejectUsers.slice(-5).map((item) => (
                    <p className={s.tooltipMember}>{item}</p>
                  ))}
                </Tooltip>
              </div>
            )}
          </header>
          <div className={cn(s.row, s.topRow)}>
            {/* <p className={s.target}> */}
            {/*  <span>Target: </span> */}
            {/*  {proposal.target} */}
            {/* </p> */}
            <div className={s.dataWrapper}>
              <p className={s.dataTitle}>Target</p>
              <p className={s.dataValue}>{proposal.target}</p>
            </div>
            <div className={cn(s.dataWrapper, s.proposalPayoutWrapper)}>
              <p className={s.dataTitle}>Proposer</p>
              <p className={s.dataValue}>{proposal.proposer}</p>
            </div>
            <div className={cn(s.row, s.proposalPayoutWrapper)}>
              <div className={s.dataWrapper}>
                <p className={s.dataTitle}>Proposal ID</p>
                <p className={s.dataValue}>{proposalId}</p>
              </div>
              {proposal.kind.type === ProposalType.Payout && (
                <div className={s.dataWrapper}>
                  <div className={s.dataTitleWrapper}>
                    <p className={s.dataTitle}>Payout</p>
                    <SvgIcon icon="token" size={10} className={s.tokenIcon} />
                  </div>
                  <p className={s.dataValue}>{proposal.kind.amount}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={s.contentWrapper}>
          <div className={s.detailsWrapper}>
            <p className={s.aboutTitle}>About</p>
            <p className={s.about}>{description}</p>
            {/* <div className={s.row}> */}
            {/*  <div className={s.dataWrapper}> */}
            {/*    <p className={s.dataTitle}>Proposer</p> */}
            {/*    <p className={s.dataValue}>{proposal.proposer}</p> */}
            {/*  </div> */}
            {/* </div> */}
          </div>
          <div className={s.membersWrapper}>
            <div className={s.council}>
              <h6 className={s.councilTitle}>Council</h6>
              <ul className={s.councilList}>
                {firstTenMembers.map((item) => (
                  <li
                    className={cn(s.councilItem, {
                      [s.vote]: isVoteReject(item) || isVoteApprove(item),
                    })}
                    key={item}
                  >
                    <span
                      className={cn(s.rect, {
                        [s.red]: isVoteReject(item),
                        [s.green]: isVoteApprove(item),
                      })}
                    />
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
          </div>
        </div>

        {isShowMembersPopup && dao && (
          <VotedMembersPopup
            name={dao.id}
            members={dao.members}
            approveArray={acceptUsers}
            rejectArray={rejectUsers}
            onClose={() => {
              setIsShowMembersPopup(false);
            }}
          />
        )}
      </div>
    </section>
  );
};
