import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  IconButton,
  Box,
  Tooltip,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import type { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

const statusColors: Record<string, 'default' | 'primary' | 'success'> = {
  TODO: 'default',
  IN_PROGRESS: 'primary',
  DONE: 'success',
};

const statusLabels: Record<string, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

const priorityColors: Record<string, 'success' | 'warning' | 'error'> = {
  LOW: 'success',
  MEDIUM: 'warning',
  HIGH: 'error',
};

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.2s',
        '&:hover': {
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Chip
            label={statusLabels[task.status]}
            color={statusColors[task.status]}
            size="small"
          />
          <Chip
            label={task.priority}
            color={priorityColors[task.priority]}
            size="small"
            variant="outlined"
          />
        </Box>

        <Typography variant="h6" component="h2" gutterBottom>
          {task.title}
        </Typography>

        {task.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {task.description}
          </Typography>
        )}

        <Typography variant="caption" color="text.secondary" display="block">
          Created: {formatDate(task.createdAt)}
        </Typography>

        {task.dueDate && (
          <Typography variant="caption" color="text.secondary" display="block">
            Due: {formatDate(task.dueDate)}
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => onEdit(task)} color="primary" size="small">
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton onClick={() => onDelete(task.id)} color="error" size="small">
            <Delete />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}
