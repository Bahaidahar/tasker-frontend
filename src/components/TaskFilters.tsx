import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  InputAdornment,
} from '@mui/material';
import { Search, Download, Clear } from '@mui/icons-material';
import type { TaskFilters as TaskFiltersType, TaskStatus, TaskPriority } from '../types/task';

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onFiltersChange: (filters: TaskFiltersType) => void;
  onExport: () => void;
  isExporting: boolean;
}

export function TaskFilters({
  filters,
  onFiltersChange,
  onExport,
  isExporting,
}: TaskFiltersProps) {
  const handleClear = () => {
    onFiltersChange({ search: '', status: '', priority: '' });
  };

  const hasFilters = filters.search || filters.status || filters.priority;

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        mb: 3,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        value={filters.search || ''}
        onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
        sx={{ minWidth: 200, flexGrow: 1 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={filters.status || ''}
          label="Status"
          onChange={(e) =>
            onFiltersChange({ ...filters, status: e.target.value as TaskStatus | '' })
          }
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="TODO">To Do</MenuItem>
          <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
          <MenuItem value="DONE">Done</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>Priority</InputLabel>
        <Select
          value={filters.priority || ''}
          label="Priority"
          onChange={(e) =>
            onFiltersChange({ ...filters, priority: e.target.value as TaskPriority | '' })
          }
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="LOW">Low</MenuItem>
          <MenuItem value="MEDIUM">Medium</MenuItem>
          <MenuItem value="HIGH">High</MenuItem>
        </Select>
      </FormControl>

      {hasFilters && (
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleClear}
          startIcon={<Clear />}
        >
          Clear
        </Button>
      )}

      <Button
        variant="contained"
        color="success"
        onClick={onExport}
        disabled={isExporting}
        startIcon={<Download />}
      >
        {isExporting ? 'Exporting...' : 'Export XLSX'}
      </Button>
    </Box>
  );
}
