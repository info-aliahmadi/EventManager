import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, CreditCard, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ActionButtons() {
  return (
    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 w-full">
      <Button asChild size="sm" className="bg-primary/90 hover:bg-primary">
        <Link to="/add-event" className="flex items-center justify-center">
          <Plus className="mr-1 h-4 w-4" />
          <span className="whitespace-nowrap">Add Event</span>
        </Link>
      </Button>
      
      <Button asChild size="sm" className="bg-primary/90 hover:bg-primary">
        <Link to="/add-data" className="flex items-center justify-center">
          <FileText className="mr-1 h-4 w-4" />
          <span className="whitespace-nowrap">Add Data</span>
        </Link>
      </Button>
      
      <Button asChild size="sm" variant="outline">
        <Link to="/add-expense" className="flex items-center justify-center">
          <CreditCard className="mr-1 h-4 w-4" />
          <span className="whitespace-nowrap">Add Expense</span>
        </Link>
      </Button>
      
      <Button size="sm" variant="outline" className="flex items-center justify-center">
        <FileDown className="mr-1 h-4 w-4" />
        <span className="whitespace-nowrap">Export</span>
      </Button>
    </div>
  );
}
