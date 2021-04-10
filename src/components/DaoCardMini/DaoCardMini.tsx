import React from 'react';
import cn from 'classnames';

import { DaoItem } from 'types/dao';
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
}) => (
  <div
    className={cn(s.root, className, {
      [s.active]: active,
    })}
  >
    <div className={s.imageWrapper}>
      <img src="{dao.image}" alt="dao-logo" className={s.image} />
    </div>
    <div className={s.overlay} />
    <p className={s.name}>{dao.id}</p>
  </div>
);

export default DaoCardMini;
