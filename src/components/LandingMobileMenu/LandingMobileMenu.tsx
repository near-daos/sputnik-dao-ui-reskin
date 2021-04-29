import React from 'react';
import cn from 'classnames';

import { Button, IconButton } from 'components/UILib';
import { LandingFooter } from 'components/LandingFooter';

// import { ReactComponent as NearLogo } from 'images/near-logo.svg';
import { ReactComponent as NearLogo } from 'images/sputnikDAO-logo.svg';

import { useHistory } from 'react-router-dom';
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
}) => {
  const history = useHistory();
  const handleLaunchApp = () => {
    history.push('/select-dao');
  };

  return (
    <div className={cn(s.root, className)}>
      <header className={s.header}>
        <IconButton
          className={s.closeButton}
          onClick={onClose}
          icon="close"
          variant="clear"
        />
        <a href="https://near.org/">
          <NearLogo className={s.logo} />
        </a>
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
        <Button className={s.connectButton} size="sm" onClick={handleLaunchApp}>
          Launch App
        </Button>
      </section>
      <LandingFooter />
    </div>
  );
};

export default LandingMobileMenu;
