import React, { useState } from 'react';
import cn from 'classnames';
import { Button, IconButton } from 'components/UILib';
import ThemeSwitcher from 'components/ThemeSwitcher';
import { Theme } from 'types/theme';
import { SputnikDaoLogo } from '../SputnikDaoLogo';
import { MobileMenu } from '../MobileMenu';
import { SearchAutoComplete } from '../SearchAutoComplete';

import s from './Header.module.scss';

interface HeaderProps {
  className: string;
  theme: Theme;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ className, toggleTheme, theme }) => {
  const [isMenuOpen, setOpenMenu] = useState(false);

  const toggleMenu = () => {
    setOpenMenu(!isMenuOpen);
  };

  return (
    <>
      <header className={cn(s.root, className)}>
        <div className={s.container}>
          <nav className={s.links}>
            <IconButton
              icon="menu"
              className={s.menuBtn}
              variant="clear"
              size="sm"
              onClick={toggleMenu}
            />
            <a href="/" className={s.logo}>
              <SputnikDaoLogo className={s.logoIcon} />
            </a>
            <a className={s.link} href="/">
              Discover DAO
            </a>
          </nav>
          <SearchAutoComplete className={s.search} />
          <div className={s.searchBtnContainer}>
            <IconButton
              className={s.searchBtn}
              icon="search"
              variant="monochrome"
              size="sm"
            />
          </div>
          <div className={s.controls}>
            <Button className={s.control} size="sm">
              Create new DAO
            </Button>
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
              className={s.themeSwitcher}
            />
          </div>
        </div>
      </header>
      {isMenuOpen && (
        <MobileMenu
          onClose={toggleMenu}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}
    </>
  );
};

export default Header;
