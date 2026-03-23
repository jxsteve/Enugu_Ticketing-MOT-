import { useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import styles from './TopBar.module.css';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/drivers': 'Driver Registry',
  '/enforcement': 'Enforcement',
  '/tickets': 'Tickets',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

export function TopBar() {
  const location = useLocation();
  const basePath = '/' + location.pathname.split('/')[1];
  const title = pageTitles[basePath] || 'Enugu MOT';

  return (
    <header className={styles.topbar}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.actions}>
        <button className={styles.iconBtn}>
          <Bell size={20} />
        </button>
      </div>
    </header>
  );
}
