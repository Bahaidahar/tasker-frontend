import axios from "axios";
import type { Task, TaskFormData, TaskFilters } from "../types/task";

const API_BASE_URL = "http://localhost:8080/api/tasks";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const taskApi = {
  getAll: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>("");
    return response.data;
  },

  getById: async (id: number): Promise<Task> => {
    const response = await api.get<Task>(`/${id}`);
    return response.data;
  },

  search: async (filters: TaskFilters): Promise<Task[]> => {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.status) params.append("status", filters.status);
    if (filters.priority) params.append("priority", filters.priority);

    const response = await api.get<Task[]>(`/search?${params.toString()}`);
    return response.data;
  },

  create: async (task: TaskFormData): Promise<Task> => {
    const response = await api.post<Task>("", task);
    return response.data;
  },

  update: async (id: number, task: TaskFormData): Promise<Task> => {
    const response = await api.put<Task>(`/${id}`, task);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/${id}`);
  },

  exportToExcel: async (filters: TaskFilters): Promise<Blob> => {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.status) params.append("status", filters.status);
    if (filters.priority) params.append("priority", filters.priority);

    const response = await api.get(`/export?${params.toString()}`, {
      responseType: "blob",
    });
    return response.data;
  },
};
