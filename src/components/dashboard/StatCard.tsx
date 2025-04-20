
import React from 'react';
import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  trend?: number;
  icon: React.ReactNode;
  className?: string;
}

export function StatCard({ title, value, trend = 0, icon, className }: StatCardProps) {
  return (
    <div className={cn("stat-card", className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          
          {trend !== 0 && (
            <div className="mt-2">
              {trend > 0 ? (
                <span className="trend-up">
                  <ArrowUpRight size={16} />
                  {Math.abs(trend)}%
                </span>
              ) : trend < 0 ? (
                <span className="trend-down">
                  <ArrowDownRight size={16} />
                  {Math.abs(trend)}%
                </span>
              ) : (
                <span className="trend-neutral">
                  <ArrowRight size={16} />
                  {Math.abs(trend)}%
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
