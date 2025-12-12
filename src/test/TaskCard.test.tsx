import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskCard } from '../components/TaskCard';
import type { Task } from '../types/task';

const mockTask: Task = {
  id: 1,
  title: 'Test Task',
  description: 'Test Description',
  status: 'TODO',
  priority: 'HIGH',
  createdAt: '2024-01-01T10:00:00',
  updatedAt: '2024-01-01T10:00:00',
};

describe('TaskCard', () => {
  it('renders task title and description', () => {
    render(<TaskCard task={mockTask} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders status chip', () => {
    render(<TaskCard task={mockTask} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText('To Do')).toBeInTheDocument();
  });

  it('renders priority chip', () => {
    render(<TaskCard task={mockTask} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText('HIGH')).toBeInTheDocument();
  });

  it('calls onEdit when edit button clicked', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(<TaskCard task={mockTask} onEdit={onEdit} onDelete={vi.fn()} />);

    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);

    expect(onEdit).toHaveBeenCalledWith(mockTask);
  });

  it('calls onDelete when delete button clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<TaskCard task={mockTask} onEdit={vi.fn()} onDelete={onDelete} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it('renders due date when provided', () => {
    const taskWithDueDate: Task = {
      ...mockTask,
      dueDate: '2024-12-31T23:59:00',
    };
    render(<TaskCard task={taskWithDueDate} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText(/Due:/)).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    const taskWithoutDesc: Task = {
      ...mockTask,
      description: undefined,
    };
    render(<TaskCard task={taskWithoutDesc} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  it('renders different status colors', () => {
    const inProgressTask: Task = { ...mockTask, status: 'IN_PROGRESS' };
    render(<TaskCard task={inProgressTask} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('renders done status', () => {
    const doneTask: Task = { ...mockTask, status: 'DONE' };
    render(<TaskCard task={doneTask} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText('Done')).toBeInTheDocument();
  });
});
