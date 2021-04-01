import React from 'react';
import cn from 'classnames';
import { SputnikDaoLogo } from '../SputnikDaoLogo/SputnikDaoLogo';

import s from './Header.module.scss';
import { SearchAutoComplete } from '../SearchAutoComplete';

interface HeaderProps {
  className: string;
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ className, toggleTheme }) => (
  <header className={cn(s.root, className)}>
    <div className={s.container}>
      <SputnikDaoLogo className={s.logo} />
      Discover DAO
      <SearchAutoComplete className={s.search} />
      <button type="button">Create new DAO</button>
      <button type="button">Sign In</button>
      <button type="button" onClick={toggleTheme}>
        Toggle theme
      </button>
    </div>
  </header>
);
