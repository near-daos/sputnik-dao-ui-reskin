import React, { useEffect } from 'react';
import cn from 'classnames';

import { IconButton, Button } from 'components/UILib';
import { SputnikDaoLogo } from 'components/SputnikDaoLogo';
import { Footer } from 'components/Footer';
import ThemeSwitcher from 'components/ThemeSwitcher';
import { Theme } from 'types/theme';

import s from './MobileMenu.module.scss';

export interface MobileMenuProps {
  className?: string;
  theme: Theme;
  accountName: string;
  isAuth: boolean;
  onClose: () => void;
  toggleTheme: () => void;
  onSingOut: () => void;
  onSingIn: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  onClose,
  toggleTheme,
  isAuth,
  accountName,
  className,
  theme,
  onSingOut,
  onSingIn,
}) => {
  useEffect(() => {
    // page scroll lock
    const body = window?.document.body as HTMLBodyElement;

    body.setAttribute('scroll', 'none');
    body.style.overflow = 'hidden';

    return () => {
      body.removeAttribute('scroll');
      body.style.removeProperty('overflow');
    };
  }, []);

  return (
    <div className={cn(s.root, className)}>
      <header className={s.header}>
        <div className={s.headerLeft}>
          <IconButton
            className={s.closeBtn}
            icon="close"
            onClick={onClose}
            variant="clear"
            size="sm"
          />
          <a href="/" className={s.logo}>
            <SputnikDaoLogo className={s.logoIcon} />
          </a>
        </div>
        <div className={s.controls}>
          {!isAuth && (
            <Button
              className={cn(s.control, s.authBtn)}
              size="sm"
              variant="outline"
              onClick={onSingIn}
            >
              Sign In
            </Button>
          )}
          <ThemeSwitcher
            value={theme}
            onChange={toggleTheme}
            className={cn(s.control, s.themeSwitcher)}
          />
        </div>
      </header>
      <section className={s.content}>
        <nav className={s.menuList}>
          <a className={s.menuLink} href="/">
            Discover DAO
          </a>
        </nav>
        {isAuth && (
          <>
            <div className={s.accountWrapper}>
              <div className={s.iconWrapper}>
                <div className={s.icon} />
              </div>
              <div className={s.textWrapper}>
                <p className={s.title}>Signed in as</p>
                <p className={s.accountText}>{accountName}</p>
              </div>
            </div>
            <button className={s.signOut} onClick={onSingOut}>
              Sing Out
            </button>
          </>
        )}
      </section>
      <Footer className={s.footer} />
    </div>
  );
};

export default MobileMenu;
