import React from 'react';
import cn from 'classnames';

import { Button, IconButton } from 'components/UILib';
import { ReactComponent as MothershipLogo } from 'images/mothership-logo-small.svg';
import { LandingFooter } from 'components/LandingFooter';

import s from './LandingMobileMenu.module.scss';

export interface LandingMobileMenuProps {
  className?: string;
  onClose: () => void;
}

const LandingMobileMenu: React.FC<LandingMobileMenuProps> = ({
  className,
  onClose,
}) => (
  <div className={cn(s.root, className)}>
    <header className={s.header}>
      <IconButton
        className={s.closeButton}
        onClick={onClose}
        icon="close"
        variant="clear"
      />
      <a href="/" className={s.logo}>
        <MothershipLogo className={s.logoIcon} />
        <span className={s.logoText}>Mothership</span>
      </a>
    </header>
    <section className={s.content}>
      <nav className={s.menu}>
        <a className={s.menuLink} href="/">
          Home
        </a>
        <a className={s.menuLink} href="/">
          How it works
        </a>
        <a className={s.menuLink} href="/">
          Developers
        </a>
        <a className={s.menuLink} href="/">
          Community
        </a>
      </nav>
      <Button className={s.connectButton} size="sm">
        Connect to Mothership
      </Button>
    </section>
    <LandingFooter />
  </div>
);

export default LandingMobileMenu;
