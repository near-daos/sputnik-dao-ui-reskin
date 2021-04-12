import React from 'react';
import cn from 'classnames';

import s from './ProgressBar.module.scss';

export interface ProgressBarProps {
  className?: string;
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ className, progress }) => (
  <div className={cn(s.root, className)}>
    <div className={s.progress} style={{ width: `${progress}%` }} />
  </div>
);

export default ProgressBar;
