import React from 'react';
import cn from 'classnames';

import s from './ProposalTypeItem.module.scss';

export interface ProposalTypeItemProps {
  className?: string;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const ProposalTypeItem: React.FC<ProposalTypeItemProps> = ({
  className,
  label,
  active = false,
  onClick,
}) => (
  <li className={cn(s.root, className, { [s.active]: active })}>
    <button className={s.btn} onClick={onClick}>
      <div className={s.corner} />
      <span className={s.label}>{label}</span>
    </button>
  </li>
);

export default ProposalTypeItem;
