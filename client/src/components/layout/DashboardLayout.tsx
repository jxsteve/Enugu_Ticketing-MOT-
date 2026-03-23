import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import styles from './DashboardLayout.module.css';

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`${styles.layout} ${collapsed ? styles.collapsed : ''}`}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className={styles.main}>
        <TopBar />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
