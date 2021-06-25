import cn from 'classnames';
import { debounce } from 'lodash';
import React, { FormEvent, useCallback, useState } from 'react';

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
  debounceTime?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
  className,
  value,
  name,
  onChange,
  placeholder,
  size = 'sm',
  onSubmit,
  debounceTime = 0,
}) => {
  const [localVal, setLocalVal] = useState(value);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (onSubmit) {
      onSubmit(value);
    }
  };

  const handleClear = () => {
    onChange('');
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnChange = useCallback(
    debounce((val: string) => {
      onChange(val);
    }, debounceTime),
    [debounceTime],
  );

  const handleChange = useCallback(
    (val: string) => {
      setLocalVal(val);
      debouncedOnChange(val);
    },
    [debouncedOnChange],
  );

  function renderClearButton() {
    if (value.length > 0) {
      return (
        <button
          type="button"
          className={cn(styles.button, styles.right)}
          onClick={handleClear}
        >
          <SvgIcon icon="close" className={styles.icon} />
        </button>
      );
    }

    return undefined;
  }

  return (
    <form className={cn(styles.root, className)} onSubmit={handleSubmit}>
      <TextField
        type="text"
        leftElementClassName={styles.buttonWrapper}
        rightElementClassName={styles.buttonWrapper}
        leftElement={
          <button type="submit" className={cn(styles.button, styles.left)}>
            <SvgIcon icon="search" className={styles.icon} size={18} />
          </button>
        }
        rightElement={renderClearButton()}
        inputClassName={styles.input}
        variant={size}
        name={name}
        value={localVal}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </form>
  );
};

export default SearchBar;
