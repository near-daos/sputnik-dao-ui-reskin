import React from 'react';
import cn from 'classnames';

import s from './DaoDetailsPage.module.scss';

export interface DaoDetailsPageProps {
  className?: string;
}

const DaoDetailsPage: React.FC<DaoDetailsPageProps> = ({ className }) => (
  <div className={cn(s.root, className)}>DaoDetailsPage</div>
);

export default DaoDetailsPage;
