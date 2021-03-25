import React, { EventHandler, ReactChild } from 'react';
import cn from 'classnames';

import s from './Button.module.scss';

/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/button-has-type */

export interface ButtonProps {
  children: ReactChild;
  variant?: 'regular' | 'outline' | 'monochrome';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'primary' | 'danger';
  className?: string;
  onClick?: EventHandler<React.MouseEvent<HTMLButtonElement>>;
  leftElement?: ReactChild;
  rightElement?: ReactChild;
}

interface DataAttrs {
  [attribute: string]: string;
}

const Button: React.FC<ButtonProps> = ({
  color = 'primary',
  className,
  children,
  variant = 'regular',
  size = 'md',
  leftElement,
  rightElement,
  onClick,
  ...other
}) => {
  const styleAttrs: DataAttrs = {
    'data-color': color,
    'data-variant': variant,
    'data-size': size,
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      className={cn(s.root, className)}
      onClick={handleClick}
      {...styleAttrs}
      {...other}
    >
      {leftElement && (
        <>
          <span className={s.leftElement}>{leftElement}</span>
          &nbsp;
        </>
      )}
      <span className={s.content}>{children}</span>
      {rightElement && (
        <>
          &nbsp;
          <span className={s.rightElement}>{rightElement}</span>
        </>
      )}
    </button>
  );
};

export default Button;
