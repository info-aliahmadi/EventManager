import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddEvent from "./pages/AddEvent";
import AddExpense from "./pages/AddExpense";
import Events from "./pages/Events";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { AppShell } from "./components/layout/AppShell";
import EventDetails from "./pages/EventDetails";
import EditEvent from "./pages/EditEvent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <AppShell>
              <Dashboard />
            </AppShell>
          } />
          <Route path="/add-event" element={
            <AppShell>
              <AddEvent />
            </AppShell>
          } />
          <Route path="/events/:id/edit" element={
            <AppShell>
              <EditEvent />
            </AppShell>
          } />
          <Route path="/events/:id" element={
            <AppShell>
              <EventDetails />
            </AppShell>
          } />
          <Route path="/add-expense" element={
            <AppShell>
              <AddExpense />
            </AppShell>
          } />
          <Route path="/events" element={
            <AppShell>
              <Events />
            </AppShell>
          } />
          <Route path="/reports" element={
            <AppShell>
              <Reports />
            </AppShell>
          } />
          <Route path="/analytics" element={
            <AppShell>
              <Analytics />
            </AppShell>
          } />
          <Route path="/settings" element={
            <AppShell>
              <Settings />
            </AppShell>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
