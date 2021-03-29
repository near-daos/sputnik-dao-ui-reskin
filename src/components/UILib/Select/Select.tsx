import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { SvgIcon } from 'components/UILib/SvgIcon';

import styles from './Select.module.scss';

export type SelectItem = {
  name: string;
  value: string;
};

export type SelectProps<T = unknown> = {
  className?: string;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  value: T | null;
  options: T[];
  pickLabel: (item: T) => string;
  pickValue: (item: T) => string;
  onChange: (item: T) => void;
};

const Select = <T,>({
  className,
  options,
  size = 'md',
  label,
  value,
  pickValue,
  pickLabel,
  onChange,
}: SelectProps<T>): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const ddRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [isOpen]);

  return (
    <div className={cn(styles.root, className)}>
      <button
        type="button"
        className={cn(styles.header, styles[size], {
          [styles.open]: isOpen,
        })}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {value && <p className={styles.value}>{pickLabel(value)}</p>}
        <p
          className={cn(styles.label, styles[size], {
            [styles.top]: value !== null || isOpen,
          })}
        >
          {label}
        </p>
        <div className={styles.arrowWrap}>
          <SvgIcon
            icon="dd-arrow"
            size={24}
            className={cn(styles.arrowIcon, {
              [styles.open]: isOpen,
            })}
          />
        </div>
        <fieldset
          className={cn(styles.border, {
            [styles.focus]: isOpen,
          })}
          aria-hidden="true"
        >
          <legend
            className={cn(styles.legend, {
              [styles.visible]: (value !== null || isOpen) && label,
            })}
          >
            <span>{label}</span>
          </legend>
        </fieldset>
      </button>
      {isOpen && (
        <div className={styles.dropdownWrapper} ref={ddRef}>
          {options.map((item, index) => (
            <button
              key={String(`select-item-${index}`)}
              type="button"
              className={styles.item}
              onClick={() => {
                onChange(item);
              }}
            >
              <span
                className={cn(styles.itemText, {
                  [styles.active]:
                    value && pickValue(value) === pickValue(item),
                })}
              >
                {pickLabel(item)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
