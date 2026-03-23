import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ComplianceOverview } from '@/types';

interface ComplianceDonutChartProps {
  data: ComplianceOverview;
}

const COLORS: Record<string, string> = {
  Compliant: '#22C55E',
  'Non-Compliant': '#EF4444',
  Pending: '#F59E0B',
  Blacklisted: '#7C3AED',
};

export const ComplianceDonutChart: React.FC<ComplianceDonutChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Compliant', value: data.compliant },
    { name: 'Non-Compliant', value: data.non_compliant },
    { name: 'Pending', value: data.pending },
    { name: 'Blacklisted', value: data.blacklisted },
  ].filter((entry) => entry.value > 0);

  if (chartData.length === 0) {
    return <div style={{ textAlign: 'center', color: '#94A3B8', padding: '2rem' }}>No data</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
        >
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={COLORS[entry.name] || '#64748B'} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: '#1A2332',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#F1F5F9',
          }}
        />
        <Legend
          wrapperStyle={{ color: '#94A3B8', fontSize: '0.875rem' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
