import cn from 'classnames';
import { isNumber } from 'lodash';
import React, { InputHTMLAttributes, useState } from 'react';

import { SvgIcon } from '../SvgIcon';
import { getStringSizeInBytes } from '../../../utils/getStringSizeInBytes';

import styles from './TextField.module.scss';

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  className?: string;
  inputClassName?: string;
  inputContainerClassName?: string;
  leftElement?: JSX.Element;
  leftElementClassName?: string;
  rightElement?: JSX.Element;
  rightElementClassName?: string;
  labelClassName?: string;
  placeholder?: string;
  multiline?: boolean;
  label?: string;
  name: string;
  value: string;
  disabled?: boolean;
  helperText?: string;
  error?: string | JSX.Element;
  success?: boolean;
  type?: 'text' | 'number' | 'email' | 'password';
  variant?: 'sm' | 'md' | 'lg';
  maxLength?: number;
  onChange: (value: string, name: string) => void;
  id?: string;
  maxLengthIsInBytes?: boolean;
}

const validChars = /[0-9,]/;

const TextField: React.FC<TextFieldProps> = ({
  className,
  inputContainerClassName,
  leftElement,
  leftElementClassName,
  rightElement,
  rightElementClassName,
  inputClassName,
  labelClassName,
  placeholder,
  multiline = false,
  label,
  name,
  value,
  disabled = false,
  error,
  success = false,
  type = 'text',
  variant = 'md',
  maxLength,
  helperText,
  onChange,
  id = `input-${name}`,
  maxLengthIsInBytes,
}: TextFieldProps) => {
  const [focus, setFocus] = useState<boolean>(false);

  function getCharsUsed() {
    return maxLengthIsInBytes ? getStringSizeInBytes(value) : value.length;
  }

  function renderError() {
    if (error) {
      return (
        <p className={styles.error}>
          <SvgIcon className={styles.errorIcon} size={18} icon="circle-close" />
          <span className={styles.errorMessage}>{error}</span>
        </p>
      );
    }

    return null;
  }

  function renderMaxLengthInfo() {
    if (isNumber(maxLength)) {
      // stub is needed to properly place length info
      const stub = !error && !helperText ? <div /> : null;

      return (
        <>
          {stub}
          <p className={styles.length}>{`${getCharsUsed()}/${maxLength}`}</p>
        </>
      );
    }

    return null;
  }

  function renderHelperText() {
    if (!error && helperText) {
      return (
        <p
          className={cn(styles.helperText, {
            [styles.short]: multiline && maxLength,
          })}
        >
          {helperText}
        </p>
      );
    }

    return null;
  }

  return (
    <div className={cn(styles.root, className)}>
      <div
        className={cn(styles.container, {
          [styles.withError]: error,
          [styles.success]: success,
          [styles.disabled]: disabled,
          [styles.focus]: focus,
          [styles.filled]: value,
        })}
      >
        {leftElement && (
          <div className={cn(styles.leftElement, leftElementClassName)}>
            {leftElement}
          </div>
        )}
        <div className={cn(styles.inputContainer, inputContainerClassName)}>
          {multiline ? (
            <textarea
              id={id}
              className={cn(styles.input, styles.textarea, inputClassName)}
              value={value}
              placeholder={placeholder}
              onChange={(e): void => onChange(e.currentTarget.value, name)}
              onFocus={(): void => setFocus(true)}
              onBlur={(): void => setFocus(false)}
              disabled={disabled}
              maxLength={maxLength}
            />
          ) : (
            <input
              id={id}
              type={type}
              name={name}
              className={cn(styles.input, styles[variant], inputClassName)}
              value={value}
              placeholder={placeholder}
              onKeyPress={(e) => {
                if (type === 'number' && !validChars.test(e.key)) {
                  e.preventDefault();
                }
              }}
              onChange={(e): void => {
                onChange(e.currentTarget.value, name);
              }}
              onFocus={(): void => setFocus(true)}
              onBlur={(): void => setFocus(false)}
              disabled={disabled}
            />
          )}
          <label
            className={cn(
              styles.label,
              styles[variant],
              styles.floatingLabel,
              labelClassName,
            )}
            htmlFor={id}
          >
            {label}
          </label>
          <fieldset className={styles.border} aria-hidden="true">
            <legend className={styles.legend}>
              {label && <span>{label}</span>}
            </legend>
          </fieldset>
          {rightElement && (
            <div className={cn(styles.rightElement, rightElementClassName)}>
              {rightElement}
            </div>
          )}
        </div>
      </div>
      <div className={styles.infoSection}>
        {renderHelperText()}
        {renderError()}
        {renderMaxLengthInfo()}
      </div>
    </div>
  );
};

export default TextField;
