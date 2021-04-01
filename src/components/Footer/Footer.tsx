import React from 'react';
import cn from 'classnames';

import s from './Footer.module.scss';

interface FooterProps {
  className: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => (
  <footer className={cn(s.root, className)}>
    <div className={s.container}>
      <p className={s.disclaimer}>
        SputnikDAO 2021. The software is an <mark>open source</mark> and
        provided “as is”, without warranty of any kind.
      </p>
      <nav className={s.navLinks}>
        <a href="/" className={s.navLink}>
          Privacy Policy
        </a>
        <a href="/" className={s.navLink}>
          Terms of Use
        </a>
      </nav>
    </div>
  </footer>
);

export default Footer;
