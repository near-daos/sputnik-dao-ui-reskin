import React from 'react';
import cn from 'classnames';

import SvgIcon, { SvgIconProps } from 'components/SvgIcon/SvgIcon';
import styles from './IconButton.module.scss';

export interface IconButtonProps extends SvgIconProps {
  iconClassName?: string;
  onClick?: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({
  className,
  iconClassName,
  onClick,
  ...props
}: IconButtonProps) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      type="button"
      className={cn(styles.btn, className)}
      onClick={handleClick}
    >
      <SvgIcon className={iconClassName} {...props} />
    </button>
  );
};

export default IconButton;
