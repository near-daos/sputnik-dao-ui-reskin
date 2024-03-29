import React, { useState } from 'react';
import cn from 'classnames';

import { Dropdown, SvgIcon, Tooltip } from '../UILib';

import s from './ProfileButton.module.scss';

export interface ProfileButtonProps {
  className?: string;
  accountName: string;
  onSingOut: () => void;
}

const ProfileButton: React.FC<ProfileButtonProps> = ({
  className,
  accountName,
  onSingOut,
}) => {
  const [open, setIsOpen] = useState(false);
  const [tooltipText, setTooltipText] = useState('Click to copy username');

  const handleClickOnAccountName = () => {
    navigator.clipboard.writeText(accountName);
    setTooltipText('Username copied');
    setTimeout(() => {
      setTooltipText('Click to copy username');
    }, 1000);
  };

  const handleSignOut = () => {
    setIsOpen(false);
    onSingOut();
  };

  return (
    <div className={cn(s.root, className)}>
      <Dropdown
        headerElement={
          <div
            className={cn(s.button, {
              [s.active]: open,
            })}
          >
            <div className={s.icon} />
          </div>
        }
        isOpen={open}
        closeable={false}
        onOpen={() => {
          setIsOpen(true);
        }}
        onClose={() => {
          setIsOpen(false);
        }}
        dropdownClassName={s.ddWrapper}
      >
        <div />
        <p className={s.title}>Signed in as</p>
        <Tooltip
          className={s.accountTooltip}
          triggerElem={
            <button className={s.account} onClick={handleClickOnAccountName}>
              {accountName}
              <SvgIcon icon="copy-icon" className={s.copyIcon} />
            </button>
          }
        >
          <p className={s.tooltipText}>{tooltipText}</p>
        </Tooltip>
        <div className={s.border} />
        <button className={s.signOut} onClick={handleSignOut}>
          Sign out
        </button>
      </Dropdown>
    </div>
  );
};

export default ProfileButton;
