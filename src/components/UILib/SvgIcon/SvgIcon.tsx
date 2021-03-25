import React from 'react';

import icons from 'icons';

export type SvgIconProps = {
  className?: string;
  size?: number;
  color?: string;
  icon: keyof typeof icons;
};

const SvgIcon: React.FC<SvgIconProps> = ({
  className,
  size = 24,
  color,
  icon,
}: SvgIconProps) => (
  <svg className={className} width={size} height={size} style={{ color }}>
    <use xlinkHref={`${process.env.PUBLIC_URL}/sprite-icons.svg#${icon}`} />
  </svg>
);

export default SvgIcon;
