import React from 'react';
import cn from 'classnames';

import { Button, IconButton } from 'components/UILib';
import { ReactComponent as MothershipLogo } from 'images/mothership-logo-small.svg';
import { LandingFooter } from 'components/LandingFooter';

import s from './LandingMobileMenu.module.scss';

export interface LandingMobileMenuProps {
  className?: string;
  onClose: () => void;
  activeMenuItem: number;
  handleMenuLink: (index: number) => void;
  menuLinks: string[];
}

const LandingMobileMenu: React.FC<LandingMobileMenuProps> = ({
  className,
  onClose,
  activeMenuItem,
  handleMenuLink,
  menuLinks,
}) => (
  <div className={cn(s.root, className)}>
    <header className={s.header}>
      <IconButton
        className={s.closeButton}
        onClick={onClose}
        icon="close"
        variant="clear"
      />
      <button className={s.logo} onClick={() => handleMenuLink(0)}>
        <MothershipLogo className={s.logoIcon} />
        <span className={s.logoText}>Mothership</span>
      </button>
    </header>
    <section className={s.content}>
      <nav className={s.menu}>
        {menuLinks.map((name, index) => (
          <button
            key={name}
            className={cn(s.menuLink, {
              [s.menuLinkActive]: index === activeMenuItem,
            })}
            onClick={() => {
              handleMenuLink(index);
            }}
          >
            <span>{name}</span>
          </button>
        ))}
      </nav>
      <Button className={s.connectButton} size="sm">
        Connect to Mothership
      </Button>
    </section>
    <LandingFooter />
  </div>
);

export default LandingMobileMenu;
