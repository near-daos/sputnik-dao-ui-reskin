import React from 'react';
import cn from 'classnames';
import exclamation from 'images/exclamation.svg';
import question from 'images/question.svg';

import s from './DaoLogoButton.module.scss';

export interface DaoLogoButtonProps {
  className?: string;
  title: string;
  description: string;
  imageType: 'question' | 'exclamation';
  onClick?: () => void;
}

const DaoLogoButton: React.FC<DaoLogoButtonProps> = ({
  className,
  title,
  description,
  imageType,
  onClick,
}) => (
  <button className={cn(s.root, className)} onClick={onClick}>
    <img
      src={imageType === 'question' ? question : exclamation}
      alt="background"
      className={s.backgroundImage}
    />
    <p className={s.title}>{title}</p>
    <p className={s.description}>{description}</p>
  </button>
);

export default DaoLogoButton;
