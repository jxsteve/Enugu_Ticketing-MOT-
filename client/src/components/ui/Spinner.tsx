import React from 'react';
import styles from './Spinner.module.css';

type SpinnerSize = 'sm' | 'md' | 'lg';

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className }) => {
  return (
    <div
      className={`${styles.spinner} ${styles[size]} ${className ?? ''}`}
      role="status"
      aria-label="Loading"
    />
  );
};
