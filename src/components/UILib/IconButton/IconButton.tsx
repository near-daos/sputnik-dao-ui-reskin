import React from 'react';
import cn from 'classnames';

import icons from 'icons';
import SvgIcon from '../SvgIcon/SvgIcon';
import Button, { ButtonProps } from '../Button/Button';

import s from './IconButton.module.scss';

export interface IconButtonProps
  extends Omit<ButtonProps, 'children' | 'leftElement' | 'rightElement'> {
  iconClassName?: string;
  iconName: keyof typeof icons;
}

const IconButton: React.FC<IconButtonProps> = ({
  iconClassName,
  iconName,
  className,
  ...props
}: IconButtonProps) => (
  <Button className={cn(s.button, className)} {...props}>
    <SvgIcon className={cn(s.icon, iconClassName)} icon={iconName} />
  </Button>
);

export default IconButton;
