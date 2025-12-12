import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskFilters } from '../components/TaskFilters';
import type { TaskFilters as TaskFiltersType } from '../types/task';

const defaultFilters: TaskFiltersType = {
  search: '',
  status: '',
  priority: '',
};

describe('TaskFilters', () => {
  it('renders search input', () => {
    render(
      <TaskFilters
        filters={defaultFilters}
        onFiltersChange={vi.fn()}
        onExport={vi.fn()}
        isExporting={false}
      />
    );

    expect(screen.getByLabelText(/search/i)).toBeInTheDocument();
  });

  it('renders status select', () => {
    render(
      <TaskFilters
        filters={defaultFilters}
        onFiltersChange={vi.fn()}
        onExport={vi.fn()}
        isExporting={false}
      />
    );

    expect(screen.getAllByText('Status').length).toBeGreaterThan(0);
  });

  it('renders priority select', () => {
    render(
      <TaskFilters
        filters={defaultFilters}
        onFiltersChange={vi.fn()}
        onExport={vi.fn()}
        isExporting={false}
      />
    );

    expect(screen.getAllByText('Priority').length).toBeGreaterThan(0);
  });

  it('renders export button', () => {
    render(
      <TaskFilters
        filters={defaultFilters}
        onFiltersChange={vi.fn()}
        onExport={vi.fn()}
        isExporting={false}
      />
    );

    expect(screen.getByRole('button', { name: /export xlsx/i })).toBeInTheDocument();
  });

  it('calls onFiltersChange when search input changes', async () => {
    const user = userEvent.setup();
    const onFiltersChange = vi.fn();
    render(
      <TaskFilters
        filters={defaultFilters}
        onFiltersChange={onFiltersChange}
        onExport={vi.fn()}
        isExporting={false}
      />
    );

    const searchInput = screen.getByLabelText(/search/i);
    await user.type(searchInput, 'test');

    expect(onFiltersChange).toHaveBeenCalled();
  });

  it('calls onExport when export button clicked', async () => {
    const user = userEvent.setup();
    const onExport = vi.fn();
    render(
      <TaskFilters
        filters={defaultFilters}
        onFiltersChange={vi.fn()}
        onExport={onExport}
        isExporting={false}
      />
    );

    const exportButton = screen.getByRole('button', { name: /export xlsx/i });
    await user.click(exportButton);

    expect(onExport).toHaveBeenCalled();
  });

  it('disables export button when exporting', () => {
    render(
      <TaskFilters
        filters={defaultFilters}
        onFiltersChange={vi.fn()}
        onExport={vi.fn()}
        isExporting={true}
      />
    );

    const exportButton = screen.getByRole('button', { name: /exporting/i });
    expect(exportButton).toBeDisabled();
  });

  it('shows clear button when filters are set', () => {
    const filtersWithSearch: TaskFiltersType = {
      search: 'test',
      status: '',
      priority: '',
    };
    render(
      <TaskFilters
        filters={filtersWithSearch}
        onFiltersChange={vi.fn()}
        onExport={vi.fn()}
        isExporting={false}
      />
    );

    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('does not show clear button when no filters', () => {
    render(
      <TaskFilters
        filters={defaultFilters}
        onFiltersChange={vi.fn()}
        onExport={vi.fn()}
        isExporting={false}
      />
    );

    expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();
  });

  it('calls onFiltersChange with empty values when clear clicked', async () => {
    const user = userEvent.setup();
    const onFiltersChange = vi.fn();
    const filtersWithSearch: TaskFiltersType = {
      search: 'test',
      status: 'TODO',
      priority: 'HIGH',
    };
    render(
      <TaskFilters
        filters={filtersWithSearch}
        onFiltersChange={onFiltersChange}
        onExport={vi.fn()}
        isExporting={false}
      />
    );

    const clearButton = screen.getByRole('button', { name: /clear/i });
    await user.click(clearButton);

    expect(onFiltersChange).toHaveBeenCalledWith({ search: '', status: '', priority: '' });
  });
});
