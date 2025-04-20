import React, { useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { useNavigate, useParams } from 'react-router-dom';
import { CalendarIcon, PlusCircle, Trash2, Coins, Receipt, Banknote, Info } from "lucide-react";
import { format, parseISO } from "date-fns";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useEvent, useUpdateEvent } from '@/hooks/use-api';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// Schema for a single expense item within the event form
const expenseItemSchema = z.object({
  id: z.number().optional(),
  category: z.enum([
    "Promoter", "Staff", "Venue", "Ad Spend", 
    "Commission", "Entertainment", "Supplies", "Other"
  ], { required_error: "Category is required." }),
  description: z.string().optional(),
  amount: z.preprocess(
    (a) => parseFloat(z.string().parse(a || "0")),
    z.number().positive({ message: "Amount must be positive." })
  ),
  paymentDate: z.date().optional(), // Make optional or set default
  paymentMethod: z.enum(["Cash", "Bank Transfer", "Card", "Other"]).optional(),
  receipt: z.string().optional(),
});

// Main event form schema including the expenses array
const eventFormSchema = z.object({
  name: z.string().min(2, { message: "Event name must be at least 2 characters." }),
  eventType: z.enum(["weekly", "monthly", "one-time"]),
  dayOfWeek: z.string().optional(),
  eventDate: z.date().optional(),
  venueName: z.string().min(2, { message: "Venue name must be at least 2 characters." }),
  dealType: z.enum(["revenue-share", "revenue-share-entrance"]),
  commissions: z.string().optional(), 
  isProgressiveCommission: z.boolean().default(false),
  paymentTerms: z.enum(["one-week", "two-weeks", "three-weeks", "one-month"]),
  entranceShare: z.string().optional(),
  status: z.enum(["upcoming", "completed", "cancelled"]).default("upcoming"),
  expenses: z.array(expenseItemSchema).optional(), // Array of expenses, optional
});

// Define type based on the new schema
type EventFormValues = z.infer<typeof eventFormSchema>;

const EditEvent = () => {
  const { id } = useParams();
  const eventId = parseInt(id);
  const navigate = useNavigate();
  const { data: event, isLoading } = useEvent(eventId);
  const updateEvent = useUpdateEvent();
  
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: "",
      eventType: "one-time",
      venueName: "",
      dealType: "revenue-share",
      commissions: "",
      isProgressiveCommission: false,
      paymentTerms: "one-week",
      status: "upcoming",
      expenses: [], // Initialize expenses as an empty array
    },
  });

  // Setup useFieldArray for expenses
  const { fields: expenseFields, append: appendExpense, remove: removeExpense } = useFieldArray({
    control: form.control,
    name: "expenses",
  });

  // Load event data into form when available
  useEffect(() => {
    if (event) {
      console.log("Loading event data into form:", event);
      
      // Convert date strings to Date objects
      const formattedEvent = {
        ...event,
        eventDate: event.eventDate ? parseISO(event.eventDate) : undefined,
        // Format expenses if they exist
        expenses: event.expenses?.map(exp => ({
          ...exp,
          paymentDate: exp.paymentDate ? parseISO(exp.paymentDate) : undefined,
        })) || [],
      };
      
      console.log("Formatted event data:", formattedEvent);
      form.reset(formattedEvent);
    }
  }, [event, form]);

  const eventType = form.watch("eventType");
  const dealType = form.watch("dealType");

  // Direct submit handler that doesn't rely on form validation
  const handleManualSubmit = () => {
    const values = form.getValues();
    onSubmit(values);
  };

  const onSubmit = (values: EventFormValues) => {
    // Structure the payload including expenses
    const payload = {
      name: values.name,
      eventType: values.eventType,
      venueName: values.venueName,
      dealType: values.dealType,
      commissions: values.commissions || "",
      isProgressiveCommission: values.isProgressiveCommission,
      paymentTerms: values.paymentTerms,
      entranceShare: values.entranceShare || "",
      status: values.status,
      ...(values.eventType === "weekly" 
        ? { dayOfWeek: values.dayOfWeek } 
        : { eventDate: values.eventDate ? format(values.eventDate, 'yyyy-MM-dd') : undefined }),
    };
    
    console.log("Submitting Payload:", payload); // Debug log

    updateEvent.mutate({ id: eventId, data: payload }, {
      onSuccess: () => {
        toast.success("Event updated successfully!");
        navigate(`/events/${eventId}`); // Navigate to event details
      },
      onError: (error) => {
        toast.error("Failed to update event. Please try again.");
        console.error("Error updating event:", error);
      }
    });
  };

  // Function to add a new blank expense item
  const addExpenseItem = () => {
    appendExpense({
      category: "Other", // Default category
      description: "",
      amount: 0,
      paymentDate: new Date(),
      paymentMethod: "Cash",
      receipt: "",
    });
  };

  if (isLoading) {
    return (
      <div className="w-full mx-auto px-4 sm:px-6 space-y-6 max-w-4xl">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4 sm:px-6 space-y-4 sm:space-y-6 max-w-4xl"> 
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold mb-2">Edit Event</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Update event details</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.error("Form validation errors:", errors);
        })} className="space-y-4 sm:space-y-8">
          {/* Event Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Friday Night Rumba" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="eventType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="one-time">One-Time</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {eventType === "weekly" && (
                <FormField
                  control={form.control}
                  name="dayOfWeek"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Day of Week</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select day" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="monday">Monday</SelectItem>
                          <SelectItem value="tuesday">Tuesday</SelectItem>
                          <SelectItem value="wednesday">Wednesday</SelectItem>
                          <SelectItem value="thursday">Thursday</SelectItem>
                          <SelectItem value="friday">Friday</SelectItem>
                          <SelectItem value="saturday">Saturday</SelectItem>
                          <SelectItem value="sunday">Sunday</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {(eventType === "monthly" || eventType === "one-time") && (
                <FormField
                  control={form.control}
                  name="eventDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Event Date</FormLabel>
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
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="venueName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Club XYZ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          {/* Deal Type Card */}
          <Card>
             <CardHeader>
              <CardTitle>Deal Structure</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="dealType"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Deal Structure</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select deal type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="revenue-share">Revenue Share</SelectItem>
                      <SelectItem value="revenue-share-entrance">Revenue Share & Entrance Deal</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="commissions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commission Brackets (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="15% on 20,000-40,000 AED, 20% on 40,000+ AED" 
                      className="resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Enter commission brackets, e.g., "15% on 20,000-40,000 AED" (one per line)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isProgressiveCommission"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Is % paid from each bracket? (Progressive Tiers)</FormLabel>
                    <FormDescription>
                      Yes = tiered revenue, No = single tier based on where revenue falls
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="paymentTerms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Terms</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment terms" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="one-week">1 Week</SelectItem>
                      <SelectItem value="two-weeks">2 Weeks</SelectItem>
                      <SelectItem value="three-weeks">3 Weeks</SelectItem>
                      <SelectItem value="one-month">1 Month</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {dealType === "revenue-share-entrance" && (
              <FormField
                control={form.control}
                name="entranceShare"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Entrance Fee Share (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        max="100" 
                        placeholder="50"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Percentage of entrance fees shared
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate(`/events/${eventId}`)} // Navigate back to event detail
            >
              Cancel
            </Button>
            <Button 
              type="button"
              onClick={handleManualSubmit}
              disabled={updateEvent.isPending}
            >
              {updateEvent.isPending ? "Saving..." : "Update Event"}
            </Button>
          
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditEvent; 