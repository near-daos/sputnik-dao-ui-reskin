import React, { FormEvent } from 'react';
import cn from 'classnames';

import { TextField } from 'components/UILib/TextField';
import { SvgIcon } from 'components/UILib/SvgIcon';
import styles from './SearchBar.module.scss';

export interface SearchBarProps {
  className?: string;
  value: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  placeholder?: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  className,
  value,
  name,
  onChange,
  placeholder,
  size = 'sm',
  onSubmit,
}) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (onSubmit) {
      onSubmit(value);
    }
  };
  const handleClear = () => {
    onChange('');
  };

  return (
    <form className={cn(styles.root, className)} onSubmit={handleSubmit}>
      <TextField
        type="number"
        leftElementClassName={styles.buttonWrapper}
        rightElementClassName={styles.buttonWrapper}
        leftElement={
          <button type="submit" className={cn(styles.button, styles.left)}>
            <SvgIcon icon="search" className={styles.icon} size={18} />
          </button>
        }
        rightElement={
          value.length > 0 ? (
            <button
              type="button"
              className={cn(styles.button, styles.right)}
              onClick={handleClear}
            >
              <SvgIcon icon="close" className={styles.icon} />
            </button>
          ) : undefined
        }
        inputClassName={styles.input}
        variant={size}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </form>
  );
};

export default SearchBar;
