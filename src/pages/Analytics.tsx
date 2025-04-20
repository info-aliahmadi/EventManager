import React, { useState } from 'react';
import { Calendar, TrendingUp, Users, DollarSign, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

// Mock trend data (weekly)
const trendData = [
  { week: 'Week 1', attendance: 110, revenue: 22000, profitMargin: 42 },
  { week: 'Week 2', attendance: 125, revenue: 25000, profitMargin: 44 },
  { week: 'Week 3', attendance: 138, revenue: 27600, profitMargin: 46 },
  { week: 'Week 4', attendance: 130, revenue: 26000, profitMargin: 45 },
  { week: 'Week 5', attendance: 140, revenue: 28000, profitMargin: 45 },
  { week: 'Week 6', attendance: 155, revenue: 31000, profitMargin: 48 },
  { week: 'Week 7', attendance: 162, revenue: 32400, profitMargin: 49 },
  { week: 'Week 8', attendance: 170, revenue: 34000, profitMargin: 50 },
];

// Mock revenue sources data
const revenueSourcesData = [
  { name: 'Entrance Fees', value: 45, color: '#8b5cf6' },
  { name: 'Bar Sales', value: 30, color: '#3b82f6' },
  { name: 'Sponsorships', value: 15, color: '#10b981' },
  { name: 'Special Services', value: 10, color: '#f59e0b' },
];

// Mock expense breakdown data
const expenseBreakdownData = [
  { name: 'Venue Rental', value: 35, color: '#ef4444' },
  { name: 'Staff Costs', value: 25, color: '#f59e0b' },
  { name: 'Marketing', value: 15, color: '#3b82f6' },
  { name: 'Equipment', value: 10, color: '#8b5cf6' },
  { name: 'Misc. Expenses', value: 15, color: '#6b7280' },
];

// KPI metrics
const kpiMetrics = [
  {
    title: 'Average Attendance',
    value: '142',
    trend: '+12%',
    icon: <Users className="h-4 w-4" />,
    description: 'Per event',
  },
  {
    title: 'Average Revenue',
    value: '28,250 AED',
    trend: '+15%',
    icon: <DollarSign className="h-4 w-4" />,
    description: 'Per event',
  },
  {
    title: 'Profit Margin',
    value: '46.5%',
    trend: '+4.2%',
    icon: <Percent className="h-4 w-4" />,
    description: 'Average',
  },
  {
    title: 'Revenue Growth',
    value: '+8.3%',
    trend: 'Monthly',
    icon: <TrendingUp className="h-4 w-4" />,
    description: 'Month over month',
  },
];

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('last8weeks');

  return (
    <div className="space-y-6 w-full mx-auto">
      <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <Calendar className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last8weeks">Last 8 Weeks</SelectItem>
            <SelectItem value="last3months">Last 3 Months</SelectItem>
            <SelectItem value="last6months">Last 6 Months</SelectItem>
            <SelectItem value="ytd">Year to Date</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                {metric.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <span className={`mr-1 ${metric.trend.includes('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {metric.trend}
                </span>
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>
            Track key metrics over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trendData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="attendance" 
                  name="Attendance" 
                  stroke="#8b5cf6" 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="revenue" 
                  name="Revenue (AED)" 
                  stroke="#10b981" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Revenue & Expense Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
            <CardDescription>
              Revenue sources by percentage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueSourcesData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {revenueSourcesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>
              Expense categories by percentage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseBreakdownData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {expenseBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics; 