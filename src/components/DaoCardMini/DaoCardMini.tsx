import React from 'react';
import cn from 'classnames';

import { Link } from 'react-router-dom';
import { Dao } from 'types/dao';
import s from './DaoCardMini.module.scss';

export interface DaoCardMiniProps {
  className?: string;
  dao: Dao;
  active?: boolean;
}

const DaoCardMini: React.FC<DaoCardMiniProps> = ({
  className,
  dao,
  active = true,
}) => (
  <Link
    to="/dao"
    className={cn(s.root, className, {
      [s.active]: active,
    })}
  >
    <div className={s.imageWrapper}>
      <img src={dao.image} alt="dao-logo" className={s.image} />
    </div>
    <div className={s.overlay} />
    <p className={s.name}>{dao.name}</p>
  </Link>
);

export default DaoCardMini;
