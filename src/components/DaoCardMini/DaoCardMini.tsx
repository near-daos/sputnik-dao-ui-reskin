/* eslint-disable no-param-reassign */
import React from 'react';
import cn from 'classnames';

import { DaoItem } from 'types/dao';
import imgPlaceholder from 'images/placeholder.png';

import s from './DaoCardMini.module.scss';

export interface DaoCardMiniProps {
  className?: string;
  dao: DaoItem;
  active?: boolean;
}

const DaoCardMini: React.FC<DaoCardMiniProps> = ({
  className,
  dao,
  active = false,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleError = (event: any) => {
    event.target.onerror = null;
    event.target.src = imgPlaceholder;
    event.target.style = 'background-image: none';
  };

  return (
    <div
      className={cn(s.root, className, {
        [s.active]: active,
      })}
    >
      <div className={s.imageWrapper}>
        <img
          src={`https://sputnik-dao.s3.eu-central-1.amazonaws.com/${dao?.id}.png`}
          onError={handleError}
          alt="dao-logo"
          className={s.image}
        />
      </div>
      <div className={s.overlay} />
      <p className={s.name}>{dao.id}</p>
    </div>
  );
};

export default DaoCardMini;
