import { toast } from "sonner";

const API_BASE_URL = "http://localhost:5000/api";

// Generic API fetch function with error handling
async function fetchApi<T>(
  endpoint: string,
  method: string = "GET",
  data?: any
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
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
  eventApi,
  expenseApi,
  reportApi,
  systemApi
}; 