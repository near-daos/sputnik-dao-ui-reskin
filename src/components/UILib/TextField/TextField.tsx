import React, { InputHTMLAttributes, useState } from 'react';
import cn from 'classnames';
import SvgIcon from '../SvgIcon/SvgIcon';

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
}

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
}: TextFieldProps) => {
  const [focus, setFocus] = useState<boolean>(false);

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
              id={`input-${name}`}
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
              id={`input-${name}`}
              type={type}
              className={cn(styles.input, styles[variant], inputClassName)}
              value={value}
              placeholder={placeholder}
              onChange={(e): void => onChange(e.currentTarget.value, name)}
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
            htmlFor={`input-${name}`}
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

      {!error && helperText && (
        <p className={styles.helperText}>{helperText}</p>
      )}
      {error && (
        <p className={styles.error}>
          <SvgIcon className={styles.errorIcon} size={18} icon="circle-close" />
          <span className={styles.errorMessage}>{error}</span>
        </p>
      )}
      {maxLength && (
        <p className={styles.length}>{`${value.length}/${maxLength}`}</p>
      )}
    </div>
  );
};

export default TextField;
