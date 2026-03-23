import React from 'react';
import styles from './Badge.module.css';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  label: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  label,
  className,
}) => {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className ?? ''}`}>
      {label}
    </span>
  );
};
