import { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Add, Logout } from "@mui/icons-material";
import { TaskCard } from "./TaskCard";
import { TaskForm } from "./TaskForm";
import { TaskFilters } from "./TaskFilters";
import {
  useTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useExportTasks,
} from "../hooks/useTasks";
import type {
  Task,
  TaskFormData,
  TaskFilters as TaskFiltersType,
} from "../types/task";
import { useAuth } from "../context/AuthContext";

export function TaskList() {
  const { user, logout } = useAuth();
  const [filters, setFilters] = useState<TaskFiltersType>({
    search: "",
    status: "",
    priority: "",
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const { data: tasks, isLoading, error } = useTasksQuery(filters);
  const createMutation = useCreateTaskMutation();
  const updateMutation = useUpdateTaskMutation();
  const deleteMutation = useDeleteTaskMutation();
  const exportMutation = useExportTasks();

  const handleOpenCreate = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleSubmit = async (data: TaskFormData) => {
    try {
      if (editingTask) {
        await updateMutation.mutateAsync({ id: editingTask.id, task: data });
        showSnackbar("Task updated successfully", "success");
      } else {
        await createMutation.mutateAsync(data);
        showSnackbar("Task created successfully", "success");
      }
      handleCloseForm();
    } catch {
      showSnackbar("An error occurred", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteMutation.mutateAsync(id);
        showSnackbar("Task deleted successfully", "success");
      } catch {
        showSnackbar("Failed to delete task", "error");
      }
    }
  };

  const handleExport = async () => {
    try {
      await exportMutation.mutateAsync(filters);
      showSnackbar("Export completed", "success");
    } catch {
      showSnackbar("Export failed", "error");
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <AppBar position="static" sx={{ mb: 2 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Task Tracker
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            {user?.name}
          </Typography>
          <IconButton color="inherit" onClick={logout} title="Logout">
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleOpenCreate}
          >
            New Task
          </Button>
        </Box>

      <TaskFilters
        filters={filters}
        onFiltersChange={setFilters}
        onExport={handleExport}
        isExporting={exportMutation.isPending}
      />

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load tasks. Please check if the server is running.
        </Alert>
      )}

      {tasks && tasks.length === 0 && (
        <Alert severity="info">No tasks found. Create your first task!</Alert>
      )}

      <Grid container spacing={2}>
        {tasks?.map((task) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={task.id}>
            <TaskCard
              task={task}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          </Grid>
        ))}
      </Grid>

      <TaskForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        task={editingTask}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}
