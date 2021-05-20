import React from 'react';
import { Link } from 'react-router-dom';

import s from './Page404.module.scss';

const COLOR_THEME = localStorage.getItem('theme') || 'dark';

const Page404: React.FC = () => (
  <div className={s.root} id="themed" data-theme={COLOR_THEME}>
    <div className={s.image404} />
    <div className={s.wrapper}>
      <span className={s.oops}>Oops!</span>
      <span className={s.message}>
        We can’t seem to find the page you’re looking for.
      </span>
      <Link to="/" className={s.link}>
        Back to Main page
      </Link>
    </div>
  </div>
);

export default Page404;
