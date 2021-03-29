import React from 'react';
import { LandingHeader } from 'components/LandingHeader';
import { LandingFooter } from 'components/LandingFooter';

import s from './LandingLayout.module.scss';

const DEFAULT_LANDING_THEME = 'dark';

interface LandingLayoutProps {
  children: React.ReactNode;
}

export const LandingLayout: React.FC<LandingLayoutProps> = ({ children }) => (
  <div className={s.root} id="themed" data-theme={DEFAULT_LANDING_THEME}>
    <div className={s.background}>
      <LandingHeader className={s.header} />
      <main className={s.content}>{children}</main>
    </div>
    <LandingFooter className={s.footer} />
  </div>
);
