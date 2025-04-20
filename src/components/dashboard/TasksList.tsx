
import React from 'react';
import { Check, Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

// Mock tasks
const tasks: Task[] = [
  {
    id: '1',
    title: 'Add expenses for Friday Night Rumba',
    completed: false,
    priority: 'high',
  },
  {
    id: '2',
    title: 'Approve revenue for Saturday Exclusive',
    completed: false,
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Update social media expenses',
    completed: true,
    priority: 'low',
  },
  {
    id: '4',
    title: 'Mark Friday event as completed',
    completed: false,
    priority: 'medium',
  },
];

export function TasksList() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Upcoming Tasks</h3>
        <Button variant="ghost" size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Task
        </Button>
      </div>
      
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={cn(
              "flex items-start gap-3 p-3 border rounded-lg",
              task.completed ? "bg-muted/30" : "bg-card"
            )}
          >
            <div className="flex-shrink-0 mt-0.5">
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "h-5 w-5 rounded-full",
                  task.completed ? "bg-primary text-white border-primary" : "bg-background"
                )}
              >
                {task.completed && <Check className="h-3 w-3" />}
              </Button>
            </div>
            
            <div className="flex-1">
              <p className={cn("text-sm", task.completed && "line-through text-muted-foreground")}>
                {task.title}
              </p>
            </div>
            
            <div className="flex-shrink-0">
              <Badge priority={task.priority} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface BadgeProps {
  priority: 'low' | 'medium' | 'high';
}

function Badge({ priority }: BadgeProps) {
  return (
    <span 
      className={cn(
        "flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium",
        priority === 'high' ? "bg-red-50 text-red-800" : 
        priority === 'medium' ? "bg-amber-50 text-amber-800" : 
        "bg-green-50 text-green-800"
      )}
    >
      <Clock className="h-3 w-3" />
      {priority === 'high' ? "Urgent" : priority === 'medium' ? "Soon" : "Later"}
    </span>
  );
}
