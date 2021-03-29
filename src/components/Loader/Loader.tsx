import React from 'react';
import cn from 'classnames';
import { ReactComponent as LoaderImage } from 'images/loader.svg';

import styles from './Loader.module.scss';

export interface LoaderProps {
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ className }) => (
  <div className={cn(styles.root, className)}>
    <LoaderImage className={styles.image} />
    <div className={styles.center} />
  </div>
);

export default Loader;
