import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { Button, IconButton } from 'components/UILib';
import ThemeSwitcher from 'components/ThemeSwitcher';
import { Theme } from 'types/theme';
import { useHistory, useLocation } from 'react-router-dom';
import { CreateDaoPopup } from 'components/CreateDaoPopup';
import { SearchAutoComplete } from 'components/SearchAutoComplete';
import { MobileMenu } from 'components/MobileMenu';
import { SputnikDaoLogo } from 'components/SputnikDaoLogo';

import s from './Header.module.scss';

interface HeaderProps {
  className: string;
  theme: Theme;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ className, toggleTheme, theme }) => {
  const [isMenuOpen, setOpenMenu] = useState(false);
  const [isShowCreateDaoPopup, setIsShowCreateDaoPopup] = useState(false);
  const location = useLocation();
  const history = useHistory();

  const showSearchBar = !location.pathname.includes('search');

  const toggleMenu = () => {
    setOpenMenu(!isMenuOpen);
  };

  const showCreateDaoPopup = () => {
    setIsShowCreateDaoPopup(true);
  };

  const hideCreateDaoPopup = () => {
    const params = new URLSearchParams();

    params.delete('create-dao-popup');
    history.push({ search: params.toString() });
    setIsShowCreateDaoPopup(false);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    if (urlParams.get('create-dao-popup')) {
      setIsShowCreateDaoPopup(true);
    }
  }, [location]);

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
          {showSearchBar && <SearchAutoComplete className={s.search} />}
          <div className={s.searchBtnContainer}>
            <IconButton
              className={s.searchBtn}
              icon="search"
              variant="monochrome"
              size="sm"
            />
          </div>
          <div className={s.controls}>
            <Button
              className={s.control}
              size="sm"
              onClick={showCreateDaoPopup}
            >
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
      {isShowCreateDaoPopup && <CreateDaoPopup onClose={hideCreateDaoPopup} />}
    </>
  );
};

export default Header;
