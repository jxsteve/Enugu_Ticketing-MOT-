import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Placeholder data - replace with real API data
const placeholderData = [
  { date: 'Mon', tickets: 12 },
  { date: 'Tue', tickets: 19 },
  { date: 'Wed', tickets: 8 },
  { date: 'Thu', tickets: 15 },
  { date: 'Fri', tickets: 22 },
  { date: 'Sat', tickets: 6 },
  { date: 'Sun', tickets: 3 },
];

export const EnforcementTrendChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={placeholderData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 12 }} />
        <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            background: '#1A2332',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#F1F5F9',
          }}
        />
        <Line
          type="monotone"
          dataKey="tickets"
          name="Tickets Issued"
          stroke="#F59E0B"
          strokeWidth={2}
          dot={{ fill: '#F59E0B', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
