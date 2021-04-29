import React from 'react';
import { Button, TextField } from 'components/UILib';
import useMedia from 'hooks/use-media';
import { SocialMedias } from 'components/SocialMedias';

import { ReactComponent as Houses } from 'images/houses.svg';
import { ReactComponent as CometSky } from 'images/comet-sky.svg';

import s from './CommunityConnect.module.scss';

const CommunityConnect: React.FC = () => {
  const media = useMedia();
  const handleLearnClick = () => {
    window.open('https://learnnear.club/', '_blank');
  };

  return (
    <div className={s.root}>
      <div className={s.container}>
        <h3 className={s.heading}>
          Connect
          {media.desktop ? <br /> : ' '}
          to our community
        </h3>
        <p className={s.description}>
          Creators of all kinds are welcome and rewarded in the NEAR community!
          Log in to the <a href="https://gov.near.org/">NEAR Forum</a> to
          connect with guilds and earn NEAR through DAO proposals.
        </p>
        <div className={s.buttonWrapper}>
          <Button onClick={handleLearnClick}>NEAR Forum</Button>
        </div>
        <SocialMedias
          className={s.socialMedia}
          size="custom"
          buttonClassName={s.socialButton}
          iconClassName={s.socialIcon}
        />
      </div>
      <div className={s.figureContainer}>
        <CometSky className={s.cometsFigure} />
        <Houses className={s.cityFigure} />
      </div>
    </div>
  );
};

export default CommunityConnect;
