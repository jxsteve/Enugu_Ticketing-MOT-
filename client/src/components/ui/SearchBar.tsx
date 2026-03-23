import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value: controlledValue,
  onChange,
  placeholder = 'Search...',
  debounceMs = 300,
  className,
}) => {
  const [internalValue, setInternalValue] = useState(controlledValue ?? '');
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  const debouncedOnChange = useCallback(
    (val: string) => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onChange(val), debounceMs);
    },
    [onChange, debounceMs],
  );

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInternalValue(val);
    debouncedOnChange(val);
  };

  const handleClear = () => {
    setInternalValue('');
    onChange('');
  };

  return (
    <div className={`${styles.wrapper} ${className ?? ''}`}>
      <span className={styles.icon}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>
      <input
        className={styles.input}
        type="text"
        value={internalValue}
        onChange={handleChange}
        placeholder={placeholder}
      />
      {internalValue && (
        <button className={styles.clearButton} onClick={handleClear} aria-label="Clear search">
          &times;
        </button>
      )}
    </div>
  );
};
