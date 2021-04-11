import React, { useState } from 'react';
import cn from 'classnames';

import { Button, SvgIcon } from 'components/UILib';
import { DaoItem } from 'types/dao';
import { MembersPopup } from '../MembersPopup';

import s from './DaoDetails.module.scss';

export interface DaoDetailsProps {
  className?: string;
  dao: DaoItem;
}

const NUMBER_OF_TOP_MEMBERS = 10;

const DaoDetails: React.FC<DaoDetailsProps> = ({ className, dao }) => {
  const [firstTenMembers] = useState<string[]>(
    (dao.members || []).slice(0, NUMBER_OF_TOP_MEMBERS),
  );
  const [isShowMembersPopup, setIsShowMembersPopup] = useState(false);

  return (
    <div className={cn(s.root, className)}>
      <div className={s.column1}>
        <p className={s.title}>Purpose</p>
        <div className={cn(s.purposeWrapper)}>{dao.purpose}</div>
        <div className={s.membersWrapper}>
          <p className={s.title}>Members</p>
          {firstTenMembers.map((item, index) => (
            <p className={s.member} key={String(`member-${index}`)}>
              {item}
            </p>
          ))}
          {dao.members.length > NUMBER_OF_TOP_MEMBERS && (
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
          <p className={s.value}>{dao.amount}</p>
        </div>
        <div className={s.row}>
          <p className={s.subTitle}>Network</p>
          <p className={s.value}>dao.network</p>
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
          <p className={s.value}>{dao.votePeriod}</p>
        </div>
      </div>
      {isShowMembersPopup && (
        <MembersPopup
          name={dao.id}
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
