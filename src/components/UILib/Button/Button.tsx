import React, { EventHandler, ReactChild } from 'react';
import cn from 'classnames';

import s from './Button.module.scss';

/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/button-has-type */

export interface ButtonProps {
  children: ReactChild;
  variant?: 'regular' | 'outline' | 'monochrome' | 'clear';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'primary' | 'danger';
  className?: string;
  onClick?: EventHandler<React.MouseEvent<HTMLButtonElement>>;
  leftElement?: ReactChild;
  rightElement?: ReactChild;
  type?: 'submit' | 'reset' | 'button';
  active?: boolean;
  disabled?: boolean;
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
  type = 'button',
  active,
  disabled = false,
  ...other
}) => {
  const styleAttrs: DataAttrs = {
    'data-color': color,
    'data-variant': variant,
    'data-size': size,
  };

  if (active) {
    styleAttrs['data-active'] = '';
  }

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
      type={type}
      disabled={disabled}
      {...styleAttrs}
      {...other}
    >
      {leftElement && (
        <>
          <div className={s.leftElement}>{leftElement}</div>
          &nbsp;
        </>
      )}
      <div className={s.content}>{children}</div>
      {rightElement && (
        <>
          &nbsp;
          <div className={s.rightElement}>{rightElement}</div>
        </>
      )}
    </button>
  );
};

export default Button;
