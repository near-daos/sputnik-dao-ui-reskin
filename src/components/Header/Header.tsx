import React, { useState } from 'react';
import cn from 'classnames';
import { Button, IconButton } from 'components/UILib';
import ThemeSwitcher from 'components/ThemeSwitcher';
import { Theme } from 'types/theme';
import { ProfileButton } from 'components/ProfileButton';
import { SputnikDaoLogo } from 'components/SputnikDaoLogo';
import { MobileMenu } from 'components/MobileMenu';
import { SearchAutoComplete } from 'components/SearchAutoComplete';
import { useDispatch, useSelector } from 'react-redux';

import { login, logout } from 'redux/actions';
import { accountSelector } from 'redux/selectors';
import s from './Header.module.scss';

interface HeaderProps {
  className: string;
  theme: Theme;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ className, toggleTheme, theme }) => {
  const [isMenuOpen, setOpenMenu] = useState(false);
  const account = useSelector(accountSelector);
  const dispatch = useDispatch();

  const toggleMenu = () => {
    setOpenMenu(!isMenuOpen);
  };

  const handleSingIn = () => {
    dispatch(login.started());
  };

  const handleSingOut = () => {
    dispatch(logout.started());
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
            {!account && (
              <Button
                className={cn(s.control, s.authBtn)}
                size="sm"
                variant="outline"
                onClick={handleSingIn}
              >
                Sign In
              </Button>
            )}
            {account && (
              <ProfileButton
                className={cn(s.control, s.authBtn)}
                accountName={account}
                onSingOut={handleSingOut}
              />
            )}
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
          isAuth={!!account}
          toggleTheme={toggleTheme}
          accountName={account || ''}
          onSingIn={handleSingIn}
          onSingOut={handleSingOut}
        />
      )}
    </>
  );
};

export default Header;
