import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import { Button, IconButton } from 'components/UILib';
import ThemeSwitcher from 'components/ThemeSwitcher';
import { Theme } from 'types/theme';
import { CreateDaoPopup } from 'components/CreateDaoPopup';
import { ProfileButton } from 'components/ProfileButton';
import { SputnikDaoLogo } from 'components/SputnikDaoLogo';
import { MobileMenu } from 'components/MobileMenu';
import { SearchAutoComplete } from 'components/SearchAutoComplete';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import { login, logout } from 'redux/actions';
import { accountSelector, daoListSelector } from 'redux/selectors';
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
  const account = useSelector(accountSelector);
  const dispatch = useDispatch();
  const daoList = useSelector(daoListSelector);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const toggleMenu = () => {
    setOpenMenu(!isMenuOpen);
  };

  const handleSingIn = () => {
    dispatch(login.started());
  };

  const handleSingOut = () => {
    dispatch(logout.started());
  };

  const showCreateDaoPopup = async () => {
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
        {!mobileSearchOpen && (
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
              <a className={s.link} href="/select-dao">
                All DAO
              </a>
            </nav>
            {showSearchBar && (
              <SearchAutoComplete className={s.search} daoList={daoList} />
            )}
            {showSearchBar && (
              <div className={s.searchBtnContainer}>
                <IconButton
                  className={s.searchBtn}
                  icon="search"
                  variant="monochrome"
                  size="sm"
                  onClick={() => {
                    setMobileSearchOpen(true);
                  }}
                />
              </div>
            )}
            <div className={s.controls}>
              <Button
                className={s.control}
                size="sm"
                onClick={showCreateDaoPopup}
              >
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
        )}
        {mobileSearchOpen && (
          <div className={cn(s.container, s.mobileSearchWrapper)}>
            <IconButton
              className={s.closeSearchButton}
              icon="arrow-back"
              variant="monochrome"
              size="sm"
              onClick={() => {
                setMobileSearchOpen(false);
              }}
            />
            <SearchAutoComplete className={s.mobileSearch} daoList={daoList} />
          </div>
        )}
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
      {isShowCreateDaoPopup && <CreateDaoPopup onClose={hideCreateDaoPopup} />}
    </>
  );
};

export default Header;
