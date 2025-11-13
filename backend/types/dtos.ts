export interface RegisterDto {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role_id?: number;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateContactDto {
  name: string;
  email: string;
  phone: string;
  photo?: string;
}

export interface UpdateContactDto {
  name?: string;
  email?: string;
  phone?: string;
  photo?: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role_id: number;
  };
}

export interface JwtPayload {
  userId: number;
  email: string;
  role_id: number;
}
