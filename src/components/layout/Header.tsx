import React from 'react';
import { Bell, PlusCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TimeFilter } from '../dashboard/TimeFilter';

export function Header() {
  return (
    <header className="w-full h-16 border-b bg-background flex items-center px-4 sm:px-6 sticky top-0 z-10">
      <div className="w-full flex items-center justify-between md:ml-[280px]">
        <div className="hidden sm:block">
          <TimeFilter />
        </div>
        
        <div className="flex items-center ml-auto space-x-2 sm:space-x-4">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Event
          </Button>
          
          <Button variant="outline" size="icon" className="sm:hidden">
            <PlusCircle className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
