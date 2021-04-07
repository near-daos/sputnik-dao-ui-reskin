import React from 'react';
import cn from 'classnames';

import { Proposal } from 'types/proposal';
import { ProposalCard } from 'components/ProposalCard';
import s from './SearchProposalPage.module.scss';

export interface SearchProposalPageProps {
  className?: string;
  proposals: Proposal[];
}

const SearchProposalPage: React.FC<SearchProposalPageProps> = ({
  className,
  proposals,
}) => (
  <div className={cn(s.root, className)}>
    {proposals.map((item) => (
      <ProposalCard proposal={item} className={s.proposal} key={item.id} />
    ))}
  </div>
);

export default SearchProposalPage;
