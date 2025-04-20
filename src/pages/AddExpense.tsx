import React, { useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate, useLocation } from 'react-router-dom';
import { CalendarIcon, Coins, Receipt, MessageSquare, Banknote, Tags, Info } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useEvents, useCreateExpense } from '@/hooks/use-api';

// New schema for a single expense
const expenseFormSchema = z.object({
  eventId: z.string({ required_error: "Please select an event." }),
  category: z.enum([
    "Promoter", 
    "Staff", 
    "Venue", 
    "Ad Spend", 
    "Commission", 
    "Entertainment", 
    "Supplies", 
    "Other" 
  ], { required_error: "Please select a category." }),
  description: z.string().min(2, { message: "Description must be at least 2 characters." }).optional(),
  amount: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive({ message: "Amount must be a positive number." })
  ),
  paymentDate: z.date({ required_error: "Please select a payment date." }),
  paymentMethod: z.enum(["Cash", "Bank Transfer", "Card", "Other"], { required_error: "Please select a payment method." }),
  receipt: z.string().optional(),
});

// Define type based on the new schema
type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

// Mock events data - replace with actual API call using useGetEvents
// const mockEvents = [
//   { id: '1', name: 'Friday Night Rumba (April 12)' },
//   { id: '2', name: 'Saturday Exclusive (April 13)' },
//   { id: '3', name: 'Friday Night Rumba (April 19)' },
//   { id: '4', name: 'Saturday Exclusive (April 20)' },
// ];

const AddExpense = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Extract eventId from query parameters
  const queryParams = new URLSearchParams(location.search);
  const eventIdFromQuery = queryParams.get('eventId');
  
  // Use the correct hook name
  const { data: eventsData, isLoading: isLoadingEvents } = useEvents(); 
  const createExpense = useCreateExpense(); 
  
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      eventId: eventIdFromQuery || "",
      category: undefined,
      description: "",
      amount: 0,
      paymentDate: new Date(),
      paymentMethod: undefined,
      receipt: "",
    },
  });
  
  // Update form when eventId changes in query or events load
  useEffect(() => {
    if (eventIdFromQuery && !form.getValues().eventId) {
      form.setValue('eventId', eventIdFromQuery);
    }
  }, [eventIdFromQuery, form, eventsData]);

  const onSubmit = (values: ExpenseFormValues) => {
    // Prepare the nested data structure expected by the mutation
    const expensePayload = {
      category: values.category,
      amount: values.amount,
      description: values.description || '',
      paymentDate: format(values.paymentDate, 'yyyy-MM-dd'),
      paymentMethod: values.paymentMethod,
      receipt: values.receipt || '',
    };

    const mutationPayload = {
      eventId: parseInt(values.eventId), 
      data: expensePayload // Nest the expense data under 'data'
    };
    
    // Pass the correctly structured payload
    createExpense.mutate(mutationPayload, { 
      onSuccess: () => {
        toast.success("Expense added successfully!");
        navigate(`/events/${values.eventId}`); 
      },
      onError: (error) => {
        toast.error("Failed to add expense. Please try again.");
        console.error("Error adding expense:", error);
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Add New Expense</h1>
        <p className="text-muted-foreground">Record an individual expense for an event</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Expense Details</CardTitle>
              <CardDescription>Fill in the details for this expense item</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="eventId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Event</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value} 
                      disabled={isLoadingEvents || !eventsData}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={isLoadingEvents ? "Loading events..." : "Choose an event"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {eventsData?.map((event: { id: number | string; name: string }) => (
                          <SelectItem key={event.id.toString()} value={event.id.toString()}>
                            {event.name}
                          </SelectItem>
                        ))}
                        {!isLoadingEvents && !eventsData?.length && (
                          <div className="p-4 text-sm text-muted-foreground">No events found.</div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select expense category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Promoter">Promoter Payment</SelectItem>
                        <SelectItem value="Staff">Staff Payment</SelectItem>
                        <SelectItem value="Venue">Venue Cost</SelectItem>
                        <SelectItem value="Ad Spend">Ad Spend</SelectItem>
                        <SelectItem value="Commission">Table Commission</SelectItem>
                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                        <SelectItem value="Supplies">Supplies/Decor</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (AED)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Coins className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.01"
                          placeholder="0.00" 
                          className="pl-8"
                          {...field} 
                          onChange={event => field.onChange(event.target.value)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                     <FormControl>
                      <div className="relative">
                        <Info className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea 
                          placeholder="e.g., Payment for DJ John Doe, Facebook Ad Campaign April" 
                          className="resize-none pl-8" 
                          {...field} 
                        />
                       </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="paymentDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Payment Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                             <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                             <SelectValue placeholder="Select method" className="pl-8" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                          <SelectItem value="Card">Card</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="receipt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Receipt Reference (Optional)</FormLabel>
                     <FormControl>
                       <div className="relative">
                        <Receipt className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="e.g., Receipt URL, Invoice #123" 
                          className="pl-8" 
                          {...field} 
                        />
                       </div>
                    </FormControl>
                    <FormDescription>
                      Enter a link or reference number for the receipt/invoice.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => eventIdFromQuery ? navigate(`/events/${eventIdFromQuery}`) : navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createExpense.isPending}>
              {createExpense.isPending ? "Saving..." : "Save Expense"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddExpense;
