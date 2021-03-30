import React from 'react';
import cn from 'classnames';
import { NavLink } from 'react-router-dom';

import styles from './NabTabs.module.scss';

export type NavItem = {
  name: string;
  route: string;
  count?: number;
};

export interface NabTabsProps {
  className?: string;
  options: NavItem[];
}

const NabTabs: React.FC<NabTabsProps> = ({ className, options }) => (
  <div className={cn(styles.root, className)}>
    {options.map((item) => (
      <NavLink
        to={item.route}
        className={styles.link}
        activeClassName={styles.active}
        key={`nav-tab-${item.name}`}
      >
        {item.name}
        {item.count && <span className={styles.count}>({item.count})</span>}
      </NavLink>
    ))}
  </div>
);

export default NabTabs;
