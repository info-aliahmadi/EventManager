import React, { useState } from 'react';
import { Calendar, Search, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Link, useNavigate } from 'react-router-dom';
import { useEvents } from '@/hooks/use-api';
import { Skeleton } from '@/components/ui/skeleton';

const Events = () => {
  const { data: events = [], isLoading } = useEvents();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Filter events based on status and search term
  const filteredEvents = events.filter(event => {
    const matchesFilter = filter === 'all' || event.status === filter;
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (event.venueName && event.venueName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });
  
  // Handle event row click
  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <div className="space-y-6 w-full mx-auto">
      <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
        <h1 className="text-2xl font-semibold">Events</h1>
        <Button asChild>
          <Link to="/add-event">
            <Plus className="mr-2 h-4 w-4" />
            Add New Event
          </Link>
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="flex items-center relative">
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events or venues..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex">
          <div className="flex items-center gap-2 bg-muted/40 px-3 rounded-l-md border-y border-l">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Status:</span>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="rounded-l-none">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Events Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Venue</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead className="text-right">Deal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton
              Array(5).fill(0).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {searchTerm || filter !== 'all' 
                    ? "No events match your search criteria"
                    : "No events found. Click 'Add New Event' to create one."}
                </TableCell>
              </TableRow>
            ) : (
              filteredEvents.map((event) => (
                <TableRow 
                  key={event.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleEventClick(event.id)}
                >
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {event.eventDate 
                        ? new Date(event.eventDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : event.dayOfWeek 
                          ? `Every ${event.dayOfWeek}`
                          : '—'
                      }
                    </div>
                  </TableCell>
                  <TableCell>{event.venueName}</TableCell>
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
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline">
                      {event.eventType === 'one-time' ? 'One-time' : 
                       event.eventType === 'weekly' ? 'Weekly' : 
                       event.eventType === 'monthly' ? 'Monthly' : event.eventType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {event.dealType === 'revenue-share' ? 'Revenue Share' : 
                     event.dealType === 'revenue-share-entrance' ? 'Rev. Share + Ent.' : 
                     event.dealType}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Events; 