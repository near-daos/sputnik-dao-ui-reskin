import React, { useEffect, useState } from 'react';
import cn from 'classnames';

import { IconButton } from 'components/UILib';
import SearchBar from 'components/SearchBar';
import s from './VotedMembersPopup.module.scss';

export interface VotedMembersPopupProps {
  className?: string;
  name: string;
  members: string[];
  approveArray: string[];
  rejectArray: string[];
  onClose?: () => void;
}

type Member = {
  name: string;
  greyscale: number;
};

const VotedMembersPopup: React.FC<VotedMembersPopupProps> = ({
  className,
  name,
  members,
  approveArray,
  rejectArray,
  onClose,
}) => {
  console.log(approveArray);
  console.log(rejectArray);

  const [searchText, setSearchText] = useState('');
  const [filteredMembersList, setFilteredMembersList] = useState<string[]>([]);

  useEffect(() => {
    const newFilteredMembersList = members.filter((i) =>
      i.toLowerCase().includes(searchText.toLowerCase()),
    );

    setFilteredMembersList(newFilteredMembersList);
  }, [members, searchText, setFilteredMembersList]);

  const isVoteApprove = (user: string): boolean =>
    approveArray.findIndex((item) => item === user) !== -1;

  const isVoteReject = (user: string): boolean =>
    rejectArray.findIndex((item) => item === user) !== -1;

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
          <p className={s.title}>Council</p>
          <p className={s.number}>({members.length})</p>
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
                className={cn(s.councilItem, {
                  [s.vote]: isVoteReject(item) || isVoteApprove(item),
                })}
              >
                <span
                  className={cn(s.rect, {
                    [s.red]: isVoteReject(item),
                    [s.green]: isVoteApprove(item),
                  })}
                />
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotedMembersPopup;
