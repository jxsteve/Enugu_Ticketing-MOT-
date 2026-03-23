import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className,
  id,
  ...rest
}) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`${styles.wrapper} ${error ? styles.error : ''} ${className ?? ''}`}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.inputContainer}>
        {icon && <span className={styles.iconWrapper}>{icon}</span>}
        <input
          id={inputId}
          className={`${styles.input} ${icon ? styles.hasIcon : ''}`}
          {...rest}
        />
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};
