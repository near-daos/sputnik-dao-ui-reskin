import React from 'react';
import classnames from 'classnames';
import { SputnikDaoLogo } from '../SputnikDaoLogo/SputnikDaoLogo';

import s from './Header.module.scss';

interface HeaderProps {
  className: string;
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ className, toggleTheme }) => (
  <header className={classnames(s.root, className)}>
    <div className={s.container}>
      <SputnikDaoLogo className={s.logo} />
      Discover DAO
      <form>
        <fieldset>
          <button>search</button>
          <input placeholder="Search for DAO or proposal" type="search" />
        </fieldset>
      </form>
      <button>Create new DAO</button>
      <button>Sign In</button>
      <button onClick={toggleTheme}>Toggle theme</button>
    </div>
  </header>
);
