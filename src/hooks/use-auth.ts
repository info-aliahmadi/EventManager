import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Types
export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Current user hook that verifies the token
export function useUser() {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: () => authApi.verifyToken()
      .then(data => data.user)
      .catch(() => null),
    // Retry only once if token verification fails
    retry: 1,
    // Don't refetch on window focus for auth state
    refetchOnWindowFocus: false,
  });
}

// Login hook
export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => 
      authApi.login(credentials)
        .then(data => {
          // Store token in localStorage
          localStorage.setItem('auth_token', data.token);
          return data.user;
        }),
    onSuccess: (userData) => {
      // Update user data in the cache
      queryClient.setQueryData(['current-user'], userData);
      
      // Invalidate any queries that might need the token
      queryClient.invalidateQueries();
      
      // Redirect to dashboard
      navigate('/');
    },
  });
}

// Registration hook
export function useRegister() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (userData: RegisterData) => 
      authApi.register(userData)
        .then(data => {
          // Store token in localStorage
          localStorage.setItem('auth_token', data.token);
          return data.user;
        }),
    onSuccess: (userData) => {
      // Update user data in the cache
      queryClient.setQueryData(['current-user'], userData);
      
      // Invalidate any queries that might need the token
      queryClient.invalidateQueries();
      
      // Redirect to dashboard
      navigate('/');
    },
  });
}

// Logout hook
export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Remove user from cache
      queryClient.setQueryData(['current-user'], null);
      
      // Invalidate all queries
      queryClient.clear();
      
      // Redirect to login
      navigate('/login');
    },
  });
}

// Update profile hook
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { name?: string; email?: string; phone?: string; bio?: string }) => 
      authApi.updateProfile(data),
    onSuccess: (data) => {
      // Update user data in the cache
      queryClient.setQueryData(['current-user'], data.user);
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
    },
  });
}

// Change password hook
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) => 
      authApi.changePassword(data),
  });
}

// Hook to redirect if user is not authenticated
export function useRequireAuth(redirectTo = '/login') {
  const { data: user, isLoading, isError } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !user) {
      navigate(redirectTo);
    }
  }, [navigate, redirectTo, isLoading, user]);
  
  return { user, isLoading, isError };
}

// Hook to redirect if user is already authenticated
export function useRedirectAuthenticated(redirectTo = '/') {
  const { data: user, isLoading } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && user) {
      navigate(redirectTo);
    }
  }, [navigate, redirectTo, isLoading, user]);
  
  return { user, isLoading };
} 