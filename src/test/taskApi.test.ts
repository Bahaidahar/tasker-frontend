import { describe, it, expect } from 'vitest';
import { taskApi } from '../api/taskApi';

describe('taskApi', () => {
  describe('getAll', () => {
    it('fetches all tasks', async () => {
      const tasks = await taskApi.getAll();

      expect(tasks).toHaveLength(2);
      expect(tasks[0].title).toBe('Test Task 1');
      expect(tasks[1].title).toBe('Test Task 2');
    });
  });

  describe('getById', () => {
    it('fetches task by id', async () => {
      const task = await taskApi.getById(1);

      expect(task.id).toBe(1);
      expect(task.title).toBe('Test Task 1');
    });

    it('throws error for non-existent task', async () => {
      await expect(taskApi.getById(999)).rejects.toThrow();
    });
  });

  describe('search', () => {
    it('searches tasks by text', async () => {
      const tasks = await taskApi.search({ search: 'Task 1' });

      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe('Test Task 1');
    });

    it('filters tasks by status', async () => {
      const tasks = await taskApi.search({ status: 'TODO' });

      expect(tasks.every((t) => t.status === 'TODO')).toBe(true);
    });

    it('filters tasks by priority', async () => {
      const tasks = await taskApi.search({ priority: 'HIGH' });

      expect(tasks.every((t) => t.priority === 'HIGH')).toBe(true);
    });

    it('returns all tasks with no filters', async () => {
      const tasks = await taskApi.search({});

      expect(tasks).toHaveLength(2);
    });
  });

  describe('create', () => {
    it('creates a new task', async () => {
      const newTask = await taskApi.create({
        title: 'New Task',
        description: 'New Description',
        status: 'TODO',
        priority: 'MEDIUM',
      });

      expect(newTask.id).toBe(3);
      expect(newTask.title).toBe('New Task');
    });
  });

  describe('update', () => {
    it('updates existing task', async () => {
      const updatedTask = await taskApi.update(1, {
        title: 'Updated Task',
        status: 'DONE',
        priority: 'LOW',
      });

      expect(updatedTask.title).toBe('Updated Task');
      expect(updatedTask.status).toBe('DONE');
    });
  });

  describe('delete', () => {
    it('deletes existing task', async () => {
      await expect(taskApi.delete(1)).resolves.toBeUndefined();
    });
  });

  describe('exportToExcel', () => {
    it('returns blob for export', async () => {
      const blob = await taskApi.exportToExcel({});

      expect(blob).toBeInstanceOf(Blob);
    });
  });
});
