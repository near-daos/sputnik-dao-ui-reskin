import React, { ReactNode, useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import styles from './Dropdown.module.scss';

type DropdownProps = {
  className?: string;
  dropdownClassName?: string;
  children: ReactNode;
  headerElement: JSX.Element;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  closeable?: boolean;
};

const Dropdown: React.FC<DropdownProps> = ({
  className,
  children,
  headerElement,
  dropdownClassName,
  isOpen: initialIsOpen = false,
  onOpen,
  onClose,
  closeable = true,
}) => {
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        isOpen &&
        ((e.target && !listRef.current?.contains(e.target as Node)) ||
          closeable)
      ) {
        setIsOpen(false);

        if (onClose) {
          onClose();
        }
      }
    };

    document.addEventListener('click', handler);

    return () => document.removeEventListener('click', handler);
  }, [closeable, isOpen, setIsOpen, onClose]);

  useEffect(() => {
    setIsOpen(initialIsOpen);
  }, [initialIsOpen]);

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    setIsOpen(!isOpen);

    if (onOpen) {
      onOpen();
    }
  };

  return (
    <div className={cn(styles.root, className)} ref={listRef}>
      <button type="button" className={styles.headerElem} onClick={handleOpen}>
        {headerElement}
      </button>
      {isOpen && (
        <div className={cn(styles.dropdown, dropdownClassName)}>{children}</div>
      )}
    </div>
  );
};

export default Dropdown;
