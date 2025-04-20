import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { eventApi, expenseApi, reportApi } from '@/lib/api';
import { toast } from 'sonner';

// Event Types
export interface Event {
  id: number;
  name: string;
  eventType: string;
  dayOfWeek?: string;
  eventDate?: string;
  venueName: string;
  dealType: string;
  commissions: string;
  isProgressiveCommission: boolean;
  paymentTerms: string;
  entranceShare?: string;
  createdAt: string;
  updatedAt: string;
}

// Event hooks
export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: () => eventApi.getAll(),
  });
}

export function useEvent(id: number) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => eventApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => eventApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event created successfully');
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => eventApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', variables.id] });
      toast.success('Event updated successfully');
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => eventApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event deleted successfully');
    },
  });
}


// Expense hooks
export function useEventExpenses(eventId: number) {
  return useQuery({
    queryKey: ['expenses', eventId],
    queryFn: () => expenseApi.getByEventId(eventId),
    enabled: !!eventId,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ eventId, data }: { eventId: number; data: any }) => expenseApi.create(eventId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['expenses', variables.eventId] });
      queryClient.invalidateQueries({ queryKey: ['event', variables.eventId] });
      queryClient.invalidateQueries({ queryKey: ['financial-summary'] });
      queryClient.invalidateQueries({ queryKey: ['expense-breakdown'] });
      queryClient.invalidateQueries({ queryKey: ['event-performance'] });
      toast.success('Expense added successfully');
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => expenseApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['financial-summary'] });
      queryClient.invalidateQueries({ queryKey: ['expense-breakdown'] });
      queryClient.invalidateQueries({ queryKey: ['event-performance'] });
      toast.success('Expense updated successfully');
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => expenseApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['financial-summary'] });
      queryClient.invalidateQueries({ queryKey: ['expense-breakdown'] });
      queryClient.invalidateQueries({ queryKey: ['event-performance'] });
      toast.success('Expense deleted successfully');
    },
  });
}

// Report hooks
export function useFinancialSummary() {
  return useQuery({
    queryKey: ['financial-summary'],
    queryFn: () => reportApi.getFinancialSummary(),
  });
}

export function useMonthlyPerformance() {
  return useQuery({
    queryKey: ['monthly-performance'],
    queryFn: () => reportApi.getMonthlyPerformance(),
  });
}

export function useEventPerformance() {
  return useQuery({
    queryKey: ['event-performance'],
    queryFn: () => reportApi.getEventPerformance(),
  });
}

export function useExpenseBreakdown() {
  return useQuery({
    queryKey: ['expense-breakdown'],
    queryFn: () => reportApi.getExpenseBreakdown(),
  });
} 