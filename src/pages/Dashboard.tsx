import React, { useMemo } from 'react';
import { CircleDollarSign, Coins, BarChart2, Calendar, TrendingUp, ArrowUpRight, RefreshCcw } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { GoalProgress } from '@/components/dashboard/GoalProgress';
import { EventsTable } from '@/components/dashboard/EventsTable';
import { TasksList } from '@/components/dashboard/TasksList';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { ActionButtons } from '@/components/dashboard/ActionButtons';
import { useFinancialSummary, useEvents, useMonthlyPerformance } from '@/hooks/use-api';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  // Data fetching with React Query
  const {
    data: financialSummary,
    isLoading: isLoadingSummary,
    error: summaryError,
    refetch: refetchSummary,
    isRefetching: isRefetchingSummary
  } = useFinancialSummary();

  const {
    data: events,
    isLoading: isLoadingEvents,
    error: eventsError,
    refetch: refetchEvents,
    isRefetching: isRefetchingEvents
  } = useEvents();

  const {
    data: monthlyPerformance,
    isLoading: isLoadingMonthly
  } = useMonthlyPerformance();

  // Calculate revenue goal progress
  const currentMonth = new Date().getMonth();
  const currentMonthData = useMemo(() => {
    if (!monthlyPerformance) return null;
    return monthlyPerformance.find(item => {
      const itemMonth = new Date(item.month).getMonth();
      return itemMonth === currentMonth;
    });
  }, [monthlyPerformance, currentMonth]);

  // Target is either from the API or a default of 12000
  const revenueTarget = currentMonthData?.target || 12000;

  // Format currency
  const formatCurrency = (value: number) => {
    return `${value.toLocaleString()} AED`;
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value.toFixed(0)}%`;
  };

  // Handle data refresh
  const handleRefresh = () => {
    refetchSummary();
    refetchEvents();
  };

  // Error handling
  if (summaryError || eventsError) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Dashboard</AlertTitle>
        <AlertDescription>
          An error occurred loading dashboard data. Please try again later.
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
    <div className="space-y-4 sm:space-y-6 md:space-y-8 w-full mx-auto">
      {/* Header with Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center">
          <h1 className="text-xl sm:text-2xl font-semibold">Dashboard</h1>
          {(isRefetchingSummary || isRefetchingEvents) && (
            <RefreshCcw className="h-4 w-4 ml-2 animate-spin text-muted-foreground" />
          )}
        </div>
        <div className="w-full sm:w-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefetchingSummary || isRefetchingEvents}
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <ActionButtons />
        </div>
      </div>

      {/* Revenue Metrics */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg">Revenue Metrics</CardTitle>
          <span className="text-xs text-muted-foreground">vs Previous Month</span>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {isLoadingSummary ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-4 rounded-lg border">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-32 mb-2" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </>
            ) : (
              <>
                <StatCard
                  title="Total Revenue"
                  value={formatCurrency(financialSummary?.totalRevenue || 0)}
                  trend={financialSummary?.revenueChange || 0}
                  icon={<CircleDollarSign size={24} />}
                />
                <StatCard
                  title="Total Expenses"
                  value={formatCurrency(financialSummary?.totalExpenses || 0)}
                  trend={financialSummary?.expensesChange || 0}
                  icon={<Coins size={24} />}
                />
                <StatCard
                  title="Net Profit"
                  value={formatCurrency(financialSummary?.totalProfit || 0)}
                  trend={financialSummary?.profitChange || 0}
                  icon={<BarChart2 size={24} />}
                />
                <StatCard
                  title="ROI"
                  value={formatPercentage(financialSummary?.roi || 0)}
                  trend={financialSummary?.roiChange || 0}
                  icon={<ArrowUpRight size={24} />}
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Event Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Event Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {isLoadingSummary ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-4 rounded-lg border">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-32 mb-2" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </>
            ) : (
              <>
                <StatCard
                  title="Events Run"
                  value={financialSummary?.eventsCount?.toString() || "0"}
                  icon={<Calendar size={24} />}
                />
                <StatCard
                  title="Avg. Revenue per Event"
                  value={formatCurrency(financialSummary?.avgRevenuePerEvent || 0)}
                  icon={<CircleDollarSign size={24} />}
                />
                <StatCard
                  title="Avg. Profit per Event"
                  value={formatCurrency(financialSummary?.avgProfitPerEvent || 0)}
                  icon={<TrendingUp size={24} />}
                />
                <StatCard
                  title="Avg. Expenses per Event"
                  value={formatCurrency(financialSummary?.avgExpensesPerEvent || 0)}
                  icon={<Coins size={24} />}
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Charts and Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          {isLoadingSummary || isLoadingMonthly ? (
            <div className="p-4 rounded-lg border">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : (
            <GoalProgress
              title="This Month's Revenue Goal"
              target={revenueTarget}
              achieved={currentMonthData?.revenue || financialSummary?.currentPeriod?.revenue || 0}
            />
          )}    <EventsTable events={events} isLoading={isLoadingEvents} />
        </div>
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6"> */}
      
          {/* <TasksList /> */}
        {/* </div> */}
      </div>

      {/* Bottom Section */}

    </div>
  );
};

export default Dashboard;
