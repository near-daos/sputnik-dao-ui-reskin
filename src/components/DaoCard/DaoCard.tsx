/* eslint-disable no-param-reassign */
import React from 'react';
import cn from 'classnames';

import { DaoItem } from 'types/dao';
import { Button, SvgIcon } from 'components/UILib';
import { useHistory } from 'react-router-dom';
import imgPlaceholder from 'images/placeholder.png';
import s from './DaoCard.module.scss';

export interface DaoCardProps {
  className?: string;
  dao: DaoItem;
  size?: 'sm' | 'md' | 'lg';
}

const DaoCard: React.FC<DaoCardProps> = ({ className, dao, size = 'lg' }) => {
  const history = useHistory();

  const handleSelect = () => {
    history.push(`/dao/${dao.id}`);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleError = (event: any) => {
    event.target.onerror = null;
    event.target.src = imgPlaceholder;
    event.target.style = 'background-image: none';
  };

  return (
    <div className={cn(s.root, className, s[size])}>
      <div className={s.corner} />
      <div className={cn(s.imageWrapper, s[size])}>
        <img
          src={`https://sputnik-dao.s3.eu-central-1.amazonaws.com/${dao?.id}.png`}
          onError={handleError}
          className={s.image}
          alt="dao-logo"
        />
      </div>
      <div className={s.content}>
        <p className={cn(s.title, s[size])}>{dao.id}</p>
        <p className={s.label}>Purpose</p>
        <p className={s.purpose}>{dao.purpose}</p>
        <div className={s.wrapper}>
          <div className={cn(s.container, s.numberOfProposal, s[size])}>
            <p className={s.label}>Number of proposals</p>
            <p className={s.value}>{dao.numberOfProposals}</p>
          </div>
          <div className={cn(s.container, s.bond, s[size])}>
            <div className={s.nameWrapper}>
              <p className={s.label}>Bond</p>
              <SvgIcon icon="token" size={10} className={s.tokenIcon} />
            </div>
            <p className={s.value}>{dao.bond}</p>
          </div>
          <div className={cn(s.container, s.amountOfMember, s[size])}>
            <p className={s.label}>Amount of members</p>
            <p className={s.value}>{dao.numberOfMembers}</p>
          </div>
          <div className={cn(s.container, s.funds, s[size])}>
            <div className={s.nameWrapper}>
              <p className={s.label}>DAO Funds</p>
              <SvgIcon icon="token" size={10} className={s.tokenIcon} />
            </div>
            <p className={cn(s.value, s[size])}>{dao.amount}</p>
          </div>
        </div>
      </div>
      <Button
        variant="regular"
        className={cn(s.button, s[size])}
        size="sm"
        onClick={handleSelect}
      >
        Select
      </Button>
    </div>
  );
};

export default DaoCard;
