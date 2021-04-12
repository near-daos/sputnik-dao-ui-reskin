/* eslint-disable no-bitwise */
import React from 'react';
import cn from 'classnames';

import { Button, SvgIcon } from 'components/UILib';

import { Proposal, ProposalStatus, ProposalType } from 'types/proposal';

import useMedia from 'hooks/use-media';
import numberReduction from 'utils/numberReduction';

import { useSelector } from 'react-redux';
import { accountSelector } from 'redux/selectors';
import { convertDuration } from 'utils';
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

const getTitle = (proposal: Proposal): string => {
  switch (proposal.kind.type) {
    case ProposalType.ChangePurpose:
      return `Change DAO Purpose`;
    case ProposalType.NewCouncil:
      return `New Council Member`;
    case ProposalType.RemoveCouncil:
      return `Remove Council Member`;
    case ProposalType.ChangeVotePeriod:
      return `Change Vote Period`;
    case ProposalType.Payout:
      return 'Payout';
    default:
      return '';
  }
};

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
  const accountId = useSelector(accountSelector);

  const votePeriodEnd = convertDuration(proposal.votePeriodEnd);
  const isNotExpired = votePeriodEnd < new Date();

  return (
    <div className={cn(s.root, className)}>
      <div className={s.wrapper}>
        <div
          className={cn(s.corner, {
            [s.approved]: proposal.status === ProposalStatus.Success,
            [s.rejected]: proposal.status === ProposalStatus.Reject,
            [s.inProgress]: proposal.status === ProposalStatus.Vote,
            [s.delayed]: proposal.status === ProposalStatus.Delay,
            [s.fail]: proposal.status === ProposalStatus.Fail,
          })}
        />
        <div className={s.header}>
          <p
            className={cn(s.statusText, {
              [s.approved]: proposal.status === ProposalStatus.Success,
              [s.rejected]: proposal.status === ProposalStatus.Reject,
              [s.inProgress]: proposal.status === ProposalStatus.Vote,
              [s.delayed]: proposal.status === ProposalStatus.Delay,
              [s.fail]: proposal.status === ProposalStatus.Fail,
            })}
          >
            {proposal.status}
          </p>
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
          <p className={s.aboutText}>{proposal.description}</p>
        </div>
        <div className={s.footer}>
          {proposal.kind.type === ProposalType.Payout && (
            <div className={s.payoutWrapper}>
              <div className={s.payoutName}>
                <p className={cn(s.name, s.payoutTitle)}>Payout</p>{' '}
                <SvgIcon icon="token" size={10} className={s.tokenIcon} />
              </div>
              <p className={s.payoutValue}>{proposal.kind.amount}</p>
            </div>
          )}
          {proposal.kind.type === ProposalType.ChangePurpose && (
            <div className={s.proposerWrapper}>
              <p className={s.name}>Proposer:</p>
              <p className={s.value}>{proposal.kind.purpose}</p>
            </div>
          )}
        </div>
      </div>
      <div className={s.buttonWrapper}>
        {isMember && (
          <Button
            size={media.mobile ? 'xs' : 'sm'}
            variant="outline"
            className={s.button}
            onClick={onApprove}
            disabled={isNotExpired || proposal.status !== ProposalStatus.Vote}
          >
            <>
              Approve{' '}
              <span className={s.buttonTextCount}>
                ({numberReduction(proposal.voteYes)})
              </span>
            </>
          </Button>
        )}
        {proposal.proposer === accountId &&
          votePeriodEnd < new Date() &&
          proposal.status === ProposalStatus.Vote && (
            <Button
              size={media.mobile ? 'xs' : 'sm'}
              disabled={isNotExpired || proposal.status !== ProposalStatus.Vote}
              variant="outline"
              className={s.button}
              onClick={onFinalize}
            >
              Finalise
            </Button>
          )}
        {isMember && (
          <Button
            size={media.mobile ? 'xs' : 'sm'}
            variant="outline"
            className={s.button}
            disabled={isNotExpired || proposal.status !== ProposalStatus.Vote}
            onClick={onReject}
          >
            <>
              Reject{' '}
              <span className={s.buttonTextCount}>
                ({numberReduction(proposal.voteNo)})
              </span>
            </>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProposalCard;
