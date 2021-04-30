import React from 'react';

import { ReactComponent as Spaceman } from 'images/spaceman.svg';

import s from './Developers.module.scss';
import { Button } from '../UILib';

const Developers: React.FC = () => {
  const handleLearnClick = () => {
    window.open('https://learnnear.club/', '_blank');
  };

  return (
    <div className={s.root}>
      <div className={s.container}>
        <div className={s.info}>
          <h3 className={s.heading}>Developers</h3>
          <p className={s.description}>
            Build apps quickly using languages you already know (Rust and
            AssemblyScript). Get inspired with 1st class{' '}
            <a href="https://examples.near.org/">demos</a>, fantastic{' '}
            <a href="https://docs.near.org/docs/develop/basics/getting-started">
              docs
            </a>
            , and slick tooling. Attention to User Experience extends to your
            Developer Experience with NEAR. Learn at your own pace at{' '}
            <a href="https://near.academy/">Near Academy</a> or join the 5 days
            intensive{' '}
            <a href="https://learnnear.club/certified-near-developer-application/">
              NEAR Certified Developer Program
            </a>
            . Check the unique possibilities of NEAR with biweekly{' '}
            <a href="https://www.youtube.com/playlist?list=PL9tzQn_TEuFXnHlfh00etU57IjpRlQGpY">
              Live App Review videos
            </a>
            . Time to <code>npx create-near-app your-awesome-project</code>!
          </p>
          <Button
            variant="outline"
            className={s.learnButton}
            onClick={handleLearnClick}
          >
            LearnNEAR.club
          </Button>
        </div>
      </div>
      <div className={s.figureContainer}>
        <div className={s.figureHolder}>
          <Spaceman className={s.figure} />
        </div>
      </div>
    </div>
  );
};

export default Developers;
