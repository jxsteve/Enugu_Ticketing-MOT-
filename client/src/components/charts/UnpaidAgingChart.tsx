import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { UnpaidAging } from '@/types';

interface UnpaidAgingChartProps {
  data: UnpaidAging[];
}

export const UnpaidAgingChart: React.FC<UnpaidAgingChartProps> = ({ data }) => {
  if (data.length === 0) {
    return <div style={{ textAlign: 'center', color: '#94A3B8', padding: '2rem' }}>No data</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="range" tick={{ fill: '#94A3B8', fontSize: 12 }} />
        <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            background: '#1A2332',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#F1F5F9',
          }}
          formatter={(value: number, name: string) => {
            if (name === 'amount') return `\u20A6${value.toLocaleString()}`;
            return value;
          }}
        />
        <Bar dataKey="count" name="Tickets" fill="#EF4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
