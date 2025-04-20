import React from 'react';
import { CircleDollarSign, Coins, BarChart2, Calendar, TrendingUp, ArrowUpRight } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { GoalProgress } from '@/components/dashboard/GoalProgress';
import { EventsTable } from '@/components/dashboard/EventsTable';
import { TasksList } from '@/components/dashboard/TasksList';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { ActionButtons } from '@/components/dashboard/ActionButtons';
import { useFinancialSummary, useEvents } from '@/hooks/use-api';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { data: financialSummary, isLoading: isLoadingSummary, error: summaryError } = useFinancialSummary();
  const { data: events, isLoading: isLoadingEvents, error: eventsError } = useEvents();

  // Format currency
  const formatCurrency = (value: number) => {
    return `${value.toLocaleString()} AED`;
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value.toFixed(0)}%`;
  };

  // Error handling
  if (summaryError || eventsError) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          An error occurred loading dashboard data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8 w-full mx-auto">
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold">Dashboard</h1>
        <div className="w-full sm:w-auto">
          <ActionButtons />
        </div>
      </div>
      
      {/* Performance Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
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
              icon={<CircleDollarSign size={24} />} 
            />
            <StatCard 
              title="Total Expenses" 
              value={formatCurrency(financialSummary?.totalExpenses || 0)} 
              icon={<Coins size={24} />}
            />
            <StatCard 
              title="Net Profit" 
              value={formatCurrency(financialSummary?.totalProfit || 0)} 
              icon={<BarChart2 size={24} />}
            />
            <StatCard 
              title="ROI" 
              value={formatPercentage(financialSummary?.roi || 0)} 
              icon={<ArrowUpRight size={24} />}
            />
          </>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
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
      
      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          {isLoadingSummary ? (
            <div className="p-4 rounded-lg border">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : (
            <GoalProgress 
              title="This Month's Revenue Goal" 
              target={12000} 
              achieved={financialSummary?.totalRevenue || 0}
            />
          )}
        </div>
      </div>
      
      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <EventsTable events={events} isLoading={isLoadingEvents} />
        <TasksList />
      </div>
    </div>
  );
};

export default Dashboard;
