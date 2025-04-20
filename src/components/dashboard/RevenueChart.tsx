import React from 'react';
import { 
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer, 
  Tooltip, 
  Legend
} from 'recharts';
import { useFinancialSummary } from '@/hooks/use-api';
import { Skeleton } from '@/components/ui/skeleton';

// Custom tooltip to show value in AED format
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md">
        <p className="font-medium">{`${payload[0].name}: ${payload[0].value.toLocaleString()} AED`}</p>
      </div>
    );
  }
  return null;
};

export function RevenueChart() {
  const { data: financialSummary, isLoading } = useFinancialSummary();
  
  // Prepare data for the chart
  const pieData = financialSummary ? [
    { 
      name: 'Revenue', 
      value: financialSummary.totalRevenue || 0, 
      color: '#8b5cf6' 
    },
    { 
      name: 'Expenses', 
      value: financialSummary.totalExpenses || 0, 
      color: '#ef4444' 
    },
  ] : [];

  if (isLoading) {
    return (
      <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
        <h3 className="font-medium text-lg mb-6">Revenue vs Expenses</h3>
        <div className="h-64 flex items-center justify-center">
          <Skeleton className="h-40 w-40 rounded-full" />
        </div>
      </div>
    );
  }

  // If we have no data or both values are 0, show an empty state
  if (!financialSummary || (financialSummary.totalRevenue === 0 && financialSummary.totalExpenses === 0)) {
    return (
      <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
        <h3 className="font-medium text-lg mb-6">Revenue vs Expenses</h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No financial data available yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
      <h3 className="font-medium text-lg mb-6">Revenue vs Expenses</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              innerRadius={40} // Make it a donut chart for a more modern look
              fill="#8884d8"
              dataKey="value"
              paddingAngle={2} // Add some space between slices
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
