import axios from "axios";
import type { Task, TaskFormData, TaskFilters } from "../types/task";

const API_BASE_URL = "https://tasker-backend-yftj.onrender.com/api/tasks";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
