import React from 'react';
import cn from 'classnames';
import { IconButton, Button } from 'components/UILib';
import { SputnikDaoLogo } from 'components/SputnikDaoLogo';
import { Footer } from 'components/Footer';

import s from './MobileMenu.module.scss';

export interface MobileMenuProps {
  className?: string;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ onClose, className }) => (
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

export default MobileMenu;
