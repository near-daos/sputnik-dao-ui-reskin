import React, { FormEvent, useState } from 'react';
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

  // const handleSubmitEmail = (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //
  //   if (userEmail === '') {
  //     window.open(
  //       'https://42labs.us14.list-manage.com/subscribe/post?u=faedf5dec8739fb92e05b4131&id=14e8024c6c',
  //       '_blank',
  //     );
  //   } else {
  //     console.log('test');
  //   }
  // };

  return (
    <footer className={cn(s.root, className)}>
      <SocialMedias className={s.socialMedia} />
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
        <span>2021 NEAR Protocol | All rights reserved</span>
        <span className={s.copyrightDivider}>&nbsp;|&nbsp;</span>
        <span>
          <a href="mailto:hello@near.org">hello@near.org</a>
          &nbsp;|&nbsp;
          <a href="/">Privacy Policy</a>
        </span>
      </p>
      <nav className={s.links}>
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
