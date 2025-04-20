import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface Event {
  id: number;
  name: string;
  eventDate: string;
  status: string;
  eventData?: {
    id?: number;
    revenue?: number;
    attendeeCount?: number;
  } | null;
  expenses?: Array<{
    id: number;
    amount: string | number;
  }> | null;
}

interface EventsTableProps {
  events?: Event[];
  isLoading?: boolean;
}

export function EventsTable({ events = [], isLoading = false }: EventsTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Latest Events</h3>
        <Select defaultValue="all">
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="thisWeek">This Week</SelectItem>
            <SelectItem value="lastWeek">Last Week</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Profit (AED)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton rows
              Array(4).fill(0).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : events.length === 0 ? (
              // No events message
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  No events found
                </TableCell>
              </TableRow>
            ) : (
              // Actual event rows
              events.map((event) => {
                // Calculate profit if event data exists
                const revenue = event.eventData?.revenue || 0;
                
                // Calculate total expenses
                const totalExpenses = event.expenses?.reduce((total, expense) => {
                  const expenseAmount = typeof expense.amount === 'string' 
                    ? parseFloat(expense.amount) 
                    : expense.amount;
                  return total + (isNaN(expenseAmount) ? 0 : expenseAmount);
                }, 0) || 0;
                
                const profit = revenue - totalExpenses;
                
                return (
                  <TableRow key={event.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{event.name}</TableCell>
                    <TableCell>
                      {event.eventDate ? new Date(event.eventDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      }) : 'No date'}
                    </TableCell>
                    <TableCell>
                      {event.status === 'completed' ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
                          Completed
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">
                          Upcoming
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {event.status === 'completed' ? 
                        `${profit.toLocaleString()}` : 
                        '—'
                      }
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
