import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, PlusCircle, Trash2, Coins, Receipt, Banknote, Info } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useCreateEvent } from '@/hooks/use-api';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Schema for a single expense item within the event form
const expenseItemSchema = z.object({
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
  commissions: z.string().optional(), // Optional now?
  isProgressiveCommission: z.boolean().default(false),
  paymentTerms: z.enum(["one-week", "two-weeks", "three-weeks", "one-month"]),
  entranceShare: z.string().optional(),
  expenses: z.array(expenseItemSchema).optional(), // Array of expenses, optional
});

// Define type based on the new schema
type EventFormValues = z.infer<typeof eventFormSchema>;

const AddEvent = () => {
  const navigate = useNavigate();
  const createEvent = useCreateEvent();
  
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
      expenses: [], // Initialize expenses as an empty array
    },
  });

  // Setup useFieldArray for expenses
  const { fields: expenseFields, append: appendExpense, remove: removeExpense } = useFieldArray({
    control: form.control,
    name: "expenses",
  });

  const eventType = form.watch("eventType");
  const dealType = form.watch("dealType");

  const onSubmit = (values: EventFormValues) => {
    debugger
    // Structure the payload including expenses
    const payload = {
      name: values.name,
      eventType: values.eventType,
      venueName: values.venueName,
      dealType: values.dealType,
      commissions: values.commissions,
      isProgressiveCommission: values.isProgressiveCommission,
      paymentTerms: values.paymentTerms,
      entranceShare: values.entranceShare || "",
      ...(values.eventType === "weekly" 
        ? { dayOfWeek: values.dayOfWeek } 
        : { eventDate: values.eventDate ? format(values.eventDate, 'yyyy-MM-dd') : undefined }),
      // Format expenses before sending
      expenses: values.expenses?.map(exp => ({
        ...exp,
        paymentDate: exp.paymentDate ? format(exp.paymentDate, 'yyyy-MM-dd') : undefined,
        // Ensure amount is a number if the backend expects it
        amount: typeof exp.amount === 'string' ? parseFloat(exp.amount) : exp.amount,
      })) || [],
    };
    
    console.log("Submitting Payload:", payload); // Debug log

    createEvent.mutate(payload, {
      onSuccess: () => { // Don't need createdEvent if navigating away
        toast.success("Event and expenses created successfully!");
        navigate("/events"); // Navigate back to the events list
      },
      onError: (error) => {
        toast.error("Failed to create event. Please try again.");
        console.error("Error creating event:", error);
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

  return (
    <div className="w-full mx-auto px-4 sm:px-6 space-y-4 sm:space-y-6 max-w-4xl"> {/* Increased max-width */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold mb-2">Add New Event</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Fill in the event details and add any initial expenses</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-8">
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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

          {/* Expenses Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Initial Expenses</CardTitle>
                <CardDescription>Add any expenses incurred for this event so far.</CardDescription>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addExpenseItem} // Use the new handler
              >
                <PlusCircle className="h-4 w-4 mr-1" /> Add Expense
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {expenseFields.length === 0 && (
                 <p className="text-sm text-muted-foreground italic text-center py-4">No expenses added yet.</p>
              )}
              {expenseFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-md space-y-4 relative bg-background/50">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => removeExpense(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                    <span className="sr-only">Remove Expense</span>
                  </Button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Expense Category */}
                    <FormField
                      control={form.control}
                      name={`expenses.${index}.category`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Promoter">Promoter</SelectItem>
                              <SelectItem value="Staff">Staff</SelectItem>
                              <SelectItem value="Venue">Venue</SelectItem>
                              <SelectItem value="Ad Spend">Ad Spend</SelectItem>
                              <SelectItem value="Commission">Commission</SelectItem>
                              <SelectItem value="Entertainment">Entertainment</SelectItem>
                              <SelectItem value="Supplies">Supplies</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Expense Amount */}
                    <FormField
                      control={form.control}
                      name={`expenses.${index}.amount`}
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
                                // Ensure value is string for preprocess to work correctly on change
                                onChange={e => field.onChange(e.target.value)} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Expense Description */}
                  <FormField
                    control={form.control}
                    name={`expenses.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Info className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Textarea 
                              placeholder="e.g., DJ Fee, Facebook Ads" 
                              className="resize-none pl-8" 
                              rows={2} 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Payment Date (Optional) */}
                    <FormField
                      control={form.control}
                      name={`expenses.${index}.paymentDate`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Payment Date (Optional)</FormLabel>
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
                                onSelect={field.onChange} // Sets value to Date | undefined
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Payment Method (Optional) */}
                     <FormField
                      control={form.control}
                      name={`expenses.${index}.paymentMethod`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Method (Optional)</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
                                <SelectValue placeholder="Select method" className="pl-8"/>
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

                  {/* Receipt Reference (Optional) */}
                  <FormField
                    control={form.control}
                    name={`expenses.${index}.receipt`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Receipt Ref (Optional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Receipt className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="e.g., Inv #123" className="pl-8" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate("/events")} // Navigate back to list on cancel
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={createEvent.isPending || !form.formState.isValid}
            >
              {createEvent.isPending ? "Saving..." : "Create Event & Expenses"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddEvent;
