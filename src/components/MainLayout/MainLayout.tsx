/* eslint-disable import/no-cycle */
import React, { useEffect, useState } from 'react';
import { Header } from 'components/Header';
// import { Footer } from 'components/Footer';
import { Theme } from 'types/theme';

import { checkIfNearAuthKeysExist } from 'utils';
import { NearService } from 'services/NearService';
import s from './MainLayout.module.scss';
import { LandingFooter } from '../LandingFooter';

const DEFAULT_THEME = Theme.Dark;

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [isShowBanner, setIsShowBanner] = useState(false);

  useEffect(() => {
    if (!NearService.isAuthorized() && checkIfNearAuthKeysExist()) {
      setIsShowBanner(true);
    }
  }, []);

  const toggleTheme = () => {
    const updatedTheme = theme === Theme.Light ? Theme.Dark : Theme.Light;

    document.documentElement.classList.add('color-theme-in-transition');
    setTheme(updatedTheme);
    document.documentElement.setAttribute('data-theme', updatedTheme);
    window.setTimeout(() => {
      document.documentElement.classList.remove('color-theme-in-transition');
    }, 1000);
  };

  return (
    <div className={s.root} id="themed" data-theme={theme}>
      {isShowBanner && (
        <div className={s.banner}>
          Sign in failed, please try again (mismatched app cache has been
          cleared).
        </div>
      )}
      <Header className={s.header} toggleTheme={toggleTheme} theme={theme} />
      <main className={s.content}>{children}</main>
      {/* <Footer className={s.footer} /> */}
      <LandingFooter />
    </div>
  );
};
