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
            SputnikDAO is a hub of DAOs empowering communities of the NEAR
            ecosystem. Receive rewards for individual contributions by
            submitting proposals to existing DAOs. Create a guild for your own
            meaningful project to find allies and monthly funding.
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
