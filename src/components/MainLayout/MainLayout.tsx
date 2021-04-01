/* eslint-disable import/no-cycle */
import React, { useState } from 'react';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';

import s from './MainLayout.module.scss';

const DEFAULT_THEME = 'dark';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [theme, setTheme] = useState(DEFAULT_THEME);

  const toggleTheme = () => {
    const updatedTheme = theme === 'light' ? 'dark' : 'light';

    document.documentElement.classList.add('color-theme-in-transition');
    setTheme(updatedTheme);
    document.documentElement.setAttribute('data-theme', updatedTheme);
    window.setTimeout(() => {
      document.documentElement.classList.remove('color-theme-in-transition');
    }, 1000);
  };

  return (
    <div className={s.root} id="themed" data-theme={theme}>
      <Header
        className={s.header}
        toggleTheme={toggleTheme}
        theme={theme === 'light'}
      />
      <main className={s.content}>{children}</main>
      <Footer className={s.footer} />
    </div>
  );
};
