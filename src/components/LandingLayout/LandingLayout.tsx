import React from 'react';
import { Button } from '../UILib';
import { MothershipLogo } from '../MothershipLogo/MothershipLogo';

import s from './LandingLayout.module.scss';

const DEFAULT_LANDING_THEME = 'dark';

interface LandingLayoutProps {
  children: React.ReactNode;
}

export const LandingLayout: React.FC<LandingLayoutProps> = ({ children }) => (
  <div className={s.root} id="themed" data-theme={DEFAULT_LANDING_THEME}>
    <header className={s.header}>
      <a href="/" className={s.logo}>
        <MothershipLogo className={s.logoIcon} />
        <span className={s.logoText}>Mothership</span>
      </a>
      <nav>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/">How it works</a>
        </li>
        <li>
          <a href="/">Developers</a>
        </li>
        <li>
          <a href="/">Community</a>
        </li>
      </nav>
      <Button>Connect to Mothership</Button>
    </header>
    <main className={s.content}>{children}</main>
    <footer className={s.footer}>
      © Mothership 2021. All rights reserved
      <form>
        <fieldset>
          <legend>Stay in touch</legend>
          <input type="text" placeholder="Your email" />
          <button type="submit">Submit</button>
        </fieldset>
      </form>
      <nav>
        <li>
          <a href="/">Privacy Police</a>
        </li>
        <li>
          <a href="/">Terms of Use</a>
        </li>
        <li>
          <a href="/">FAQ</a>
        </li>
      </nav>
    </footer>
  </div>
);
