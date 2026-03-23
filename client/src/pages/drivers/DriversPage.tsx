import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { driverService } from '@/services/driverService';
import type { Driver } from '@/types';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { usePagination } from '@/hooks/usePagination';
import { SearchBar } from '@/components/ui/SearchBar';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Table, type Column } from '@/components/ui/Table';
import { getComplianceBadgeVariant } from '@/utils/status';
import styles from './DriversPage.module.css';

export const DriversPage: React.FC = () => {
  useDocumentTitle('Drivers');
  const navigate = useNavigate();
  const { page, pageSize, setPage } = usePagination();

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchDrivers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await driverService.getDrivers(page, pageSize, search || undefined);
      setDrivers(result.data);
      setTotal(result.total);
      setTotalPages(result.total_pages);
    } catch (err) {
      console.error('Failed to fetch drivers:', err);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const columns: Column<Record<string, unknown>>[] = [
    { key: 'full_name', header: 'Name' },
    { key: 'plate_number', header: 'Plate Number' },
    { key: 'vehicle_type', header: 'Vehicle Type' },
    { key: 'phone_number', header: 'Phone' },
    {
      key: 'compliance_status',
      header: 'Compliance',
      render: (row) => (
        <Badge
          label={row.compliance_status as string}
          variant={getComplianceBadgeVariant(row.compliance_status as Driver['compliance_status'])}
        />
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Drivers</h1>
        <span className={styles.count}>{total} total</span>
      </div>

      <SearchBar
        placeholder="Search by name, plate number, or phone..."
        onChange={handleSearch}
        className={styles.search}
      />

      {loading ? (
        <div className={styles.loading}>
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <div
            className={styles.tableWrapper}
            onClick={(e) => {
              const row = (e.target as HTMLElement).closest('tr');
              if (!row || !row.dataset.index) return;
              const idx = parseInt(row.dataset.index, 10);
              const driver = drivers[idx];
              if (driver) navigate(`/drivers/${driver.id}`);
            }}
          >
            <Table
              columns={columns}
              data={drivers.map((d, i) => ({ ...d, _index: i })) as unknown as Record<string, unknown>[]}
              emptyMessage="No drivers found"
            />
          </div>

          {/* Simple row-click navigation via table rows */}
          <div className={styles.clickableRows}>
            {drivers.map((driver) => (
              <div
                key={driver.id}
                className={styles.driverRow}
                onClick={() => navigate(`/drivers/${driver.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/drivers/${driver.id}`)}
              >
                <span className={styles.driverName}>{driver.full_name}</span>
                <span className={styles.driverPlate}>{driver.plate_number}</span>
                <span className={styles.driverType}>{driver.vehicle_type}</span>
                <Badge
                  label={driver.compliance_status}
                  variant={getComplianceBadgeVariant(driver.compliance_status)}
                />
              </div>
            ))}
            {drivers.length === 0 && (
              <div className={styles.empty}>No drivers found</div>
            )}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageButton}
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              <span className={styles.pageInfo}>
                Page {page} of {totalPages}
              </span>
              <button
                className={styles.pageButton}
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
