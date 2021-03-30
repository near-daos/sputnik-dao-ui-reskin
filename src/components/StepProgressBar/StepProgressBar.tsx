import React from 'react';
import cn from 'classnames';

import { SvgIcon } from 'components/UILib/SvgIcon';

import styles from './StepProgressBar.module.scss';

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
  let stepIconSize = 0;

  if (size === 'lg') {
    stepIconSize = 46;
  } else if (size === 'md') {
    stepIconSize = 42;
  } else if (size === 'sm') {
    stepIconSize = 36;
  }

  return (
    <div className={cn(styles.root, styles[size], className)}>
      {steps.map((item, index) => [
        <div className={cn(styles.step, styles[size])}>
          <div
            key={item}
            className={cn(styles.numberWrapper, styles[size], {
              [styles.done]: index + 2 <= current,
            })}
          >
            <SvgIcon
              icon="step"
              size={stepIconSize}
              className={cn(styles.icon, {
                [styles.active]: index + 1 <= current,
              })}
            />
            <span className={cn(styles.numberText, styles[size])}>
              0{index + 1}
            </span>
          </div>
          <div
            className={cn(styles.textWrapper, styles[size], {
              [styles.active]: index + 1 === current,
            })}
          >
            <p className={cn(styles.stepText, styles[size])}>{`Step${
              index + 1
            }`}</p>
            <p className={cn(styles.stepName, styles[size])}>{item}</p>
          </div>
        </div>,
        index < steps.length - 1 && (
          <div
            className={cn(styles.border, styles[size], {
              [styles.active]: index + 2 <= current,
            })}
          />
        ),
      ])}
    </div>
  );
};

export default StepProgressBar;
