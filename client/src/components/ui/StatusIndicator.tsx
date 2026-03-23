import React from 'react';
import styles from './StatusIndicator.module.css';

type ComplianceStatus = 'compliant' | 'nonCompliant' | 'pending' | 'expired';

interface StatusIndicatorProps {
  status: ComplianceStatus;
  label: string;
  className?: string;
}

const statusClassMap: Record<ComplianceStatus, string> = {
  compliant: styles.compliant,
  nonCompliant: styles.nonCompliant,
  pending: styles.pending,
  expired: styles.expired,
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  className,
}) => {
  return (
    <span className={`${styles.wrapper} ${statusClassMap[status]} ${className ?? ''}`}>
      <span className={styles.dot} />
      <span className={styles.text}>{label}</span>
    </span>
  );
};
