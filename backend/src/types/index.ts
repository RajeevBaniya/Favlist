import type { Request } from 'express';

export interface PaginationQuery {
  limit?: string;
  pageToken?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  nextPageToken: string | null;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface TypedRequest<T> extends Request {
  body: T;
}

