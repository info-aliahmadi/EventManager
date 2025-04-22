import { toast } from "sonner";

// Use environment variable or fallback to the production URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 
                    (import.meta.env.PROD ? "http://srv788805.hstgr.cloud/api" : "http://localhost:5000/api");

// Generic API fetch function with error handling
async function fetchApi<T>(
  endpoint: string,
  method: string = "GET",
  data?: any,
  includeToken: boolean = true
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  // Add authorization token if available and needed
  if (includeToken) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  
  const options: RequestInit = {
    method,
    headers,
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    toast.error(errorMessage);
    throw error;
  }
}

// Authentication API
export const authApi = {
  register: (userData: { name: string; email: string; password: string }) => 
    fetchApi<{ user: any; token: string }>("/auth/register", "POST", userData, false),
  
  login: (credentials: { email: string; password: string }) => 
    fetchApi<{ user: any; token: string }>("/auth/login", "POST", credentials, false),
  
  verifyToken: () => 
    fetchApi<{ user: any }>("/auth/verify", "GET"),
  
  updateProfile: (data: { name?: string; email?: string; phone?: string; bio?: string }) =>
    fetchApi<{ user: any }>("/auth/profile", "PUT", data),
  
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    fetchApi<{ message: string }>("/auth/change-password", "POST", data),
    
  logout: () => {
    localStorage.removeItem('auth_token');
    return Promise.resolve();
  }
};

// Events API
export const eventApi = {
  getAll: () => fetchApi<any[]>("/events"),
  getById: (id: number) => fetchApi<any>(`/events/${id}`),
  create: (data: any) => fetchApi<any>("/events", "POST", data),
  update: (id: number, data: any) => fetchApi<any>(`/events/${id}`, "PUT", data),
  delete: (id: number) => fetchApi<any>(`/events/${id}`, "DELETE")
};

// Expenses API
export const expenseApi = {
  getByEventId: (eventId: number) => fetchApi<any[]>(`/events/${eventId}/expenses`),
  getById: (id: number) => fetchApi<any>(`/expenses/${id}`),
  create: (eventId: number, data: any) => fetchApi<any>(`/events/${eventId}/expenses`, "POST", data),
  update: (id: number, data: any) => fetchApi<any>(`/expenses/${id}`, "PUT", data),
  delete: (id: number) => fetchApi<any>(`/expenses/${id}`, "DELETE")
};

// Reports API
export const reportApi = {
  getFinancialSummary: () => fetchApi<any>("/financial-summary"),
  getMonthlyPerformance: () => fetchApi<any[]>("/monthly-performance"),
  getEventPerformance: () => fetchApi<any[]>("/event-performance"),
  getExpenseBreakdown: () => fetchApi<any[]>("/expense-breakdown")
};

// System API
export const systemApi = {
  getDatabaseHealth: () => fetchApi<any>("/database/health")
};

export default {
  authApi,
  eventApi,
  expenseApi,
  reportApi,
  systemApi
}; 