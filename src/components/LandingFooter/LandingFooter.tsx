import React, { useState } from 'react';
import cn from 'classnames';
import { SocialMedias } from 'components/SocialMedias';
import { Button, TextField } from '../UILib';

import s from './LandingFooter.module.scss';

/* eslint-disable jsx-a11y/label-has-associated-control */

interface LandingFooterProps {
  className?: string;
}

const LandingFooter: React.FC<LandingFooterProps> = ({ className }) => {
  const [userEmail, changeUserEmail] = useState('');

  return (
    <footer className={cn(s.root, className)}>
      <SocialMedias className={s.socialMedia} />
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
        <Button href="/" variant="clear" size="custom" className={s.link}>
          Privacy Police
        </Button>
        <Button href="/" variant="clear" size="custom" className={s.link}>
          Terms of Use
        </Button>
        <Button href="/" variant="clear" size="custom" className={s.link}>
          FAQ
        </Button>
      </nav>
    </footer>
  );
};

export default LandingFooter;
