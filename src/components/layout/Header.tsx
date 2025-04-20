import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLogout } from '@/hooks/use-auth';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, Settings, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Bell, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TimeFilter } from '../dashboard/TimeFilter';

export function Header() {
  const { user } = useAuth();
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <header className="sticky top-0 border-b bg-background/95 backdrop-blur h-16 flex items-center px-4 sm:px-6">
      <div className="flex-1">
        <div className="hidden sm:block">
          <TimeFilter />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
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
            <Avatar className="cursor-pointer h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="px-2 py-1.5 text-sm font-medium">
              {user?.name}
            </div>
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              {user?.email}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex cursor-pointer items-center w-full">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <button 
                className="w-full flex cursor-pointer items-center"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
