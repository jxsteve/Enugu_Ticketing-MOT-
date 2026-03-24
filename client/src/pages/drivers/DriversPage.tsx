import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Clock,
  ShieldBan,
  Car,
  Bus,
  Truck,
  Bike,
} from 'lucide-react';
import { driverService } from '@/services/driverService';
import type { Driver } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { usePagination } from '@/hooks/usePagination';
import { SearchBar } from '@/components/ui/SearchBar';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Table, type Column } from '@/components/ui/Table';
import { getComplianceBadgeVariant } from '@/utils/status';
import styles from './DriversPage.module.css';

interface DriverOverview {
  total: number;
  compliant: number;
  nonCompliant: number;
  pendingReview: number;
  blacklisted: number;
  vehicleTypes: Record<string, number>;
}

function computeOverview(drivers: Driver[]): DriverOverview {
  const overview: DriverOverview = {
    total: drivers.length,
    compliant: 0,
    nonCompliant: 0,
    pendingReview: 0,
    blacklisted: 0,
    vehicleTypes: {},
  };

  for (const d of drivers) {
    switch (d.compliance_status) {
      case 'Compliant': overview.compliant++; break;
      case 'Non-Compliant': overview.nonCompliant++; break;
      case 'Pending Review': overview.pendingReview++; break;
      case 'Blacklisted': overview.blacklisted++; break;
    }
    overview.vehicleTypes[d.vehicle_type] = (overview.vehicleTypes[d.vehicle_type] || 0) + 1;
  }

  return overview;
}

const VEHICLE_ICONS: Record<string, React.ReactNode> = {
  Car: <Car size={14} />,
  Bus: <Bus size={14} />,
  Truck: <Truck size={14} />,
  Motorcycle: <Bike size={14} />,
  Tricycle: <Bike size={14} />,
};

export const DriversPage: React.FC = () => {
  useDocumentTitle('Drivers');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { page, pageSize, setPage } = usePagination();

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [allDrivers, setAllDrivers] = useState<Driver[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [overviewLoading, setOverviewLoading] = useState(true);

  const isAdmin = user?.role === 'Admin' || user?.role === 'Supervisor';

  // Fetch all drivers for overview stats (admin only)
  useEffect(() => {
    if (!isAdmin) {
      setOverviewLoading(false);
      return;
    }
    driverService
      .getDrivers(1, 9999)
      .then((res) => setAllDrivers(res.data))
      .catch(console.error)
      .finally(() => setOverviewLoading(false));
  }, [isAdmin]);

  const overview = useMemo(() => computeOverview(allDrivers), [allDrivers]);

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

  const complianceRate = overview.total > 0
    ? Math.round((overview.compliant / overview.total) * 100)
    : 0;

  const columns: Column<Record<string, unknown>>[] = [
    { key: 'full_name', header: 'Name' },
    {
      key: 'plate_number',
      header: 'Plate Number',
      render: (row) => (
        <span className={styles.plateText}>{row.plate_number as string}</span>
      ),
    },
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
        <h1 className={styles.pageTitle}>Driver Registry</h1>
        <span className={styles.count}>{total} total</span>
      </div>

      {/* Overview Section — Admin/Supervisor only */}
      {isAdmin && (
        <>
          {overviewLoading ? (
            <div className={styles.overviewLoading}><Spinner size="sm" /></div>
          ) : (
            <div className={styles.overview}>
              {/* Compliance Stats */}
              <div className={styles.statsRow}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <Users size={16} />
                  </div>
                  <div className={styles.statBody}>
                    <span className={styles.statValue}>{overview.total.toLocaleString()}</span>
                    <span className={styles.statLabel}>Total Drivers</span>
                  </div>
                </div>

                <div className={`${styles.statCard} ${styles.statSuccess}`}>
                  <div className={`${styles.statIcon} ${styles.iconSuccess}`}>
                    <ShieldCheck size={16} />
                  </div>
                  <div className={styles.statBody}>
                    <span className={styles.statValue}>{overview.compliant}</span>
                    <span className={styles.statLabel}>Compliant</span>
                  </div>
                  <span className={styles.statPercent}>{complianceRate}%</span>
                </div>

                <div className={`${styles.statCard} ${styles.statDanger}`}>
                  <div className={`${styles.statIcon} ${styles.iconDanger}`}>
                    <ShieldAlert size={16} />
                  </div>
                  <div className={styles.statBody}>
                    <span className={styles.statValue}>{overview.nonCompliant}</span>
                    <span className={styles.statLabel}>Non-Compliant</span>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={`${styles.statIcon} ${styles.iconWarning}`}>
                    <Clock size={16} />
                  </div>
                  <div className={styles.statBody}>
                    <span className={styles.statValue}>{overview.pendingReview}</span>
                    <span className={styles.statLabel}>Pending Review</span>
                  </div>
                </div>

                {overview.blacklisted > 0 && (
                  <div className={`${styles.statCard} ${styles.statBlacklisted}`}>
                    <div className={`${styles.statIcon} ${styles.iconBlacklisted}`}>
                      <ShieldBan size={16} />
                    </div>
                    <div className={styles.statBody}>
                      <span className={styles.statValue}>{overview.blacklisted}</span>
                      <span className={styles.statLabel}>Blacklisted</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Vehicle Type Breakdown */}
              <div className={styles.vehicleBreakdown}>
                <span className={styles.breakdownLabel}>By Vehicle Type</span>
                <div className={styles.vehicleTags}>
                  {Object.entries(overview.vehicleTypes)
                    .sort((a, b) => b[1] - a[1])
                    .map(([type, count]) => (
                      <div key={type} className={styles.vehicleTag}>
                        <span className={styles.vehicleTagIcon}>
                          {VEHICLE_ICONS[type] || <Car size={14} />}
                        </span>
                        <span className={styles.vehicleTagName}>{type}</span>
                        <span className={styles.vehicleTagCount}>{count}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

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
          <div className={styles.tableWrapper}>
            <Table
              columns={columns}
              data={drivers as unknown as Record<string, unknown>[]}
              emptyMessage="No drivers found"
              onRowClick={(row) => {
                const id = (row as unknown as Driver).id;
                if (id) navigate(`/drivers/${id}`);
              }}
            />
          </div>

          {/* Mobile card rows */}
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
                type="button"
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
                type="button"
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
