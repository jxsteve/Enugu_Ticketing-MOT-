import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { LoginPage } from '@/pages/login/LoginPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { DriversPage } from '@/pages/drivers/DriversPage';
import { DriverDetailPage } from '@/pages/drivers/DriverDetailPage';
import { EnforcementPage } from '@/pages/enforcement/EnforcementPage';
import { TicketsPage } from '@/pages/tickets/TicketsPage';
import { TicketDetailPage } from '@/pages/tickets/TicketDetailPage';
import { ReportsPage } from '@/pages/reports/ReportsPage';
import { SettingsPage } from '@/pages/settings/SettingsPage';
import { AgentsPage } from '@/pages/agents/AgentsPage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* All authenticated users */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<ErrorBoundary><DashboardPage /></ErrorBoundary>} />
          <Route path="/tickets" element={<ErrorBoundary><TicketsPage /></ErrorBoundary>} />
          <Route path="/tickets/:id" element={<ErrorBoundary><TicketDetailPage /></ErrorBoundary>} />

          {/* Agent + Admin + Supervisor */}
          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Supervisor', 'Agent']} />}>
            <Route path="/enforcement" element={<ErrorBoundary><EnforcementPage /></ErrorBoundary>} />
          </Route>

          {/* Admin + Supervisor + Finance — not agents */}
          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Supervisor', 'Finance']} />}>
            <Route path="/drivers" element={<ErrorBoundary><DriversPage /></ErrorBoundary>} />
            <Route path="/drivers/:id" element={<ErrorBoundary><DriverDetailPage /></ErrorBoundary>} />
            <Route path="/reports" element={<ErrorBoundary><ReportsPage /></ErrorBoundary>} />
          </Route>

          {/* Admin only */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/agents" element={<ErrorBoundary><AgentsPage /></ErrorBoundary>} />
            <Route path="/settings" element={<ErrorBoundary><SettingsPage /></ErrorBoundary>} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
