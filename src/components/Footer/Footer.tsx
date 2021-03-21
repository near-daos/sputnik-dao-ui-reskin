import React from 'react';
import classnames from 'classnames';

import s from './Footer.module.scss';

interface FooterProps {
  className: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => (
  <footer className={classnames(s.root, className)}>
    <div className={s.container}>
      SputnikDAO 2021. The software is an open source and provided “as is”, without warranty of any
      kind.
      <ul>
        <li>
          <a href="/">Privacy Policy</a>
        </li>
        <li>
          <a href="/">Terms of Use</a>
        </li>
      </ul>
    </div>
  </footer>
);
