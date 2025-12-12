import { http, HttpResponse } from 'msw';
import type { Task } from '../../types/task';

const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Test Task 1',
    description: 'Description 1',
    status: 'TODO',
    priority: 'HIGH',
    createdAt: '2024-01-01T10:00:00',
    updatedAt: '2024-01-01T10:00:00',
  },
  {
    id: 2,
    title: 'Test Task 2',
    description: 'Description 2',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    createdAt: '2024-01-02T10:00:00',
    updatedAt: '2024-01-02T10:00:00',
  },
];

export const handlers = [
  http.get('http://localhost:8080/api/tasks/export', () => {
    return new HttpResponse(new Blob(['xlsx content']), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });
  }),

  http.get('http://localhost:8080/api/tasks/search', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase();
    const status = url.searchParams.get('status');
    const priority = url.searchParams.get('priority');

    let filtered = [...mockTasks];

    if (search) {
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(search) ||
          t.description?.toLowerCase().includes(search)
      );
    }
    if (status) {
      filtered = filtered.filter((t) => t.status === status);
    }
    if (priority) {
      filtered = filtered.filter((t) => t.priority === priority);
    }

    return HttpResponse.json(filtered);
  }),

  http.get('http://localhost:8080/api/tasks/:id', ({ params }) => {
    const task = mockTasks.find((t) => t.id === Number(params.id));
    if (!task) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(task);
  }),

  http.post('http://localhost:8080/api/tasks', async ({ request }) => {
    const body = await request.json() as Partial<Task>;
    const newTask: Task = {
      id: 3,
      title: body.title || '',
      description: body.description,
      status: body.status || 'TODO',
      priority: body.priority || 'MEDIUM',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(newTask, { status: 201 });
  }),

  http.put('http://localhost:8080/api/tasks/:id', async ({ params, request }) => {
    const body = await request.json() as Partial<Task>;
    const task = mockTasks.find((t) => t.id === Number(params.id));
    if (!task) {
      return new HttpResponse(null, { status: 404 });
    }
    const updatedTask = { ...task, ...body, updatedAt: new Date().toISOString() };
    return HttpResponse.json(updatedTask);
  }),

  http.delete('http://localhost:8080/api/tasks/:id', ({ params }) => {
    const task = mockTasks.find((t) => t.id === Number(params.id));
    if (!task) {
      return new HttpResponse(null, { status: 404 });
    }
    return new HttpResponse(null, { status: 204 });
  }),

  http.get('http://localhost:8080/api/tasks', () => {
    return HttpResponse.json(mockTasks);
  }),
];
