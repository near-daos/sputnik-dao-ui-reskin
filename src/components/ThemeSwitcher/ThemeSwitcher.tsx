import React from 'react';
import cn from 'classnames';
import { Theme } from 'types/theme';

import light from 'images/light-switch-icons.svg';
import dark from 'images/dark-switch-icons.svg';
import s from './ThemeSwitcher.module.scss';

const CHECKED_THEME = Theme.Dark;

type ThemeSwitcherProps = {
  className?: string;
  value: Theme;
  onChange: (value: boolean) => void;
};

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  className,
  value,
  onChange,
}) => (
  <div className={cn(s.root, className)}>
    <label className={s.label} htmlFor="theme-switcher">
      <input
        id="theme-switcher"
        className={s.input}
        type="checkbox"
        checked={value === CHECKED_THEME}
        onChange={(): void => onChange(!value)}
      />
      <img
        src={light}
        alt={light}
        className={cn(s.light, {
          [s.show]: value,
        })}
      />
      <img
        src={dark}
        alt="dark"
        className={cn(s.dark, {
          [s.show]: !value,
        })}
      />
      <span className={s.button} />
    </label>
  </div>
);

export default ThemeSwitcher;
