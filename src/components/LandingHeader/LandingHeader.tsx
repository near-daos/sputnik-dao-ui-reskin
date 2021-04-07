import React, { useState } from 'react';
import cn from 'classnames';

import { ReactComponent as MothershipLogo } from 'images/mothership-logo-small.svg';
import { LandingMobileMenu } from 'components/LandingMobileMenu';
import { Link, useHistory } from 'react-router-dom';
import { Button, IconButton } from '../UILib';

import s from './LandingHeader.module.scss';

interface LandingHeaderProps {
  className?: string;
}

const LandingHeader: React.FC<LandingHeaderProps> = ({ className }) => {
  const [isMenuOpen, setOpenMenu] = useState(false);
  const history = useHistory();

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
          <Link className={s.menuLink} to="/">
            Home
          </Link>
          <Link className={s.menuLink} to="/">
            How it works
          </Link>
          <Link className={s.menuLink} to="/">
            Developers
          </Link>
          <Link className={s.menuLink} to="/">
            Community
          </Link>
          <Link className={s.menuLink} to="/select-dao?create-dao-popup=true">
            Create DAO
          </Link>
        </nav>
        <Button
          onClick={() => {
            history.push('/select-dao');
          }}
        >
          Connect to Mothership
        </Button>
      </header>
      {isMenuOpen && <LandingMobileMenu onClose={toggleMenu} />}
    </>
  );
};

export default LandingHeader;
