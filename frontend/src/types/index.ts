export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role_id: number;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  photo: string | null;
  user_id: number;
  created_at: string;
  updated_at: string;
  // Admin view fields
  first_name?: string;
  last_name?: string;
  owner_email?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  photo?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  count?: number;
  pagination?: PaginationMeta;
  error?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: 'created_at' | 'name' | 'email';
  order?: 'ASC' | 'DESC';
  search?: string;
}
