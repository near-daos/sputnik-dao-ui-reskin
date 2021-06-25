import React, { FC, useCallback } from 'react';

import { Chip } from '../../../UILib';
import { ProposalFilterOption } from '../../types';

interface ChipFilterProps {
  active: boolean;
  onClick: (option: ProposalFilterOption) => void;
  filterOption: ProposalFilterOption;
}

export const ChipFilter: FC<ChipFilterProps> = (props) => {
  const { active, onClick, filterOption } = props;

  const handleOnClick = useCallback(() => {
    onClick(filterOption);
  }, [onClick, filterOption]);

  return (
    <Chip
      key={filterOption.label}
      size="lg"
      active={active}
      label={filterOption.label}
      color={filterOption.color}
      amount={filterOption.count}
      onClick={handleOnClick}
    />
  );
};
