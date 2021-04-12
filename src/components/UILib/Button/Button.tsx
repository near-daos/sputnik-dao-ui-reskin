import React, { EventHandler, ReactChild } from 'react';
import cn from 'classnames';

import s from './Button.module.scss';

/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/button-has-type */

export interface ButtonProps {
  children: ReactChild;
  variant?: 'regular' | 'outline' | 'monochrome' | 'clear';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'custom';
  color?: 'primary' | 'danger';
  className?: string;
  onClick?: EventHandler<React.MouseEvent<HTMLElement>>;
  leftElement?: ReactChild;
  rightElement?: ReactChild;
  type?: 'submit' | 'reset' | 'button';
  active?: boolean;
  disabled?: boolean;
  href?: string;
}

interface DataAttrs {
  [attribute: string]: string | undefined;
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
  href,
  ...other
}) => {
  const styleAttrs: DataAttrs = {
    'data-color': color,
    'data-variant': variant,
    'data-size': size === 'custom' ? undefined : size,
  };

  if (active) {
    styleAttrs['data-active'] = '';
  }

  const handleClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    if (onClick) {
      onClick(e);
    }
  };

  const Element = href ? 'a' : 'button';

  return (
    <Element
      className={cn(s.root, className)}
      onClick={handleClick}
      type={!href ? type : undefined}
      disabled={disabled}
      href={href}
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
    </Element>
  );
};

export default Button;
