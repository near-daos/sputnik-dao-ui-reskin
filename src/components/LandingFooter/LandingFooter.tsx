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
      <p className={s.createAccount}>
        Need a NEAR account? Create one&nbsp;
        <a href="https://faucet.paras.id/" target="_blank" rel="noreferrer">
          here
        </a>
        .
      </p>
      <form
        className={s.form}
        action="https://42labs.us14.list-manage.com/subscribe/post?u=faedf5dec8739fb92e05b4131&id=14e8024c6c"
        method="POST"
        target="_blank"
      >
        <label className={s.formLabel} htmlFor="input-contact-email">
          Stay in touch
        </label>
        <TextField
          type="text"
          name="EMAIL"
          value={userEmail}
          className={s.formInput}
          onChange={changeUserEmail}
          label="Your email"
          variant="sm"
          id="input-contact-email"
        />
        <Button
          className={s.formButton}
          variant="outline"
          size="sm"
          type="submit"
        >
          Submit
        </Button>
      </form>
      <p className={s.copyright}>
        Community developed. Not audited. Use at your own risk.
      </p>
    </footer>
  );
};

export default LandingFooter;
