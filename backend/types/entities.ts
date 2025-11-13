export interface Role {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role_id: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  photo: string | null;
  user_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface UserWithRole extends Omit<User, 'password'> {
  role_name: string;
}

export interface ContactResponse extends Contact {
  user_name?: string;
}
