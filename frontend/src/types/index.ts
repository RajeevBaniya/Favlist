export type EntryType = 'MOVIE' | 'TV_SHOW';

export interface Entry {
  id: string;
  title: string;
  type: EntryType;
  director: string;
  budget: string;
  location: string;
  duration: string;
  yearTime: string;
  posterUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEntryInput {
  title: string;
  type: EntryType;
  director: string;
  budget: string;
  location: string;
  duration: string;
  yearTime: string;
  posterUrl?: string;
}

export interface UpdateEntryInput extends Partial<CreateEntryInput> {}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    nextPageToken: string | null;
    hasMore: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
}

