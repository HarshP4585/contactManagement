import { apiClient } from './client';
import { Contact, ContactFormData, ApiResponse, PaginationParams, PaginationMeta } from '@/types';

export interface PaginatedContactsResponse {
  data: Contact[];
  pagination: PaginationMeta;
}

export const contactsApi = {
  async getAll(params?: PaginationParams): Promise<PaginatedContactsResponse> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.order) queryParams.append('order', params.order);
    if (params?.search) queryParams.append('search', params.search);

    const url = `/contacts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get<ApiResponse<Contact[]>>(url);

    if (response.data.success && response.data.data && response.data.pagination) {
      return {
        data: response.data.data,
        pagination: response.data.pagination,
      };
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

  async create(data: ContactFormData | FormData): Promise<Contact> {
    const response = await apiClient.post<ApiResponse<Contact>>('/contacts', data);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to create contact');
  },

  async update(id: number, data: Partial<ContactFormData> | FormData): Promise<Contact> {
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
