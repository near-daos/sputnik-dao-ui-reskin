import React from 'react';
import cn from 'classnames';

import { DaoItem } from 'types/dao';
import { DaoCard } from 'components/DaoCard';
import s from './SearchDaoPage.module.scss';

export interface SearchDaoPageProps {
  className?: string;
  daos: DaoItem[];
}

const SearchDaoPage: React.FC<SearchDaoPageProps> = ({ className, daos }) => (
  <div className={cn(s.root, className)}>
    {daos.map((item) => (
      <DaoCard dao={item} className={s.dao} size="sm" key={item.id} />
    ))}
  </div>
);

export default SearchDaoPage;
