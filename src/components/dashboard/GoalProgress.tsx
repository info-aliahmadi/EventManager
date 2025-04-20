
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface GoalProgressProps {
  title: string;
  target: number;
  achieved: number;
  currency?: string;
  className?: string;
}

export function GoalProgress({ title, target, achieved, currency = 'AED', className }: GoalProgressProps) {
  const progress = Math.min(100, Math.round((achieved / target) * 100));
  
  return (
    <div className={`p-6 rounded-xl border bg-card text-card-foreground shadow-sm ${className}`}>
      <h3 className="font-medium text-lg mb-1">{title}</h3>
      
      <div className="flex justify-between items-center text-sm text-muted-foreground mb-3">
        <span>Target: {currency} {target.toLocaleString()}</span>
        <span>{progress}% Complete</span>
      </div>
      
      <Progress value={progress} className="h-2" />
      
      <div className="mt-4 text-xl font-semibold">
        {currency} {achieved.toLocaleString()}
        <span className="text-sm font-normal text-muted-foreground"> achieved</span>
      </div>
    </div>
  );
}
