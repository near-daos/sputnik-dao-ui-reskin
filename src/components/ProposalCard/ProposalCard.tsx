import React from 'react';
import cn from 'classnames';

import numberReduction from 'utils/numberReduction';
import { Proposal, ProposalStatus } from 'types/proposal';
import { Button, SvgIcon } from 'components/UILib';
import s from './ProposalCard.module.scss';

export interface ProposalCardProps {
  className?: string;
  proposal: Proposal;
}

const ProposalCard: React.FC<ProposalCardProps> = ({ className, proposal }) => (
  <div className={cn(s.root, className)}>
    <div className={s.header}>
      <p
        className={cn(s.statusText, {
          [s.approved]: proposal.status === ProposalStatus.Approved,
          [s.rejected]: proposal.status === ProposalStatus.Rejected,
          [s.inProgress]: proposal.status === ProposalStatus.InProgress,
          [s.delayed]: proposal.status === ProposalStatus.Delayed,
        })}
      >
        {proposal.status}
      </p>
      <p className={s.name}>
        Proposal ID: <span className={s.value}>{proposal.id}</span>
      </p>
    </div>
    {proposal.daoName && <p className={s.daoName}>{proposal.daoName}</p>}
    <p className={s.title}>{proposal.name}</p>
    <p className={cn(s.name, s.target)}>
      Target: <span className={s.value}>{proposal.name}</span>
    </p>
    <div className={s.aboutWrapper}>
      <p className={s.name}>About</p>
      <p className={s.aboutText}>{proposal.about}</p>
    </div>
    <div className={s.footer}>
      <div className={s.payoutWrapper}>
        <div className={s.payoutName}>
          <p className={cn(s.name, s.payoutTitle)}>Payout</p>{' '}
          <SvgIcon icon="token" size={10} className={s.tokenIcon} />
        </div>
        <p className={s.payoutValue}>{proposal.payout}</p>
      </div>
      <div className={s.proposerWrapper}>
        <p className={s.name}>Proposer:</p>
        <p className={s.value}>{proposal.proposer}</p>
      </div>
    </div>
    <div className={s.buttonWrapper}>
      <Button size="md" variant="outline" className={s.button}>
        <>
          Approve{' '}
          <span className={s.buttonTextCunt}>
            ({numberReduction(proposal.approveCount)})
          </span>
        </>
      </Button>
      <Button size="md" variant="outline" className={s.button}>
        <>
          Reject{' '}
          <span className={s.buttonTextCunt}>
            ({numberReduction(proposal.rejectCunt)})
          </span>
        </>
      </Button>
    </div>
  </div>
);

export default ProposalCard;
