import React, { useState } from 'react';
import { Download, FileText, Filter, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

// Mock financial data
const monthlyData = [
  { month: 'Jan', revenue: 35000, expenses: 18000, profit: 17000 },
  { month: 'Feb', revenue: 42000, expenses: 22000, profit: 20000 },
  { month: 'Mar', revenue: 38000, expenses: 19500, profit: 18500 },
  { month: 'Apr', revenue: 46000, expenses: 24000, profit: 22000 },
  { month: 'May', revenue: 32000, expenses: 17000, profit: 15000 },
  { month: 'Jun', revenue: 48000, expenses: 25000, profit: 23000 },
];

// Mock event performance data
const eventPerformance = [
  { 
    id: '1', 
    name: 'Friday Night Rumba', 
    count: 12, 
    totalRevenue: 120000, 
    totalExpenses: 65000, 
    totalProfit: 55000, 
    avgAttendance: 110,
    avgProfit: 4583
  },
  { 
    id: '2', 
    name: 'Saturday Exclusive', 
    count: 8, 
    totalRevenue: 160000, 
    totalExpenses: 80000, 
    totalProfit: 80000, 
    avgAttendance: 150,
    avgProfit: 10000
  },
  { 
    id: '3', 
    name: 'Monthly Salsa Night', 
    count: 3, 
    totalRevenue: 75000, 
    totalExpenses: 40000, 
    totalProfit: 35000, 
    avgAttendance: 200,
    avgProfit: 11667
  },
  { 
    id: '4', 
    name: 'Special Guest DJ', 
    count: 1, 
    totalRevenue: 35000, 
    totalExpenses: 20000, 
    totalProfit: 15000, 
    avgAttendance: 230,
    avgProfit: 15000
  },
];

const Reports = () => {
  const [timeRange, setTimeRange] = useState('ytd');

  return (
    <div className="space-y-6 w-full mx-auto">
      <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
        <h1 className="text-2xl font-semibold">Reports</h1>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ytd">Year to Date</SelectItem>
              <SelectItem value="last6months">Last 6 Months</SelectItem>
              <SelectItem value="last3months">Last 3 Months</SelectItem>
              <SelectItem value="lastmonth">Last Month</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="financial" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
          <TabsTrigger value="financial">Financial Overview</TabsTrigger>
          <TabsTrigger value="events">Event Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="financial" className="space-y-6">
          {/* Monthly Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Financial Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                    <Tooltip formatter={(value) => [`${value.toLocaleString()} AED`, '']} />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#8b5cf6" />
                    <Bar dataKey="expenses" name="Expenses" fill="#ef4444" />
                    <Bar dataKey="profit" name="Profit" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Financial Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">241,000 AED</div>
                <p className="text-xs text-muted-foreground mt-1">+12% from previous period</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">125,500 AED</div>
                <p className="text-xs text-muted-foreground mt-1">+8% from previous period</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">115,500 AED</div>
                <p className="text-xs text-muted-foreground mt-1">+18% from previous period</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Profit Margin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47.9%</div>
                <p className="text-xs text-muted-foreground mt-1">+5.3% from previous period</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="events" className="space-y-6">
          {/* Event Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Event Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Name</TableHead>
                    <TableHead className="hidden md:table-cell">Number of Events</TableHead>
                    <TableHead className="text-right">Total Revenue</TableHead>
                    <TableHead className="text-right hidden md:table-cell">Total Profit</TableHead>
                    <TableHead className="text-right">Avg. Profit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventPerformance.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{event.count}</TableCell>
                      <TableCell className="text-right">{event.totalRevenue.toLocaleString()} AED</TableCell>
                      <TableCell className="text-right hidden md:table-cell">{event.totalProfit.toLocaleString()} AED</TableCell>
                      <TableCell className="text-right">{event.avgProfit.toLocaleString()} AED</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Top Performing Events Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Average Attendance by Event</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={eventPerformance}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip formatter={(value) => [`${value} attendees`, '']} />
                    <Legend />
                    <Bar dataKey="avgAttendance" name="Average Attendance" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports; 