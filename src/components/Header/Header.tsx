import React, { useState } from 'react';
import cn from 'classnames';
import SearchBar from 'components/SearchBar';
import { SputnikDaoLogo } from '../SputnikDaoLogo/SputnikDaoLogo';

import s from './Header.module.scss';

interface HeaderProps {
  className: string;
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ className, toggleTheme }) => {
  const [searchText, setSearchText] = useState('');

  return (
    <header className={cn(s.root, className)}>
      <div className={s.container}>
        <SputnikDaoLogo className={s.logo} />
        Discover DAO
        <SearchBar
          value={searchText}
          onChange={setSearchText}
          placeholder="Search for DAO or proposal"
          name="search"
        />
        <button type="button">Create new DAO</button>
        <button type="button">Sign In</button>
        <button type="button" onClick={toggleTheme}>
          Toggle theme
        </button>
      </div>
    </header>
  );
};
