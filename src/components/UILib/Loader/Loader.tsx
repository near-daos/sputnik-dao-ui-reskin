import React from 'react';
import cn from 'classnames';
import { ReactComponent as LoaderImage } from 'images/loader.svg';

import s from './Loader.module.scss';

export interface LoaderProps {
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ className }) => (
  <div className={cn(s.root, className)}>
    <LoaderImage className={s.image} />
    <div className={s.center} />
  </div>
);

export default Loader;
