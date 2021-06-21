/* eslint-disable no-bitwise */
import React from 'react';
import cn from 'classnames';
import { useHistory } from 'react-router-dom';

import {
  Button,
  SvgIcon,
  PixelCorner,
  PixelCornerColors,
} from 'components/UILib';

import { Proposal, ProposalStatus, ProposalType } from 'types/proposal';

import useMedia from 'hooks/use-media';
import numberReduction from 'utils/numberReduction';

import { useSelector } from 'react-redux';
import { accountSelector } from 'redux/selectors';
import {
  checkIfAccountVoted,
  convertDuration,
  getDescriptionAndLink,
} from 'utils';
import { getTitle } from './utils';
import { Countdown } from '../Countdown';

import s from './ProposalCard.module.scss';

export interface ProposalCardProps {
  className?: string;
  daoName?: string;
  proposal: Proposal;
  isMember?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  onFinalize?: () => void;
}

const ProposalCard: React.FC<ProposalCardProps> = ({
  className,
  daoName,
  proposal,
  isMember = false,
  onApprove,
  onReject,
  onFinalize,
}) => {
  const media = useMedia();
  const history = useHistory();
  const accountId = useSelector(accountSelector);

  const votePeriodEnd = convertDuration(proposal.votePeriodEnd);
  const isExpired =
    votePeriodEnd < new Date() && proposal.status === ProposalStatus.Vote;

  const [description, linkEl] = getDescriptionAndLink(
    proposal.description,
    s.proposalLink,
  );
  const [isVoted, vote] = checkIfAccountVoted(proposal, accountId);

  const cornerColorsMap = {
    [ProposalStatus.Success]: PixelCornerColors.Green,
    [ProposalStatus.Reject]: PixelCornerColors.Red,
    [ProposalStatus.Vote]: PixelCornerColors.Yellow,
    [ProposalStatus.Delay]: PixelCornerColors.Yellow,
    [ProposalStatus.Fail]: PixelCornerColors.Pink,
  };

  function onCardClick() {
    history.push(`/dao/${proposal.daoId}/proposals/${proposal.id}`);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onCardClick}
      onKeyPress={onCardClick}
      className={cn(s.root, className)}
    >
      <div className={s.wrapper}>
        <PixelCorner
          color={
            cornerColorsMap[isExpired ? ProposalStatus.Reject : proposal.status]
          }
          className={s.corner}
        />
        <div className={s.header}>
          <div>
            <p
              className={cn(s.statusText, {
                [s.approved]: proposal.status === ProposalStatus.Success,
                [s.rejected]: proposal.status === ProposalStatus.Reject,
                [s.inProgress]:
                  !isExpired && proposal.status === ProposalStatus.Vote,
                [s.delayed]: proposal.status === ProposalStatus.Delay,
                [s.fail]: proposal.status === ProposalStatus.Fail,
                [s.rejected]: isExpired,
              })}
            >
              {isExpired ? 'Expired' : proposal.status}
            </p>
            <Countdown
              date={votePeriodEnd}
              hidden={proposal.status !== ProposalStatus.Vote}
            />
          </div>
          <p className={s.name}>
            Proposal ID: <span className={s.value}>{proposal.id}</span>
          </p>
        </div>
        {daoName && <p className={s.daoName}>{daoName}</p>}
        <p className={s.title}>{getTitle(proposal)}</p>
        <p className={cn(s.name, s.target)}>
          Target: <span className={s.value}>{proposal.target}</span>
        </p>
        <div className={s.aboutWrapper}>
          <p className={s.name}>About</p>
          <p className={s.aboutText}>{description}</p>
          {linkEl}
        </div>
        <div className={s.footer}>
          {proposal.kind.type === ProposalType.Payout && (
            <div className={s.payoutWrapper}>
              <div className={s.payoutName}>
                <p className={cn(s.name, s.payoutTitle)}>Payout</p>{' '}
                <SvgIcon icon="token" size={12} className={s.tokenIcon} />
              </div>
              <p className={s.payoutValue}>{proposal.kind.amount}</p>
            </div>
          )}
          {/* {proposal.kind.type === ProposalType.ChangePurpose && ( */}
          <div className={s.proposerWrapper}>
            <p className={s.name}>Purpose:</p>
            <p className={s.value}>
              {proposal.kind.type === ProposalType.ChangePurpose
                ? proposal.kind.purpose
                : proposal.proposer}
            </p>
          </div>
          {/* )} */}
        </div>
      </div>

      {!isVoted && (
        <div className={s.buttonWrapper}>
          <Button
            size={media.mobile ? 'xs' : 'sm'}
            variant="outline"
            className={s.button}
            onClick={onApprove}
            disabled={
              isExpired || proposal.status !== ProposalStatus.Vote || !isMember
            }
          >
            <>
              Approve{' '}
              <span className={s.buttonTextCount}>
                ({numberReduction(proposal.voteYes)})
              </span>
            </>
          </Button>
          {proposal.proposer === accountId && isExpired && (
            <Button
              size={media.mobile ? 'xs' : 'sm'}
              variant="outline"
              className={s.button}
              onClick={onFinalize}
            >
              Finalise
            </Button>
          )}

          <Button
            size={media.mobile ? 'xs' : 'sm'}
            variant="outline"
            className={s.button}
            disabled={
              isExpired || proposal.status !== ProposalStatus.Vote || !isMember
            }
            onClick={onReject}
          >
            <>
              Reject{' '}
              <span className={s.buttonTextCount}>
                ({numberReduction(proposal.voteNo)})
              </span>
            </>
          </Button>
        </div>
      )}
      {isVoted && (
        <div className={s.voteDetailsWrapper}>
          <div className={s.voteStatusWrapper}>
            {vote ? (
              <>
                <p className={cn(s.voteStatus, s.showDesktop)}>
                  You have approved this proposal
                </p>
                <p className={cn(s.voteStatus, s.hideDesktop)}>You approved</p>
                <SvgIcon icon="accept" size={26} className={s.bigAcceptIcon} />
              </>
            ) : (
              <>
                <p className={cn(s.voteStatus, s.showDesktop)}>
                  You have rejected this proposal
                </p>
                <p className={cn(s.voteStatus, s.hideDesktop)}>You rejected</p>
                <SvgIcon
                  icon="decline"
                  size={26}
                  className={s.bigDeclineIcon}
                />
              </>
            )}
          </div>
          <SvgIcon icon="accept" size={18} className={s.smallAcceptIcon} />
          {numberReduction(proposal.voteYes)}
          <div className={s.border} />
          <SvgIcon icon="decline" size={18} className={s.smallDeclineIcon} />
          {numberReduction(proposal.voteNo)}
        </div>
      )}
    </div>
  );
};

export default ProposalCard;
