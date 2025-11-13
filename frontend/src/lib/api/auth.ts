import { apiClient } from './client';
import { LoginCredentials, RegisterData, AuthResponse, ApiResponse, User } from '@/types';

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    if (response.data.success && response.data.data) {
      apiClient.setToken(response.data.data.access_token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data.data;
    }
    throw new Error(response.data.message || 'Login failed');
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    if (response.data.success && response.data.data) {
      apiClient.setToken(response.data.data.access_token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data.data;
    }
    throw new Error(response.data.message || 'Registration failed');
  },

  async registerWithRole(data: RegisterData & { role_id: number }): Promise<AuthResponse> {
    // This method is used by admins to create users with specific roles
    // It includes the auth token which is automatically added by apiClient
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    if (response.data.success && response.data.data) {
      // Don't auto-login when admin creates a user
      return response.data.data;
    }
    throw new Error(response.data.message || 'User creation failed');
  },

  async getProfile(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/auth/profile');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch profile');
  },

  async refreshToken(): Promise<string> {
    const response = await apiClient.post<ApiResponse<{ access_token: string }>>('/auth/refresh');
    if (response.data.success && response.data.data?.access_token) {
      const newToken = response.data.data.access_token;
      apiClient.setToken(newToken);
      return newToken;
    }
    throw new Error(response.data.message || 'Failed to refresh token');
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
  },

  getCurrentUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch {
          return null;
        }
      }
    }
    return null;
  },

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('access_token');
    }
    return false;
  },
};
