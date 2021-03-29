import React, { useState } from 'react';
import cn from 'classnames';

import { ReactComponent as MothershipLogo } from 'images/mothership-logo-small.svg';
import { LandingMobileMenu } from 'components/LandingMobileMenu';
import { Button, IconButton } from '../UILib';

import s from './LandingHeader.module.scss';

interface LandingHeaderProps {
  className?: string;
}

const LandingHeader: React.FC<LandingHeaderProps> = ({ className }) => {
  const [isMenuOpen, setOpenMenu] = useState(false);

  const toggleMenu = () => {
    setOpenMenu(!isMenuOpen);
  };

  return (
    <>
      <header className={cn(s.root, className)}>
        <IconButton
          className={s.mobileMenuButton}
          onClick={toggleMenu}
          icon="menu"
          variant="clear"
        />
        <a href="/" className={s.logo}>
          <MothershipLogo className={s.logoIcon} />
          <span className={s.logoText}>Mothership</span>
        </a>
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
        <Button>Connect to Mothership</Button>
      </header>
      {isMenuOpen && <LandingMobileMenu onClose={toggleMenu} />}
    </>
  );
};

export default LandingHeader;
