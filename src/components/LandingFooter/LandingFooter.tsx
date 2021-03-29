import React, { useState } from 'react';
import cn from 'classnames';
import { Button, TextField, SvgIcon } from '../UILib';

import s from './LandingFooter.module.scss';

/* eslint-disable jsx-a11y/label-has-associated-control */

interface LandingFooterProps {
  className?: string;
}

const LandingFooter: React.FC<LandingFooterProps> = ({ className }) => {
  const [userEmail, changeUserEmail] = useState('');

  return (
    <footer className={cn(s.root, className)}>
      <div className={s.socialMedia}>
        <a href="/" className={s.socialLink}>
          <SvgIcon className={s.socialIcon} icon="twitter" />
        </a>
        <a href="/" className={s.socialLink}>
          <SvgIcon className={s.socialIcon} icon="telegram" />
        </a>
        <a href="/" className={s.socialLink}>
          <SvgIcon className={s.socialIcon} icon="discord" />
        </a>
        <a href="/" className={s.socialLink}>
          <SvgIcon className={s.socialIcon} icon="github" />
        </a>
        <a href="/" className={s.socialLink}>
          <SvgIcon className={s.socialIcon} icon="wechat" />
        </a>
      </div>
      <form className={s.form}>
        <label className={s.formLabel} htmlFor="input-contact-email">
          Stay in touch
        </label>
        <TextField
          type="text"
          name="email"
          value={userEmail}
          className={s.formInput}
          onChange={changeUserEmail}
          label="Your email"
          variant="sm"
          id="input-contact-email"
        />
        <Button className={s.formButton} variant="outline" size="sm">
          Submit
        </Button>
      </form>
      <p className={s.copyright}>© Mothership 2021. All rights reserved</p>
      <nav className={s.links}>
        <a href="/" className={s.link}>
          Privacy Police
        </a>
        <a href="/" className={s.link}>
          Terms of Use
        </a>
        <a href="/" className={s.link}>
          FAQ
        </a>
      </nav>
    </footer>
  );
};

export default LandingFooter;
