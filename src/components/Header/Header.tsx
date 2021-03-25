import React from 'react';
import cn from 'classnames';
import { SputnikDaoLogo } from '../SputnikDaoLogo/SputnikDaoLogo';

import s from './Header.module.scss';

interface HeaderProps {
  className: string;
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ className, toggleTheme }) => (
  <header className={cn(s.root, className)}>
    <div className={s.container}>
      <SputnikDaoLogo className={s.logo} />
      Discover DAO
      <form>
        <fieldset>
          <button type="button">search</button>
          <input placeholder="Search for DAO or proposal" type="search" />
        </fieldset>
      </form>
      <button type="button">Create new DAO</button>
      <button type="button">Sign In</button>
      <button type="button" onClick={toggleTheme}>
        Toggle theme
      </button>
    </div>
  </header>
);
