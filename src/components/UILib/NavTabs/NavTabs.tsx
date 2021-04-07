import React from 'react';
import cn from 'classnames';
import { NavLink, useLocation } from 'react-router-dom';

import s from './NavTabs.module.scss';

export type NavItem = {
  name: string;
  route: string;
  count?: number;
};

export interface NavTabsProps {
  className?: string;
  options: NavItem[];
}

const NavTabs: React.FC<NavTabsProps> = ({ className, options }) => {
  const location = useLocation();

  return (
    <div className={cn(s.root, className)}>
      {options.map((item) => (
        <NavLink
          to={item.route + location.search}
          className={s.link}
          activeClassName={s.active}
          key={`nav-tab-${item.name}`}
        >
          {item.name}
          {!!item.count && <span className={s.count}>({item.count})</span>}
        </NavLink>
      ))}
    </div>
  );
};

export default NavTabs;
