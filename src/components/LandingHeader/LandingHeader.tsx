import React, { useState } from 'react';
import cn from 'classnames';

import { LandingMobileMenu } from 'components/LandingMobileMenu';
import { useHistory } from 'react-router-dom';
import { Button, IconButton } from 'components/UILib';

import { ReactComponent as NearLogo } from 'images/sputnik_horiz_dark.svg';

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
        <div className={s.iconsWrapper}>
          <IconButton
            className={s.mobileMenuButton}
            onClick={toggleMenu}
            icon="menu"
            variant="clear"
          />
          <a href="/">
            <NearLogo className={s.logo} />
          </a>
        </div>
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
          Launch App
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
