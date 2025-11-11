import type {
  Entry,
  CreateEntryInput,
  UpdateEntryInput,
  PaginatedResponse,
  ApiResponse,
  ApiError,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

// Pure utility functions
const buildUrl = (baseUrl: string, endpoint: string): string => 
  `${baseUrl}${endpoint}`;

const buildHeaders = (additionalHeaders?: HeadersInit): HeadersInit => ({
  'Content-Type': 'application/json',
  ...additionalHeaders,
});
    
const buildRequestOptions = (options?: RequestInit): RequestInit => ({
      ...options,
  headers: buildHeaders(options?.headers),
    });

const handleApiError = async (response: Response): Promise<never> => {
      const error: ApiError = await response.json();
      throw new Error(error.error || 'An error occurred');
};

const buildSearchParams = (params: Record<string, string | number | undefined>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, value.toString());
    }
  });
  
  return searchParams.toString();
};

// Core request function
const apiRequest = async <T>(
  endpoint: string,
  options?: RequestInit,
  baseUrl: string = API_BASE_URL
): Promise<T> => {
  const url = buildUrl(baseUrl, endpoint);
  const requestOptions = buildRequestOptions(options);
  
  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json();
};

// Pure API functions
const getEntries = async (
    limit: number = 20,
    pageToken?: string,
    search?: string,
    type?: 'MOVIE' | 'TV_SHOW'
): Promise<PaginatedResponse<Entry>> => {
  const params = buildSearchParams({
    limit,
    pageToken,
    search,
    type,
    });

  return apiRequest<PaginatedResponse<Entry>>(
    `/entries?${params}`
    );
};

const getEntryById = async (id: string): Promise<ApiResponse<Entry>> =>
  apiRequest<ApiResponse<Entry>>(`/entries/${id}`);

const createEntry = async (data: CreateEntryInput): Promise<ApiResponse<Entry>> =>
  apiRequest<ApiResponse<Entry>>('/entries', {
      method: 'POST',
      body: JSON.stringify(data),
    });

const updateEntry = async (
    id: string,
    data: UpdateEntryInput
): Promise<ApiResponse<Entry>> =>
  apiRequest<ApiResponse<Entry>>(`/entries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

const deleteEntry = async (id: string): Promise<ApiResponse<{ message: string }>> =>
  apiRequest<ApiResponse<{ message: string }>>(`/entries/${id}`, {
      method: 'DELETE',
    });

const searchEntries = async (query: string): Promise<PaginatedResponse<Entry>> => {
  const params = buildSearchParams({ q: query });
  return apiRequest<PaginatedResponse<Entry>>(
    `/entries/search?${params}`
  );
};

// Export individual functions
export { 
  getEntries, 
  getEntryById, 
  createEntry, 
  updateEntry, 
  deleteEntry, 
  searchEntries 
};

// Default export object for backward compatibility
const apiClient = {
  getEntries,
  getEntryById,
  createEntry,
  updateEntry,
  deleteEntry,
  searchEntries,
};

export default apiClient;

