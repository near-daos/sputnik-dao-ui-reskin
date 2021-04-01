import React from 'react';
import cn from 'classnames';

import { SvgIcon } from 'components/UILib/SvgIcon';

import s from './StepProgressBar.module.scss';

export interface StepProgressBarProps {
  className?: string;
  steps: string[];
  current: number;
  size?: 'sm' | 'md' | 'lg';
}

const StepProgressBar: React.FC<StepProgressBarProps> = ({
  className,
  steps,
  current,
  size = 'lg',
}) => {
  const iconSizeMap = {
    sm: 36,
    md: 42,
    lg: 46,
  };

  return (
    <div className={cn(s.root, s[size], className)}>
      {steps.map((item, index) => [
        <div className={cn(s.step, s[size])}>
          <div
            key={item}
            className={cn(s.numberWrapper, s[size], {
              [s.done]: index + 2 <= current,
            })}
          >
            <SvgIcon
              icon="step"
              size={iconSizeMap[size]}
              className={cn(s.icon, {
                [s.active]: index + 1 <= current,
              })}
            />
            <span className={cn(s.numberText, s[size])}>0{index + 1}</span>
          </div>
          <div
            className={cn(s.textWrapper, s[size], {
              [s.active]: index + 1 === current,
            })}
          >
            <p className={cn(s.stepText, s[size])}>{`Step${index + 1}`}</p>
            <p className={cn(s.stepName, s[size])}>{item}</p>
          </div>
        </div>,
        index < steps.length - 1 && (
          <div
            className={cn(s.border, s[size], {
              [s.active]: index + 2 <= current,
            })}
          />
        ),
      ])}
    </div>
  );
};

export default StepProgressBar;
