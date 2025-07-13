import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface WinRatePieChartProps {
  winRate: number;
}

const WinRatePieChart: React.FC<WinRatePieChartProps> = ({ winRate }) => {
  const lossRate = 100 - winRate;
  const data = [
    { name: 'Winning Trades', value: winRate },
    { name: 'Losing Trades', value: lossRate },
  ];
  const COLORS = ['#4CAF50', '#F44336'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default WinRatePieChart;