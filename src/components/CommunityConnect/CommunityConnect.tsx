import React from 'react';
import { Button } from 'components/UILib';
import useMedia from 'hooks/use-media';
import { SocialMedias } from 'components/SocialMedias';

import city from 'images/city.png';
import cometSky from 'images/comet-sky.png';

import s from './CommunityConnect.module.scss';

const CommunityConnect: React.FC = () => {
  const media = useMedia();
  const handleLearnClick = () => {
    window.open('https://gov.near.org/', '_blank');
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
          <Button variant="outline" onClick={handleLearnClick}>
            NEAR Forum
          </Button>
        </div>
        <SocialMedias
          className={s.socialMedia}
          size="custom"
          buttonClassName={s.socialButton}
          iconClassName={s.socialIcon}
        />
      </div>
      <div className={s.figureContainer}>
        <img src={cometSky} className={s.cometsFigure} alt="comets sky" />
        <img className={s.cityFigure} src={city} alt="city" />
      </div>
    </div>
  );
};

export default CommunityConnect;
