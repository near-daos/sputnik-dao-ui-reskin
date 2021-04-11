import React from 'react';
import useMedia from 'hooks/use-media';

import { ReactComponent as Comets } from 'images/comets.svg';
import { ReactComponent as CometsMobile } from 'images/comets-mobile.svg';

import s from './HowItWorks.module.scss';

const HowItWorks: React.FC = () => {
  const media = useMedia();

  const Figure = media.mobile ? CometsMobile : Comets;

  return (
    <div className={s.root}>
      <div className={s.container}>
        <div className={s.info}>
          <h2 className={s.heading}>How it works</h2>
          <p className={s.description}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </div>
      <div className={s.figureContainer}>
        <Figure className={s.figure} />
      </div>
    </div>
  );
};

export default HowItWorks;
