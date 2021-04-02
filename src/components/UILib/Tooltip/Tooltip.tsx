import React, { ReactNode, useState } from 'react';
import cn from 'classnames';
import s from './Tooltip.module.scss';

export interface TooltipProps {
  className?: string;
  containerClassName?: string;
  children: ReactNode;
  triggerElem: JSX.Element;
  position?: 'left' | 'right' | 'top' | 'bottom';
  showArrow?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
  className,
  containerClassName,
  children,
  position = 'top',
  showArrow = true,
  triggerElem,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className={cn(s.root, className)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {triggerElem}
      {showTooltip && (
        <div
          className={cn(
            s.content,
            s[position],
            {
              [s.showArrow]: showArrow,
            },
            containerClassName,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
