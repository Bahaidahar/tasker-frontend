import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { RegisterPage } from '../pages/RegisterPage';
import { AuthProvider } from '../context/AuthContext';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderRegisterPage = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Rendering', () => {
    it('should render registration form with all fields', () => {
      renderRegisterPage();

      expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      // Get password fields by their specific placeholders/labels
      const passwordFields = screen.getAllByLabelText(/password/i);
      expect(passwordFields.length).toBe(2);
      expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    });

    it('should render link to login page', () => {
      renderRegisterPage();

      expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /login/i })).toHaveAttribute('href', '/login');
    });
  });

  describe('Form Validation', () => {
    it('should show error when passwords do not match', async () => {
      const user = userEvent.setup();
      renderRegisterPage();

      const passwordFields = screen.getAllByLabelText(/password/i);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(passwordFields[0], 'password123');
      await user.type(passwordFields[1], 'differentpassword');

      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should show error when password is too short', async () => {
      const user = userEvent.setup();
      renderRegisterPage();

      const passwordFields = screen.getAllByLabelText(/password/i);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(passwordFields[0], '123');
      await user.type(passwordFields[1], '123');

      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Registration Flow', () => {
    it('should register successfully with valid data', async () => {
      const user = userEvent.setup();
      renderRegisterPage();

      const passwordFields = screen.getAllByLabelText(/password/i);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'newuser@example.com');
      await user.type(passwordFields[0], 'password123');
      await user.type(passwordFields[1], 'password123');

      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });

      expect(localStorage.getItem('auth_token')).toBe('mock-jwt-token');
    });

    it('should show error when email already exists', async () => {
      const user = userEvent.setup();
      renderRegisterPage();

      const passwordFields = screen.getAllByLabelText(/password/i);

      // Use existing email from mock
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(passwordFields[0], 'password123');
      await user.type(passwordFields[1], 'password123');

      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should complete registration flow', async () => {
      const user = userEvent.setup();
      renderRegisterPage();

      const passwordFields = screen.getAllByLabelText(/password/i);

      await user.type(screen.getByLabelText(/name/i), 'Another User');
      await user.type(screen.getByLabelText(/email/i), 'another@example.com');
      await user.type(passwordFields[0], 'password123');
      await user.type(passwordFields[1], 'password123');

      await user.click(screen.getByRole('button', { name: /register/i }));

      // After successful registration, navigate should be called
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });
  });
});
