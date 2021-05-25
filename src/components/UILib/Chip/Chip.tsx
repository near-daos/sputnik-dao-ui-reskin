import React from 'react';
import cn from 'classnames';

import s from './Chip.module.scss';
import { SvgIcon } from '../SvgIcon';

export interface ChipProps {
  className?: string;
  label: string;
  color?: 'default' | 'failed' | 'success' | 'error' | 'inProgress';
  size?: 'sm' | 'lg';
  active?: boolean;
  onClick?: () => void;
  amount?: React.ReactText;
}

const Chip: React.FC<ChipProps> = ({
  className,
  label,
  color = 'default',
  size = 'lg',
  active = false,
  onClick,
  amount,
}) => {
  const iconSize = {
    sm: 12,
    lg: 16,
  };

  const amountLabel = (amount || amount === 0) && (
    <>
      &nbsp;
      <span className={s.amount}>({amount})</span>
    </>
  );

  return (
    <button
      className={cn(s.root, s[color], className, {
        [s.active]: active,
      })}
      onClick={onClick}
    >
      <SvgIcon icon="chip-rect" size={iconSize[size]} className={cn(s.icon)} />
      <p className={cn(s.label, s[size])}>
        {label}
        {amountLabel}
      </p>
    </button>
  );
};

export default Chip;
