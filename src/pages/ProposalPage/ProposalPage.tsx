/* eslint-disable no-param-reassign */
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import cn from 'classnames';
import { accountSelector, daoSelector } from 'redux/selectors';

import { Countdown } from 'components';
import { getTitle } from 'components/ProposalCard/utils';
import { ButtonProps } from 'components/UILib/Button/Button';
import { VotedMembersPopup } from 'components/VotedMembersPopup';
import { Button, Chip, SvgIcon, Tooltip } from 'components/UILib';

import useMedia from 'hooks/use-media';

import { DaoItem } from 'types/dao';
import { StoreState } from 'types/store';
import { Proposal, ProposalStatus, ProposalType } from 'types/proposal';

import { NearService } from 'services/NearService';

import { convertDuration, getDescriptionAndLink } from 'utils';
import numberReduction from 'utils/numberReduction';

import { appConfig, nearConfig } from 'config';

import { NOT_FOUND_PAGE } from '../../constants/routingConstants';

import s from './ProposalPage.module.scss';

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

const getStatus = (proposal: Proposal) => {
  switch (proposal.status) {
    case ProposalStatus.Success:
      return 'success';
    case ProposalStatus.Reject:
      return 'error';
    case ProposalStatus.Vote:
      if (convertDuration(proposal.votePeriodEnd) < new Date()) {
        return 'error';
      }

      return 'inProgress';
    case ProposalStatus.Fail:
      return 'error';

    default:
      return 'default';
  }
};

const getStatusText = (proposal: Proposal): string => {
  switch (proposal.status) {
    case ProposalStatus.Success:
      return 'Approved';
    case ProposalStatus.Reject:
      return 'Rejected';
    case ProposalStatus.Vote:
      if (convertDuration(proposal.votePeriodEnd) < new Date()) {
        return 'Expired';
      }

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
  const history = useHistory();
  const media = useMedia();
  const params = useParams<{ daoId: string; proposalId: string }>();
  const { daoId } = params;
  const proposalId = Number(params.proposalId);
  const [isShowMembersPopup, setIsShowMembersPopup] = useState(false);

  const dao = useSelector<StoreState, DaoItem | null>(
    (state) => daoSelector(state, params.daoId) || null,
  );

  const [proposalLoaded, setProposalLoaded] = useState(false);
  const [proposal, setProposal] = useState<Proposal | null>(null);
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
    NearService.vote(daoId, proposalId, 'No');
  };

  const handleGoBack = () => {
    history.push(`/dao/${daoId}`);
  };

  const navigateToNotFoundPage = useCallback(
    () => history.push(NOT_FOUND_PAGE),
    [history],
  );

  useEffect(() => {
    if (proposalLoaded && !proposal) {
      navigateToNotFoundPage();
    }
  }, [proposal, proposalLoaded, navigateToNotFoundPage]);

  useEffect(() => {
    NearService.getProposal(daoId, proposalId)
      .then(setProposal)
      .finally(() => {
        setProposalLoaded(true);
      });
  }, [daoId, proposalId, navigateToNotFoundPage]);

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

  const votePeriodEnd = convertDuration(proposal.votePeriodEnd);
  const isNotExpired = votePeriodEnd < new Date();

  const isActionDisabled =
    isNotExpired ||
    proposal.status !== ProposalStatus.Vote ||
    !accountId ||
    !dao?.members.includes(accountId);

  const isShowFinalize =
    isNotExpired &&
    proposal.proposer === accountId &&
    proposal.status === ProposalStatus.Vote;

  const [description, linkEl] = getDescriptionAndLink(
    proposal.description,
    s.proposalLink,
  );

  const councilMembers = dao?.members.length || 0;

  const getVotingData = (): [boolean, boolean] => {
    let isVoted = false;
    let vote = false;

    Object.keys(proposal.votes).forEach((key) => {
      const user = key
        .split(/(?=[A-Z])/)
        .join('.')
        .toLowerCase();

      if (user === accountId) {
        isVoted = true;
        vote = proposal.votes[key] === 'Yes';
      }
    });

    return [isVoted, vote];
  };

  const [isVoted, vote] = getVotingData();

  const finaliseButton = (className: string) => {
    if (isShowFinalize) {
      return (
        <Button
          size="sm"
          variant="outline"
          className={cn(s.action, className)}
          onClick={handleFinalize}
        >
          Finalise
        </Button>
      );
    }

    return null;
  };

  let newVotePeriod = 0;

  if (proposal.kind.type === ProposalType.ChangeVotePeriod) {
    newVotePeriod = Number(proposal.kind.votePeriod) / 10e8 / 60 / 60;
  }

  function renderPurposeIfAvailable() {
    if (proposal?.kind.type === ProposalType.ChangePurpose) {
      return (
        <>
          <p className={s.subTitle}>New Purpose</p>
          <p className={s.description}>{proposal.kind.purpose}</p>
        </>
      );
    }

    return null;
  }

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

        <div className={s.statusContainer}>
          <Chip
            className={s.status}
            label={getStatusText(proposal)}
            color={getStatus(proposal)}
            active
          />
          <Countdown
            date={votePeriodEnd}
            className={s.countdown}
            hidden={proposal.status !== ProposalStatus.Vote}
          />
        </div>

        <div className={s.content}>
          <header className={s.header}>
            <p className={s.title}>{getTitle(proposal)}</p>

            {/* {isMember && ( */}

            {finaliseButton(s.hideDesktop)}

            {!isVoted && (
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
                    <p key={item} className={s.tooltipMember}>
                      {item}
                    </p>
                  ))}
                </Tooltip>

                {finaliseButton(s.hideMobile)}

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
                    <p key={item} className={s.tooltipMember}>
                      {item}
                    </p>
                  ))}
                </Tooltip>

                <div className={s.mobileBlock}>
                  <div className={s.voteAmount}>
                    <span className={s.green}>{proposal.voteYes}</span>
                    &nbsp;approvals
                  </div>
                  <div className={s.voteAmount}>
                    <span className={s.red}>{proposal.voteNo}</span>
                    &nbsp;rejections
                  </div>
                </div>
              </div>
            )}
            {isVoted && (
              <div className={s.voteDetailsWrapper}>
                <div className={s.voteStatusWrapper}>
                  {vote ? (
                    <>
                      <p className={cn(s.voteStatus)}>
                        You have approved this proposal
                      </p>
                      <SvgIcon
                        icon="accept"
                        size={26}
                        className={s.bigAcceptIcon}
                      />
                    </>
                  ) : (
                    <>
                      <p className={cn(s.voteStatus)}>
                        You have rejected this proposal
                      </p>
                      <SvgIcon
                        icon="decline"
                        size={26}
                        className={s.bigDeclineIcon}
                      />
                    </>
                  )}
                </div>
                <div className={s.voteResultWrapper}>
                  <Tooltip
                    containerClassName={s.membersTooltip}
                    position="bottom"
                    triggerElem={
                      <>
                        <SvgIcon
                          icon="accept"
                          size={18}
                          className={s.smallAcceptIcon}
                        />
                        {numberReduction(proposal.voteYes)}
                      </>
                    }
                  >
                    {acceptUsers.length === 0 && (
                      <p className={s.tooltipNothing}>No votes yet.</p>
                    )}
                    {acceptUsers.slice(-5).map((item) => (
                      <p key={item} className={s.tooltipMember}>
                        {item}
                      </p>
                    ))}
                  </Tooltip>
                  <div className={s.border} />
                  <Tooltip
                    containerClassName={s.membersTooltip}
                    position="bottom"
                    triggerElem={
                      <>
                        <SvgIcon
                          icon="decline"
                          size={18}
                          className={s.smallDeclineIcon}
                        />
                        {numberReduction(proposal.voteNo)}
                      </>
                    }
                  >
                    {rejectUsers.length === 0 && (
                      <p className={s.tooltipNothing}>No votes yet.</p>
                    )}
                    {rejectUsers.slice(-5).map((item) => (
                      <p key={item} className={s.tooltipMember}>
                        {item}
                      </p>
                    ))}
                  </Tooltip>
                </div>

                <div className={s.mobileResults}>
                  <div className={s.voteAmount}>
                    <span className={s.green}>{proposal.voteYes}</span>
                    &nbsp;approvals
                  </div>
                  <div className={s.voteAmount}>
                    <span className={s.red}>{proposal.voteNo}</span>
                    &nbsp;rejections
                  </div>
                </div>
              </div>
            )}

            {/* )} */}
          </header>
          <div className={cn(s.row, s.topRow)}>
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
                    <SvgIcon icon="token" size={12} className={s.tokenIcon} />
                  </div>
                  <p className={s.dataValue}>{proposal.kind.amount}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={s.contentWrapper}>
          <div className={s.detailsWrapper}>
            <p className={s.subTitle}>About</p>
            <p className={s.description}>
              {description}
              <br />
              {linkEl}
            </p>
            {renderPurposeIfAvailable()}
            {proposal.kind.type === ProposalType.ChangeVotePeriod && (
              <>
                <p className={s.subTitle}>New vote period</p>
                <p className={s.description}>{newVotePeriod} hours</p>
              </>
            )}
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
