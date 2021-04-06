import React, { useState } from 'react';
import cn from 'classnames';

import { Button, SvgIcon } from 'components/UILib';
import { Dao } from 'types/dao';
import getVotePeriod from 'utils/getVotePeriod';
import { MembersPopup } from '../MembersPopup';

import s from './DaoDetails.module.scss';

export interface DaoDetailsProps {
  className?: string;
}

const dao: Dao = {
  id: '123',
  name: '123',
  purpose:
    ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sagittis\n' +
    '          eleifend habitant laoreet ornare vitae consequat. Potenti ut urna,\n' +
    '          ultricies elit nam. Feugiat porta elit ultricies eu mollis. Faucibus\n' +
    '          mauris faucibus aliquam non. In in molestie netus vulputate odio risus\n' +
    '          aliquam. Blandit nulla convallis lorem condimentum non tortor. Blandit\n' +
    '          nulla convallis lorem condimentum non tortor to.Lorem ipsum dolor sit\n' +
    '          amet, consectetur adipiscing elit. Sagittis eleifend habitant laoreet\n' +
    '          ornare vitae consequat. Potenti ut urna, ultricies elit nam. Feugiat\n' +
    '          porta elit ultricies eu mollis. Faucibus mauris faucibus aliquam non.\n' +
    '          In in molestie netus vulputate odio risus aliquam. Blandit nulla\n' +
    '          convallis lorem condimentum non tortor. Blandit nulla convallis lorem\n' +
    '          condimentum non tortor to....',
  numberOfProposals: 1,
  bond: 1,
  amountMembers: 1,
  daoFunds: 1,
  image: 'fdfsd',
  members: [
    'test1',
    'test2',
    'tes3',
    'tes4',
    'tes5',
    'tes6',
    'tes7',
    'tes8',
    'tes9',
    'test10',
    'test11',
    'test12',
  ],
  network: 'Mainnet',
  votePeriod: new Date('Mon May 17 2021 22:11:10 GMT+0300'),
};

const DaoDetails: React.FC<DaoDetailsProps> = ({ className }) => {
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
          {firstTenMembers.map((item) => (
            <p className={s.member}>{item}</p>
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
