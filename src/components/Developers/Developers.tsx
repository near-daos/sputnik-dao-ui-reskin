import React from 'react';
import { Button } from 'components/UILib';

import { ReactComponent as Spaceman } from 'images/spaceman.svg';

import s from './Developers.module.scss';

const Developers: React.FC = () => (
  <div className={s.root}>
    <div className={s.container}>
      <div className={s.info}>
        <h3 className={s.heading}>Developers</h3>
        <p className={s.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <div className={s.buttons}>
          <Button size="lg">Try it</Button>
          <Button size="lg" variant="outline">
            Docs
          </Button>
        </div>
      </div>
    </div>
    <div className={s.figureContainer}>
      <div className={s.figureHolder}>
        <Spaceman className={s.figure} />
      </div>
    </div>
  </div>
);

export default Developers;
