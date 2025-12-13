import { describe, it, expect } from 'vitest';
import { authApi } from '../api/authApi';

describe('authApi', () => {
  describe('login', () => {
    it('should return auth response with valid credentials', async () => {
      const response = await authApi.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(response).toEqual({
        token: 'mock-jwt-token',
        email: 'test@example.com',
        name: 'Test User',
      });
    });

    it('should throw error with invalid credentials', async () => {
      await expect(
        authApi.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow();
    });
  });

  describe('register', () => {
    it('should return auth response with valid data', async () => {
      const response = await authApi.register({
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
      });

      expect(response).toEqual({
        token: 'mock-jwt-token',
        email: 'newuser@example.com',
        name: 'New User',
      });
    });

    it('should throw error when email already exists', async () => {
      await expect(
        authApi.register({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        })
      ).rejects.toThrow();
    });
  });
});
