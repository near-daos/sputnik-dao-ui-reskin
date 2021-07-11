import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';

import { DaoCard } from 'components/DaoCard';

import { daoListSelector } from 'redux/selectors';
import { fetchDaoList } from 'redux/actions';

import { DaoItem } from 'types/dao';
import s from './SelectDao.module.scss';

export interface SelectDaoProps {
  className?: string;
}

export const SelectDao: React.FC<SelectDaoProps> = ({ className }) => {
  const [searchText] = useState('');
  const daoList = useSelector(daoListSelector);

  const [filteredDaoList, setFilteredDaoList] = useState<DaoItem[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDaoList.started());
  }, [dispatch]);

  useEffect(() => {
    if (!searchText) {
      const reverseArray = daoList.slice().reverse();

      setFilteredDaoList(reverseArray);

      return;
    }

    const filtered = daoList.filter((i) =>
      i.id.toLowerCase().includes(searchText.toLowerCase()),
    );

    setFilteredDaoList(filtered);
  }, [daoList, searchText]);

  useEffect(() => {
    document.title = 'SputnikDAO';
  }, []);

  return (
    <div className={cn(s.root, className)}>
      <section className={s.panel}>
        <div>
          <h1 className={s.title}>Select DAO</h1>
          <span className={s.number}>({filteredDaoList.length})</span>
        </div>
      </section>
      <section className={s.grid}>
        {filteredDaoList.map((dao) => (
          <DaoCard key={dao.id} className={s.card} dao={dao} size="md" />
        ))}
      </section>
    </div>
  );
};
