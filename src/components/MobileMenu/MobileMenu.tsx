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
  onClose: () => void;
  toggleTheme: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  onClose,
  toggleTheme,
  className,
  theme,
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
          <Button
            className={cn(s.control, s.authBtn)}
            size="sm"
            variant="outline"
          >
            Sign In
          </Button>
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
      </section>
      <Footer className={s.footer} />
    </div>
  );
};

export default MobileMenu;
