import React, { useState } from 'react';
import cn from 'classnames';

import { LandingMobileMenu } from 'components/LandingMobileMenu';
import { useHistory } from 'react-router-dom';
import { Button, IconButton } from 'components/UILib';

import { ReactComponent as NearLogo } from 'images/near-logo.svg';
import { ReactComponent as NearLogoSmall } from 'images/near-logo-small.svg';

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
        <a href="https://near.org/">
          <NearLogo className={s.logo} />
          <NearLogoSmall className={s.logoSmall} />
        </a>
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
          Launch SputnikDAO
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
