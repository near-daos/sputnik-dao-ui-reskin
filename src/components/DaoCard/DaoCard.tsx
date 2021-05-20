/* eslint-disable no-param-reassign */
import React from 'react';
import cn from 'classnames';

import { DaoItem } from 'types/dao';
import {
  Button,
  PixelCorner,
  PixelCornerColors,
  SvgIcon,
} from 'components/UILib';
import { useHistory } from 'react-router-dom';
import { appConfig, nearConfig } from 'config';
import s from './DaoCard.module.scss';

export interface DaoCardProps {
  className?: string;
  dao: DaoItem;
  size?: 'sm' | 'md' | 'lg';
  disableCornerAnimation?: boolean;
}

const DaoCard: React.FC<DaoCardProps> = ({
  className,
  dao,
  size = 'lg',
  disableCornerAnimation = false,
}) => {
  const history = useHistory();

  const handleSelect = () => {
    history.push(`/dao/${dao.id}`);
  };

  return (
    <div className={cn(s.root, className, s[size])}>
      <PixelCorner
        color={PixelCornerColors.Grey}
        className={s.corner}
        animated={!disableCornerAnimation}
      />
      <div className={cn(s.imageWrapper, s[size])}>
        <img
          src={`${appConfig.logoPath}${dao?.id}.png`}
          className={s.image}
          alt="dao-logo"
        />
      </div>
      <div className={s.content}>
        <p className={cn(s.title, s[size])}>
          {dao?.id.replace(`.${nearConfig.contractName}`, '')}
          <br />
          <span className={s.contractName}>.{nearConfig.contractName}</span>
        </p>
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
              <SvgIcon icon="token" size={12} className={s.tokenIcon} />
            </div>
            <p className={s.value}>{dao.bond}</p>
          </div>
          <div className={cn(s.container, s.amountOfMember, s[size])}>
            <p className={s.label}>Council size</p>
            <p className={s.value}>{dao.numberOfMembers}</p>
          </div>
          <div className={cn(s.container, s.funds, s[size])}>
            <div className={s.nameWrapper}>
              <p className={s.label}>DAO Funds</p>
              <SvgIcon icon="token" size={12} className={s.tokenIcon} />
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
