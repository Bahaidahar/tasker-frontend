import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useTasksQuery, useCreateTaskMutation, useDeleteTaskMutation } from '../hooks/useTasks';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useTasks hooks', () => {
  describe('useTasksQuery', () => {
    it('fetches all tasks', async () => {
      const { result } = renderHook(
        () => useTasksQuery({ search: '', status: '', priority: '' }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toHaveLength(2);
      expect(result.current.data?.[0].title).toBe('Test Task 1');
    });

    it('fetches tasks with search filter', async () => {
      const { result } = renderHook(
        () => useTasksQuery({ search: 'Task 1', status: '', priority: '' }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toHaveLength(1);
      expect(result.current.data?.[0].title).toBe('Test Task 1');
    });

    it('fetches tasks with status filter', async () => {
      const { result } = renderHook(
        () => useTasksQuery({ search: '', status: 'IN_PROGRESS', priority: '' }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toHaveLength(1);
      expect(result.current.data?.[0].status).toBe('IN_PROGRESS');
    });

    it('fetches tasks with priority filter', async () => {
      const { result } = renderHook(
        () => useTasksQuery({ search: '', status: '', priority: 'HIGH' }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toHaveLength(1);
      expect(result.current.data?.[0].priority).toBe('HIGH');
    });
  });

  describe('useCreateTaskMutation', () => {
    it('creates a new task', async () => {
      const { result } = renderHook(() => useCreateTaskMutation(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        title: 'New Task',
        description: 'New Description',
        status: 'TODO',
        priority: 'MEDIUM',
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.title).toBe('New Task');
    });
  });

  describe('useDeleteTaskMutation', () => {
    it('deletes a task', async () => {
      const { result } = renderHook(() => useDeleteTaskMutation(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(1);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
    });
  });
});
