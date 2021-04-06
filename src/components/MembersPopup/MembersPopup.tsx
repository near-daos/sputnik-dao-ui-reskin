import React, { useEffect, useState } from 'react';
import cn from 'classnames';

import { IconButton } from 'components/UILib';
import SearchBar from 'components/SearchBar';
import s from './MembersPopup.module.scss';

export interface MembersPopupProps {
  className?: string;
  name: string;
  membersNumber: number;
  members: string[];
  onClose?: () => void;
}

type Member = {
  name: string;
  greyscale: number;
};

const MembersPopup: React.FC<MembersPopupProps> = ({
  className,
  name,
  members,
  membersNumber,
  onClose,
}) => {
  const [searchText, setSearchText] = useState('');
  const [membersList, setMembersList] = useState<Member[]>([]);
  const [filteredMembersList, setFilteredMembersList] = useState<Member[]>([]);

  const addFilterToMember = (items: string[]): Member[] =>
    items.map((item, index) => ({
      name: item,
      greyscale: (100 / (items.length - 1)) * index,
    }));

  useEffect(() => {
    const newFilteredMembersList = membersList.filter((i) =>
      i.name.toLowerCase().includes(searchText.toLowerCase()),
    );

    setFilteredMembersList(newFilteredMembersList);
  }, [searchText, setFilteredMembersList, membersList]);

  useEffect(() => {
    setMembersList(addFilterToMember(members));
  }, [members]);

  return (
    <div className={cn(s.root, className)}>
      <div
        aria-label="overlay"
        role="button"
        tabIndex={0}
        className={s.overlay}
        onKeyPress={onClose}
        onClick={onClose}
      />
      <div className={s.wrapper}>
        <IconButton
          icon="close"
          size="lg"
          variant="outline"
          className={s.close}
          onClick={onClose}
        />
        <p className={s.daoName}>{name}</p>
        <div className={s.titleWrapper}>
          <p className={s.title}>Members</p>
          <p className={s.number}>({membersNumber})</p>
        </div>
        <div className={s.border} />
        <div className={s.membersWrapper}>
          <SearchBar
            value={searchText}
            name="search"
            className={s.searchBar}
            onChange={setSearchText}
            placeholder="Members search"
          />
          <div className={s.container}>
            {filteredMembersList.map((item, index) => (
              <p
                key={String(`${item.name}-${index}`)}
                className={s.member}
                style={{ filter: `grayscale(${item.greyscale}%)` }}
              >
                {item.name}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembersPopup;
