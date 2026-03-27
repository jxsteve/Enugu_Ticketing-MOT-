import { useLocation } from 'react-router-dom';
import { Bell, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import styles from './TopBar.module.css';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/drivers': 'Driver Registry',
  '/enforcement': 'Enforcement',
  '/tickets': 'Tickets',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

const pageDescriptions: Record<string, string> = {
  '/dashboard': 'Overview of operations and key metrics',
  '/drivers': 'Manage registered drivers and compliance',
  '/enforcement': 'Issue tickets and enforce compliance',
  '/tickets': 'Track and manage issued tickets',
  '/reports': 'Generate and export reports',
  '/settings': 'Configure system settings',
};

export function TopBar() {
  const location = useLocation();
  const { user } = useAuth();
  const basePath = '/' + location.pathname.split('/')[1];
  const title = pageTitles[basePath] || 'Enugu MOT';
  const description = pageDescriptions[basePath] || '';
  const isDetail = location.pathname.split('/').length > 2;

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <div className={styles.breadcrumb} aria-label="Breadcrumb" role="navigation">
          <span className={styles.breadcrumbRoot}>Enugu MOT</span>
          <ChevronRight size={14} className={styles.breadcrumbSep} />
          <span className={styles.breadcrumbCurrent}>{title}</span>
          {isDetail && (
            <>
              <ChevronRight size={14} className={styles.breadcrumbSep} />
              <span className={styles.breadcrumbDetail}>Detail</span>
            </>
          )}
        </div>
        {description && !isDetail && (
          <p className={styles.description}>{description}</p>
        )}
      </div>

      <div className={styles.actions}>
        <button
          className={styles.notificationBtn}
          aria-label="Notifications"
          type="button"
        >
          <Bell size={18} strokeWidth={1.8} />
          <span className={styles.notificationDot} aria-hidden="true" />
        </button>

        <div className={styles.divider} />

        <div className={styles.userChip}>
          <div className={styles.avatar}>{initials}</div>
          <span className={styles.userName}>{user?.name || 'User'}</span>
        </div>
      </div>
    </header>
  );
}
