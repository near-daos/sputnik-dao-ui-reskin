import React from 'react';
import cn from 'classnames';

import { IconButton, SvgIcon } from 'components/UILib';
import s from './DaoDetailPopup.module.scss';
import { DaoItem } from '../../types/dao';
import { nearConfig } from '../../config';

export interface DaoDetailPopupProps {
  className?: string;
  dao: DaoItem;
  onClose?: () => void;
  onOpenMembersModal: () => void;
}

const DaoDetailPopup: React.FC<DaoDetailPopupProps> = ({
  className,
  dao,
  onOpenMembersModal,
  onClose,
}) => {
  const daoName = dao?.id.replace(`.${nearConfig.contractName}`, '');

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
        <p className={s.subTitle}>dao</p>
        <p className={s.title}>Details</p>
        <div className={s.border} />
        <div className={s.contentWrapper}>
          <p className={s.daoName}>
            <span>{daoName}</span>.{nearConfig.contractName}
          </p>
          <div className={s.detailWrapper}>
            <div className={s.dataWrapper}>
              <div className={s.nameWrapper}>
                <p className={s.name}>DAO Funds</p>
                <SvgIcon icon="token" size={12} className={s.tokenIcon} />
              </div>
              <p className={s.value}>{dao?.amount}</p>
            </div>
            <div className={s.row}>
              <button
                className={cn(s.dataWrapper, s.council)}
                onClick={() => {
                  onOpenMembersModal();
                }}
              >
                <p className={s.name}>Council</p>
                <div className={s.valueRow}>
                  <p className={s.value}>{dao?.members.length}</p>
                  <SvgIcon icon="info" size={18} className={s.infoIcon} />
                </div>
              </button>
              <div className={s.dataWrapper}>
                <div className={s.nameWrapper}>
                  <p className={s.name}>Bond</p>
                  <SvgIcon icon="token" size={12} className={s.tokenIcon} />
                </div>
                <p className={s.value}>{dao?.bond}</p>
              </div>
              <div className={s.dataWrapper}>
                <p className={s.name}>Vote period</p>
                <p className={s.value}>{dao?.votePeriod}</p>
              </div>
            </div>
            <p className={s.purposeTitle}>Purpose</p>
            <p className={s.purpose}>{dao.purpose}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DaoDetailPopup;
