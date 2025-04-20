import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Edit,
  Calendar,
  Building,
  Repeat,
  Tag,
  Percent,
  Clock,
  Trash2,
  ArrowLeft,
  Plus,
  ReceiptText,
  Users,
  DollarSign,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useEvent, useDeleteEvent, useDeleteExpense } from '@/hooks/use-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useQueryClient } from '@tanstack/react-query';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const eventId = parseInt(id);
  
  const { data: event, isLoading, isError, error } = useEvent(eventId);
  const deleteEvent = useDeleteEvent();
  const deleteExpense = useDeleteExpense();
  const queryClient = useQueryClient();
  
  // Debug error information
  React.useEffect(() => {
    if (error) {
      console.error('Error fetching event:', error);
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (isError || !event) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
        <p className="text-muted-foreground mb-6">The event you're looking for could not be found.</p>
        <Button onClick={() => navigate('/events')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>
      </div>
    );
  }

  const handleEdit = () => {
    navigate(`/events/${eventId}/edit`);
  };
  
  const handleDelete = () => {
    deleteEvent.mutate(eventId, {
      onSuccess: () => {
        toast.success('Event deleted successfully');
        navigate('/events');
      },
      onError: (error) => {
        toast.error('Failed to delete event');
        console.error('Error deleting event:', error);
      }
    });
  };

  const handleDeleteExpense = (expenseId: number) => {
    deleteExpense.mutate(expenseId, {
      onSuccess: () => {
        toast.success('Expense deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      },
      onError: (error) => {
        toast.error('Failed to delete expense');
        console.error('Error deleting expense:', error);
      }
    });
  };

  // Format the date for display
  const formattedDate = event.eventDate 
    ? format(parseISO(event.eventDate), 'MMMM d, yyyy') 
    : (event.dayOfWeek ? `Every ${event.dayOfWeek}` : 'N/A');

  // Check if event data exists and has the required properties
  const hasValidEventData = event.eventData && 
    typeof event.eventData === 'object' && 
    'attendeeCount' in event.eventData && 
    'revenue' in event.eventData;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-2" 
            onClick={() => navigate('/events')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
          <h1 className="text-2xl font-bold">{event.name}</h1>
          <p className="text-muted-foreground flex items-center mt-1">
            <Building className="h-4 w-4 mr-1" />
            {event.venueName}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Event
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this event and all associated data. 
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      {/* Status Badge */}
      <div>
        <Badge variant="outline" className={
          event.status === 'completed' 
            ? "bg-green-50 text-green-700 hover:bg-green-50 border-green-200" 
            : "bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200"
        }>
          {event.status === 'completed' ? 'Completed' : 'Upcoming'}
        </Badge>
      </div>
      
      {/* Event Details */}
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                <Calendar className="h-4 w-4 mr-1" /> Date/Schedule
              </h3>
              <p className="text-base">{formattedDate}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                <Repeat className="h-4 w-4 mr-1" /> Event Type
              </h3>
              <p className="text-base capitalize">{event.eventType.replace('-', ' ')}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                <Tag className="h-4 w-4 mr-1" /> Deal Type
              </h3>
              <p className="text-base">
                {event.dealType === 'revenue-share' ? 'Revenue Share' : 
                 event.dealType === 'revenue-share-entrance' ? 'Revenue Share & Entrance' : 
                 event.dealType}
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                <Percent className="h-4 w-4 mr-1" /> Commission Structure
              </h3>
              <p className="text-base">{event.commissions || 'None'}</p>
              {event.isProgressiveCommission && (
                <Badge variant="outline" className="mt-1">Progressive</Badge>
              )}
            </div>
            
            {event.dealType === 'revenue-share-entrance' && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                  <Percent className="h-4 w-4 mr-1" /> Entrance Share
                </h3>
                <p className="text-base">{event.entranceShare}%</p>
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                <Clock className="h-4 w-4 mr-1" /> Payment Terms
              </h3>
              <p className="text-base capitalize">
                {event.paymentTerms.replace('-', ' ')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Data - only shown if valid eventData exists */}
      {hasValidEventData && (
        <Card>
          <CardHeader>
            <CardTitle>Event Performance</CardTitle>
            <CardDescription>Revenue and attendance data</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center text-muted-foreground">
                <Users className="h-4 w-4 mr-2" />
                <span>Attendance</span>
              </div>
              <p className="text-2xl font-semibold">{event.eventData.attendeeCount}</p>
            </div>
            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center text-muted-foreground">
                <DollarSign className="h-4 w-4 mr-2" />
                <span>Revenue</span>
              </div>
              <p className="text-2xl font-semibold">{parseFloat(event.eventData.revenue).toFixed(2)} AED</p>
            </div>
            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center text-muted-foreground">
                <DollarSign className="h-4 w-4 mr-2" />
                <span>Average Spend</span>
              </div>
              <p className="text-2xl font-semibold">
                {event.eventData.attendeeCount > 0 
                  ? (parseFloat(event.eventData.revenue) / event.eventData.attendeeCount).toFixed(2)
                  : '0.00'} AED
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Expenses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Expenses</CardTitle>
            <CardDescription>Tracked expenses for this event</CardDescription>
          </div>
          <Button 
            size="sm" 
            onClick={() => navigate(`/add-expense?eventId=${eventId}`)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Expense
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {event.expenses && event.expenses.length > 0 ? (
                event.expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>
                      <Badge variant="outline">{expense.category}</Badge>
                    </TableCell>
                    <TableCell>{expense.description || '-'}</TableCell>
                    <TableCell>{parseFloat(expense.amount).toFixed(2)} AED</TableCell>
                    <TableCell>
                      {expense.paymentDate 
                        ? format(parseISO(expense.paymentDate), 'MMM d, yyyy') 
                        : '-'}
                    </TableCell>
                    <TableCell>{expense.paymentMethod}</TableCell>
                    <TableCell className="text-right space-x-2">
                      {expense.receipt && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                          <ReceiptText className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/add-expense?eventId=${event.id}&expenseId=${expense.id}`);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Expense</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this expense? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteExpense(expense.id);
                              }}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No expenses found. Click "Add Expense" to add one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        {event.expenses && event.expenses.length > 0 && (
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Total Expenses ({event.expenses.length})
            </div>
            <div className="font-medium">
              {event.expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0).toFixed(2)} AED
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default EventDetails; 