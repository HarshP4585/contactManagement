import { apiClient } from './client';
import { Contact, ContactFormData, ApiResponse } from '@/types';

export const contactsApi = {
  async getAll(): Promise<Contact[]> {
    const response = await apiClient.get<ApiResponse<Contact[]>>('/contacts');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch contacts');
  },

  async getById(id: number): Promise<Contact> {
    const response = await apiClient.get<ApiResponse<Contact>>(`/contacts/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch contact');
  },

  async create(data: ContactFormData): Promise<Contact> {
    const response = await apiClient.post<ApiResponse<Contact>>('/contacts', data);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to create contact');
  },

  async update(id: number, data: Partial<ContactFormData>): Promise<Contact> {
    const response = await apiClient.put<ApiResponse<Contact>>(`/contacts/${id}`, data);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to update contact');
  },

  async delete(id: number): Promise<void> {
    const response = await apiClient.delete<ApiResponse<void>>(`/contacts/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete contact');
    }
  },
};
