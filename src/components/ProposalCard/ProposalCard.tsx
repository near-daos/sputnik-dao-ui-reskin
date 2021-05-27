/* eslint-disable no-bitwise */
import React from 'react';
import cn from 'classnames';

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
import { convertDuration } from 'utils';
import { Link } from 'react-router-dom';
import s from './ProposalCard.module.scss';
import { getTitle } from './utils';

export function getDescriptionAndLink(
  proposalDescription: string,
): [string, JSX.Element | boolean] {
  let linkEl: JSX.Element | boolean = false;
  let description = '';
  let link = '';

  const test = proposalDescription.split('---');

  if (test.length > 1 && test[test.length - 1] !== '') {
    [description, link] = proposalDescription.split('---');
    linkEl = !!link && (
      <a
        target="_blank"
        className={s.proposalLink}
        href={`${link}`}
        rel="nofollow noreferrer"
      >
        {`${link}`}
      </a>
    );
  } else {
    [description, link] = proposalDescription.split('/t/');
    linkEl = !!link && (
      <a
        className={s.proposalLink}
        target="_blank"
        href={`https://gov.near.org/t/${link}`}
        rel="nofollow noreferrer"
      >
        {`https://gov.near.org/t/${link}`}
      </a>
    );
  }

  return [description, linkEl];
}

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
  const accountId = useSelector(accountSelector);

  const votePeriodEnd = convertDuration(proposal.votePeriodEnd);
  const isNotExpired = votePeriodEnd < new Date();

  const [description, linkEl] = getDescriptionAndLink(proposal.description);

  // const [description, link] = proposal.description.split('/t/');
  // const linkEl = !!link && (
  //   <a
  //     target="_blank"
  //     href={`https://gov.near.org/t/${link}`}
  //     rel="nofollow noreferrer"
  //   >
  //     {`https://gov.near.org/t/${link}`}
  //   </a>
  // );

  const cornerColorsMap = {
    [ProposalStatus.Success]: PixelCornerColors.Green,
    [ProposalStatus.Reject]: PixelCornerColors.Red,
    [ProposalStatus.Vote]: PixelCornerColors.Yellow,
    [ProposalStatus.Delay]: PixelCornerColors.Yellow,
    [ProposalStatus.Fail]: PixelCornerColors.Pink,
  };

  return (
    <div className={cn(s.root, className)}>
      <Link
        className={s.link}
        to={`/dao/${proposal.daoId}/proposals/${proposal.id}`}
      />
      <div className={s.wrapper}>
        <PixelCorner
          color={cornerColorsMap[proposal.status]}
          className={s.corner}
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

      <div className={s.buttonWrapper}>
        <Button
          size={media.mobile ? 'xs' : 'sm'}
          variant="outline"
          className={s.button}
          onClick={onApprove}
          disabled={
            isNotExpired || proposal.status !== ProposalStatus.Vote || !isMember
          }
        >
          <>
            Approve{' '}
            <span className={s.buttonTextCount}>
              ({numberReduction(proposal.voteYes)})
            </span>
          </>
        </Button>
        {proposal.proposer === accountId &&
          votePeriodEnd < new Date() &&
          proposal.status === ProposalStatus.Vote && (
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
            isNotExpired || proposal.status !== ProposalStatus.Vote || !isMember
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
    </div>
  );
};

export default ProposalCard;
