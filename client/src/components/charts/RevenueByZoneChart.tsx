import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { RevenueByZone } from '@/types';

interface RevenueByZoneChartProps {
  data: RevenueByZone[];
}

export const RevenueByZoneChart: React.FC<RevenueByZoneChartProps> = ({ data }) => {
  if (data.length === 0) {
    return <div style={{ textAlign: 'center', color: '#94A3B8', padding: '2rem' }}>No data</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis
          dataKey="zone"
          tick={{ fill: '#94A3B8', fontSize: 11 }}
          angle={-30}
          textAnchor="end"
          height={60}
        />
        <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            background: '#1A2332',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#F1F5F9',
          }}
          formatter={(value: number) => `\u20A6${value.toLocaleString()}`}
        />
        <Legend wrapperStyle={{ color: '#94A3B8', fontSize: '0.875rem' }} />
        <Bar dataKey="amount_issued" name="Issued" fill="#F59E0B" radius={[4, 4, 0, 0]} />
        <Bar dataKey="amount_collected" name="Collected" fill="#22C55E" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
