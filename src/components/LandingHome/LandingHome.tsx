import React from 'react';

import { ReactComponent as MothershipLogo } from 'images/mothership-logo.svg';

import s from './LandingHome.module.scss';

const LandingHome: React.FC = () => (
  <section className={s.root}>
    <div className={s.logoHolder}>
      <MothershipLogo className={s.logo} />
    </div>
    <p className={s.scrollTip}>Scroll or Drag sideways to navigate</p>
    <p className={s.scrollTipMobile}>Scroll to navigate</p>
  </section>
);

export default LandingHome;
