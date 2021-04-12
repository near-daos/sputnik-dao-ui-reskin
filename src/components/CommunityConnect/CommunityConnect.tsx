import React from 'react';
import { Button, TextField } from 'components/UILib';
import useMedia from 'hooks/use-media';
import { SocialMedias } from 'components/SocialMedias';

import { ReactComponent as Spaceship } from 'images/spaceship.svg';

import s from './CommunityConnect.module.scss';

const CommunityConnect: React.FC = () => {
  const media = useMedia();

  return (
    <div className={s.root}>
      <div className={s.container}>
        <h3 className={s.heading}>
          Connect
          {media.desktop ? <br /> : ' '}
          to our community
        </h3>
        <p className={s.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
        <form className={s.form}>
          <TextField
            name="your-email"
            value=""
            placeholder="Your email"
            onChange={() => ''}
            variant="md"
          />
          <Button size="lg">Stay with us</Button>
        </form>
        <SocialMedias
          className={s.socialMedia}
          size="custom"
          buttonClassName={s.socialButton}
          iconClassName={s.socialIcon}
        />
      </div>
      <div className={s.figureContainer}>
        <Spaceship className={s.figure} />
      </div>
    </div>
  );
};

export default CommunityConnect;
