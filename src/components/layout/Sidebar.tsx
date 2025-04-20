import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { BarChart2, Calendar, Home, Menu, PlusCircle, Settings, TrendingUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button 
        onClick={toggleMobileMenu}
        className="md:hidden fixed z-20 top-4 left-4 p-2 rounded-md bg-primary text-primary-foreground"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-10"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar for both mobile and desktop */}
      <aside 
        className={cn(
          "h-screen flex-col border-r bg-sidebar text-sidebar-foreground fixed left-0 top-0 z-10",
          "transition-transform duration-300 ease-in-out",
          "w-[280px]", // fixed width for all devices
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0", // hide on mobile when closed
          "md:flex" // always show on desktop
        )}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold tracking-tight">Rumba</h2>
          <p className="text-sm text-sidebar-foreground/70">Event Metrics</p>
        </div>
        <nav className="space-y-1 px-3 py-2 flex-1">
          <NavItem to="/" icon={<Home size={18} />}>Dashboard</NavItem>
          <NavItem to="/events" icon={<Calendar size={18} />}>Events</NavItem>
          <NavItem to="/reports" icon={<BarChart2 size={18} />}>Reports</NavItem>
          <NavItem to="/analytics" icon={<TrendingUp size={18} />}>Analytics</NavItem>
          <NavItem to="/settings" icon={<Settings size={18} />}>Settings</NavItem>
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <Button className="w-full" size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Event
          </Button>
        </div>
      </aside>
    </>
  );
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function NavItem({ to, icon, children }: NavItemProps) {
  // We would use a hook to determine if the current path matches the link's path
  const isActive = window.location.pathname === to;
  
  return (
    <Link 
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        isActive 
          ? "bg-sidebar-accent text-sidebar-accent-foreground" 
          : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
      )}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}
