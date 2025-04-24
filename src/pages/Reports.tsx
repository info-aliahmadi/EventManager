import React, { useState, useMemo } from 'react';
import { Download, FileText, Filter, Calendar, RefreshCcw, AlertCircle } from 'lucide-react';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useFinancialSummary, useMonthlyPerformance, useEventPerformance, useExpenseBreakdown } from '@/hooks/use-api';

const Reports = () => {
  const [timeRange, setTimeRange] = useState('ytd');
  
  // Fetch data using React Query hooks
  const { 
    data: financialSummary, 
    isLoading: isLoadingSummary, 
    error: summaryError,
    refetch: refetchSummary,
    isRefetching: isRefetchingSummary
  } = useFinancialSummary();
  
  const { 
    data: monthlyPerformance, 
    isLoading: isLoadingMonthly, 
    error: monthlyError,
    refetch: refetchMonthly
  } = useMonthlyPerformance();
  
  const { 
    data: eventPerformance, 
    isLoading: isLoadingEvents, 
    error: eventsError,
    refetch: refetchEvents
  } = useEventPerformance();
  
  const { 
    data: expenseBreakdown, 
    isLoading: isLoadingExpenses 
  } = useExpenseBreakdown();

  // Format the monthly performance data for the chart
  const formattedMonthlyData = useMemo(() => {
    if (!monthlyPerformance) return [];
    
    return monthlyPerformance.map(item => ({
      month: new Date(item.month + '-01').toLocaleString('default', { month: 'short' }),
      revenue: item.revenue,
      expenses: item.expenses,
      profit: item.profit
    }));
  }, [monthlyPerformance]);
  
  // Calculate financial metrics for the cards
  const totalRevenue = financialSummary?.totalRevenue || 0;
  const totalExpenses = financialSummary?.totalExpenses || 0;
  const totalProfit = financialSummary?.totalProfit || 0;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  
  // Refresh all data
  const handleRefresh = () => {
    refetchSummary();
    refetchMonthly();
    refetchEvents();
  };
  
  // Handle errors
  const hasError = summaryError || monthlyError || eventsError;
  if (hasError) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Reports</AlertTitle>
        <AlertDescription>
          An error occurred loading report data. Please try again later.
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2" 
            onClick={handleRefresh}
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 w-full mx-auto">
      <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold">Reports</h1>
          {(isRefetchingSummary) && (
            <RefreshCcw className="h-4 w-4 ml-2 animate-spin text-muted-foreground" />
          )}
        </div>
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
          <Button variant="outline" onClick={handleRefresh} disabled={isRefetchingSummary}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
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
              {isLoadingMonthly ? (
                <div className="h-80 flex items-center justify-center">
                  <Skeleton className="h-64 w-full" />
                </div>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={formattedMonthlyData}
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
              )}
            </CardContent>
          </Card>

          {/* Financial Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoadingSummary ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <Skeleton className="h-4 w-24" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-32 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              <>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} AED</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {financialSummary?.revenueChange > 0 ? '+' : ''}
                      {financialSummary?.revenueChange}% from previous period
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalExpenses.toLocaleString()} AED</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {financialSummary?.expensesChange > 0 ? '+' : ''}
                      {financialSummary?.expensesChange}% from previous period
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Profit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalProfit.toLocaleString()} AED</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {financialSummary?.profitChange > 0 ? '+' : ''}
                      {financialSummary?.profitChange}% from previous period
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Profit Margin</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{profitMargin.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {(financialSummary?.profitChange - financialSummary?.revenueChange) > 0 ? '+' : ''}
                      {(financialSummary?.profitChange - financialSummary?.revenueChange).toFixed(1)}% from previous period
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="events" className="space-y-6">
          {/* Event Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Event Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingEvents ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
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
                    {eventPerformance?.map((event, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{event.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{event.count}</TableCell>
                        <TableCell className="text-right">{event.totalRevenue.toLocaleString()} AED</TableCell>
                        <TableCell className="text-right hidden md:table-cell">{event.totalProfit.toLocaleString()} AED</TableCell>
                        <TableCell className="text-right">{event.avgProfit.toLocaleString()} AED</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Event Attendance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Average Attendance by Event</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingEvents ? (
                <div className="h-80 flex items-center justify-center">
                  <Skeleton className="h-64 w-full" />
                </div>
              ) : (
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
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports; 