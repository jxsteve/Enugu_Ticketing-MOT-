import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Shield,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Landmark,
  UserCog,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';
import styles from './Sidebar.module.css';

const navItems: { to: string; icon: typeof LayoutDashboard; label: string; roles?: UserRole[] }[] = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/drivers', icon: Users, label: 'Drivers', roles: ['Admin', 'Supervisor', 'Finance'] },
  { to: '/enforcement', icon: Shield, label: 'Enforcement', roles: ['Admin', 'Supervisor', 'Agent'] },
  { to: '/tickets', icon: FileText, label: 'Tickets' },
  { to: '/reports', icon: BarChart3, label: 'Reports', roles: ['Admin', 'Supervisor', 'Finance'] },
  { to: '/agents', icon: UserCog, label: 'Agents', roles: ['Admin'] },
  { to: '/settings', icon: Settings, label: 'Settings', roles: ['Admin'] },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.logo}>
        <div className={styles.logoInner}>
          <div className={styles.logoMark}>
            <Landmark size={20} strokeWidth={1.6} />
          </div>
          {!collapsed && (
            <span className={styles.logoText}>
              Enugu <span>MOT</span>
            </span>
          )}
        </div>
        <button className={styles.toggle} onClick={onToggle}>
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {!collapsed && <div className={styles.sectionLabel}>Navigation</div>}

      <nav className={styles.nav}>
        {navItems
          .filter(({ roles }) => !roles || (user && roles.includes(user.role)))
          .map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <Icon size={19} strokeWidth={1.8} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        {!collapsed && user && (
          <div className={styles.userSection}>
            <div className={styles.userAvatar}>{initials}</div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{user.name}</div>
              <div className={styles.userRole}>{user.role}</div>
            </div>
          </div>
        )}
        <button className={styles.logoutBtn} onClick={logout}>
          <LogOut size={17} strokeWidth={1.8} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
