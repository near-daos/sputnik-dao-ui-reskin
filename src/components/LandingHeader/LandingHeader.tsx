import React, { useState } from 'react';
import cn from 'classnames';

import { ReactComponent as MothershipLogo } from 'images/mothership-logo-small.svg';
import { LandingMobileMenu } from 'components/LandingMobileMenu';
import { useHistory } from 'react-router-dom';
import { Button, IconButton } from '../UILib';

import s from './LandingHeader.module.scss';

interface LandingHeaderProps {
  className?: string;
  activeMenuItem: number;
  goToSlide: (index: number) => void;
  menuLinks: string[];
}

const LandingHeader: React.FC<LandingHeaderProps> = ({
  className,
  activeMenuItem,
  goToSlide,
  menuLinks,
}) => {
  const [isMenuOpen, setOpenMenu] = useState(false);
  const history = useHistory();

  const toggleMenu = () => {
    setOpenMenu(!isMenuOpen);
  };

  const handleMenuLink = (index: number) => {
    setOpenMenu(false);
    goToSlide(index);
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
        <button className={s.logo} onClick={() => goToSlide(0)}>
          <MothershipLogo className={s.logoIcon} />
          <span className={s.logoText}>Mothership</span>
        </button>
        <nav className={s.menu}>
          {menuLinks.map((name, index) => (
            <button
              key={name}
              className={cn(s.menuLink, {
                [s.menuLinkActive]: index === activeMenuItem,
              })}
              onClick={() => goToSlide(index)}
            >
              <span>{name}</span>
            </button>
          ))}
        </nav>
        <Button
          onClick={() => {
            history.push('/select-dao');
          }}
        >
          Connect to Mothership
        </Button>
      </header>
      {isMenuOpen && (
        <LandingMobileMenu
          onClose={toggleMenu}
          activeMenuItem={activeMenuItem}
          handleMenuLink={handleMenuLink}
          menuLinks={menuLinks}
        />
      )}
    </>
  );
};

export default LandingHeader;
