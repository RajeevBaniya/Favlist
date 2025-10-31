import type {
  Entry,
  CreateEntryInput,
  UpdateEntryInput,
  PaginatedResponse,
  ApiResponse,
  ApiError,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error || 'An error occurred');
    }

    return response.json();
  }

  async getEntries(
    limit: number = 20,
    pageToken?: string,
    search?: string,
    type?: 'MOVIE' | 'TV_SHOW'
  ): Promise<PaginatedResponse<Entry>> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      ...(pageToken && { pageToken }),
      ...(search && { search }),
      ...(type && { type }),
    });

    return this.request<PaginatedResponse<Entry>>(
      `/entries?${params.toString()}`
    );
  }

  async getEntryById(id: string): Promise<ApiResponse<Entry>> {
    return this.request<ApiResponse<Entry>>(`/entries/${id}`);
  }

  async createEntry(data: CreateEntryInput): Promise<ApiResponse<Entry>> {
    return this.request<ApiResponse<Entry>>('/entries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEntry(
    id: string,
    data: UpdateEntryInput
  ): Promise<ApiResponse<Entry>> {
    return this.request<ApiResponse<Entry>>(`/entries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEntry(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<ApiResponse<{ message: string }>>(`/entries/${id}`, {
      method: 'DELETE',
    });
  }

  async searchEntries(query: string): Promise<PaginatedResponse<Entry>> {
    const params = new URLSearchParams({ q: query });
    return this.request<PaginatedResponse<Entry>>(
      `/entries/search?${params.toString()}`
    );
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

