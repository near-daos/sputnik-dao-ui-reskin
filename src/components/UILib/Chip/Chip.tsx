import React from 'react';
import cn from 'classnames';

import s from './Chip.module.scss';
import { SvgIcon } from '../SvgIcon';

export interface ChipProps {
  className?: string;
  label: string;
  color?: 'default' | 'warning' | 'success' | 'error' | 'inProgress';
  size?: 'sm' | 'lg';
  active?: boolean;
  onClick?: () => void;
}

const Chip: React.FC<ChipProps> = ({
  className,
  label,
  color = 'default',
  size = 'lg',
  active = false,
  onClick,
}) => {
  const iconSize = {
    sm: 12,
    lg: 16,
  };

  return (
    <button
      className={cn(s.root, s[color], className, {
        [s.active]: active,
      })}
      onClick={onClick}
    >
      <SvgIcon icon="chip-rect" size={iconSize[size]} className={cn(s.icon)} />
      <p className={cn(s.label, s[size])}>{label}</p>
    </button>
  );
};

export default Chip;
