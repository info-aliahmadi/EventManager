import React from 'react';
import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  title: string;
  value: string;
  trend?: number;
  change?: number;
  icon: React.ReactNode;
  className?: string;
}

export function StatCard({ title, value, trend = 0, change, icon, className }: StatCardProps) {
  const trendValue = change !== undefined ? change : trend;
  
  return (
    <div className={cn("stat-card p-4 rounded-lg border", className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          
          {trendValue !== 0 && (
            <div className="mt-2 flex items-center">
              {trendValue > 0 ? (
                <span className="text-emerald-600 flex items-center text-sm">
                  <ArrowUpRight size={16} />
                  {Math.abs(trendValue)}%
                </span>
              ) : trendValue < 0 ? (
                <span className="text-red-600 flex items-center text-sm">
                  <ArrowDownRight size={16} />
                  {Math.abs(trendValue)}%
                </span>
              ) : (
                <span className="text-gray-500 flex items-center text-sm">
                  <ArrowRight size={16} />
                  {Math.abs(trendValue)}%
                </span>
              )}
              <span className="text-xs ml-1 text-muted-foreground">vs last period</span>
            </div>
          )}
        </div>
        
        <div className="p-2 bg-primary/10 rounded-full text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
}
