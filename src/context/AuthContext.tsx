import React, { createContext, useContext, ReactNode } from 'react';
import { useUser, User } from '@/hooks/use-auth';

// Auth context interface
interface AuthContextType {
  user: User | null | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: undefined,
  isAuthenticated: false,
  isLoading: true,
  isError: false,
});

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Provider component that wraps app and provides auth context
export function AuthProvider({ children }: AuthProviderProps) {
  const { data: user, isLoading, isError } = useUser();
  
  // Determine if user is authenticated
  const isAuthenticated = !!user;
  
  // Memoize the context value to prevent unnecessary re-renders
  const value = React.useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      isError,
    }),
    [user, isAuthenticated, isLoading, isError]
  );
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
} 