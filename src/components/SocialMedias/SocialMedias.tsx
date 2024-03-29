import React from 'react';
import cn from 'classnames';
import icons from 'icons';
import { IconButton, IconButtonProps } from '../UILib';

import s from './SocialMedias.module.scss';

interface SocialLink {
  icon: keyof typeof icons;
  href: string;
}

const socialLinks: SocialLink[] = [
  {
    icon: 'twitter',
    href: 'https://twitter.com/NEARProtocol',
  },
  {
    icon: 'telegram',
    href: 'https://t.me/cryptonear',
  },
  {
    icon: 'discord',
    href: 'https://discord.gg/TWyADPNwkq',
  },
  {
    icon: 'github',
    href: 'https://github.com/near-daos',
  },
  {
    icon: 'wechat',
    href: 'https://near.org/wechat',
  },
];

export interface SocialMediasProps extends Pick<IconButtonProps, 'size'> {
  className?: string;
  iconClassName?: string;
  buttonClassName?: string;
}

const SocialMedias: React.FC<SocialMediasProps> = ({
  className,
  size,
  iconClassName,
  buttonClassName,
}) => (
  <div className={cn(s.root, className)}>
    {socialLinks.map(({ icon, href }) => (
      <IconButton
        key={icon}
        icon={icon}
        href={href}
        className={cn(s.button, buttonClassName)}
        size={size}
        variant="clear"
        iconClassName={iconClassName}
      />
    ))}
  </div>
);

export default SocialMedias;
