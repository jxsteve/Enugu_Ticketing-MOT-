import React, { useState } from 'react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import styles from './ReportsPage.module.css';

const REPORT_TYPES = [
  { value: 'compliance', label: 'Compliance Summary' },
  { value: 'revenue', label: 'Revenue Report' },
  { value: 'enforcement', label: 'Enforcement Activity' },
  { value: 'unpaid', label: 'Unpaid Tickets Aging' },
  { value: 'agent', label: 'Agent Performance' },
];

export const ReportsPage: React.FC = () => {
  useDocumentTitle('Reports');
  const [reportType, setReportType] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const handleGenerate = () => {
    alert(`Report generation not yet implemented.\n\nType: ${reportType}\nFrom: ${dateFrom}\nTo: ${dateTo}`);
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Reports</h1>

      <Card title="Generate Report">
        <div className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Report Type</label>
            <select
              className={styles.select}
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="">Select a report type...</option>
              {REPORT_TYPES.map((rt) => (
                <option key={rt.value} value={rt.value}>
                  {rt.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.dateRange}>
            <div className={styles.formGroup}>
              <label className={styles.label}>From</label>
              <input
                type="date"
                className={styles.dateInput}
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>To</label>
              <input
                type="date"
                className={styles.dateInput}
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>

          <Button
            variant="primary"
            onClick={handleGenerate}
            disabled={!reportType}
            className={styles.generateButton}
          >
            Generate Report
          </Button>
        </div>
      </Card>
    </div>
  );
};
