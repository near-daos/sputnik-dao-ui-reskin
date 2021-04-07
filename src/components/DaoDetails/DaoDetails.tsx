import React, { useState } from 'react';
import cn from 'classnames';

import { Button, SvgIcon } from 'components/UILib';
import { Dao } from 'types/dao';
import getVotePeriod from 'utils/getVotePeriod';
import { MembersPopup } from '../MembersPopup';

import s from './DaoDetails.module.scss';

export interface DaoDetailsProps {
  className?: string;
  dao: Dao;
}
const DaoDetails: React.FC<DaoDetailsProps> = ({ className, dao }) => {
  const [firstTenMembers] = useState<string[]>(dao.members.slice(0, 10));
  const [isOpenProposal, setIsOpenProposal] = useState(false);
  const [isShowMembersPopup, setIsShowMembersPopup] = useState(false);
  const { days, months, hours } = getVotePeriod(dao.votePeriod);

  return (
    <div className={cn(s.root, className)}>
      <div className={s.column1}>
        <p className={s.title}>Purpose</p>
        <div
          className={cn(s.purposeWrapper, {
            [s.short]: !isOpenProposal,
          })}
        >
          {dao.purpose}
        </div>
        <Button
          variant="outline"
          rightElement={
            <SvgIcon
              icon="dd-arrow"
              size={18}
              className={cn({
                [s.close]: isOpenProposal,
              })}
            />
          }
          size="sm"
          className={s.button}
          onClick={() => {
            setIsOpenProposal(!isOpenProposal);
          }}
        >
          {!isOpenProposal ? 'Read more' : 'Show Less'}
        </Button>
        <div className={s.membersWrapper}>
          <p className={s.title}>Members</p>
          {firstTenMembers.map((item, index) => (
            <p className={s.member} key={String(`member-${index}`)}>
              {item}
            </p>
          ))}
          {dao.members.length > 10 && (
            <Button
              variant="outline"
              rightElement={<span>({dao.members.length})</span>}
              size="sm"
              className={s.button}
              onClick={() => {
                setIsShowMembersPopup(true);
              }}
            >
              View All
            </Button>
          )}
        </div>
      </div>
      <div className={s.column2}>
        <div className={s.row}>
          <div className={s.subTitleWrapper}>
            <p className={s.subTitle}>DAO Funds</p>
            <SvgIcon icon="token" size={10} className={s.tokenIcon} />
          </div>
          <p className={s.value}>{dao.daoFunds}</p>
        </div>
        <div className={s.row}>
          <p className={s.subTitle}>Network</p>
          <p className={s.value}>{dao.network}</p>
        </div>
        <div className={s.row}>
          <div className={s.subTitleWrapper}>
            <p className={s.subTitle}>Bond</p>
            <SvgIcon icon="token" size={10} className={s.tokenIcon} />
          </div>
          <p className={s.value}>{dao.bond}</p>
        </div>
        <div className={s.row}>
          <p className={s.subTitle}>Vote Period</p>
          <p className={s.value}>
            {months > 0 && (
              <>
                <span>{months}</span>
                <span className={s.date}>m </span>
              </>
            )}
            {days > 0 && (
              <>
                <span>{days}</span>
                <span className={s.date}>d </span>
              </>
            )}
            {hours > 0 && (
              <>
                <span>{hours}</span>
                <span className={s.date}>h</span>
              </>
            )}
          </p>
        </div>
      </div>
      {isShowMembersPopup && (
        <MembersPopup
          name={dao.name}
          membersNumber={dao.members.length}
          members={dao.members}
          onClose={() => {
            setIsShowMembersPopup(false);
          }}
        />
      )}
    </div>
  );
};

export default DaoDetails;
