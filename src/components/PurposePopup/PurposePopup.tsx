import React from 'react';
import cn from 'classnames';

import { IconButton } from 'components/UILib';
import s from './PurposePopup.module.scss';

export interface PurposePopupProps {
  className?: string;
  name: string;
  purpose: string;
  onClose?: () => void;
}

const PurposePopup: React.FC<PurposePopupProps> = ({
  className,
  name,
  purpose,
  onClose,
}) => (
  <div className={cn(s.root, className)}>
    <div
      aria-label="overlay"
      role="button"
      tabIndex={0}
      className={s.overlay}
      onKeyPress={onClose}
      onClick={onClose}
    />
    <div className={s.wrapper}>
      <IconButton
        icon="close"
        size="lg"
        variant="outline"
        className={s.close}
        onClick={onClose}
      />
      <p className={s.daoName}>{name}</p>
      <p className={s.title}>Purpose</p>
      <div className={s.border} />
      <div className={s.purposeWrapper}>
        <p className={s.purpose}>{purpose}</p>
      </div>
    </div>
  </div>
);

export default PurposePopup;
