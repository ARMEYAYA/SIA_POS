import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
 
/* Data sets per period */
const MONTHLY_DATA = [
  { label: 'Week 1', value: 62 },
  { label: '',       value: 75 },
  { label: '',       value: 88 },
  { label: 'Week 2', value: 70 },
  { label: '',       value: 55 },
  { label: '',       value: 65 },
  { label: 'Week 3', value: 80 },
  { label: '',       value: 90 },
  { label: '',       value: 85 },
  { label: 'Week 4', value: 78 },
  { label: '',       value: 88 },
];
 
const QUARTERLY_DATA = [
  { label: 'Jan-Mar', value: 72 },
  { label: '',        value: 65 },
  { label: 'Apr-Jun', value: 80 },
  { label: '',        value: 88 },
  { label: 'Jul-Sep', value: 75 },
  { label: '',        value: 90 },
  { label: 'Oct-Dec', value: 95 },
];
 
const YEARLY_DATA = [
  { label: 'Jan', value: 40 },
  { label: 'Feb', value: 55 },
  { label: 'Mar', value: 48 },
  { label: 'Apr', value: 60 },
  { label: 'May', value: 72 },
  { label: 'Jun', value: 68 },
  { label: 'Jul', value: 75 },
  { label: 'Aug', value: 82 },
  { label: 'Sep', value: 78 },
  { label: 'Oct', value: 88 },
  { label: 'Nov', value: 92 },
  { label: 'Dec', value: 98 },
];
 
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length && label) {
    return (
      <div style={{
        background: '#fff',
        border: '1px solid #FED700',
        borderRadius: 8,
        padding: '8px 14px',
        fontFamily: 'Inter, sans-serif',
        fontSize: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}>
        <p style={{ fontWeight: 700, marginBottom: 2, color: '#000' }}>{label}</p>
        <p style={{ color: '#8B333D', fontWeight: 600 }}>
          {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};
 
export default function SalesChart({ period }) {
  const data = useMemo(() => {
    if (period === 'Quarterly') return QUARTERLY_DATA;
    if (period === 'Yearly')    return YEARLY_DATA;
    return MONTHLY_DATA;
  }, [period]);
 
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
      >
        <defs>
          <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#FFF28D" stopOpacity={0.49} />
            <stop offset="100%" stopColor="#FFFFFF"  stopOpacity={1} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(0,0,0,0.06)"
          vertical={false}
        />
        <XAxis
          dataKey="label"
          tick={{ fontFamily: 'Inter', fontSize: 13, fill: 'rgba(0,0,0,0.6)', fontWeight: 500 }}
          axisLine={{ stroke: 'rgba(0,0,0,0.4)' }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => `${v}%`}
          tick={{ fontFamily: 'Inter', fontSize: 13, fill: 'rgba(0,0,0,0.6)', fontWeight: 500 }}
          axisLine={false}
          tickLine={false}
          domain={[0, 100]}
          ticks={[0, 20, 40, 60, 80, 100]}
          tickCount={6}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#FED700"
          strokeWidth={2}
          fill="url(#salesGradient)"
          dot={false}
          activeDot={{
            r: 5,
            fill: '#FED700',
            stroke: '#8B333D',
            strokeWidth: 2,
          }}
          animationDuration={700}
          animationEasing="ease-in-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}