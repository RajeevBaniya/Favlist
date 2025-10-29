import { z } from 'zod';

export const entryTypeEnum = z.enum(['MOVIE', 'TV_SHOW']);

export const createEntrySchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  type: entryTypeEnum,
  director: z.string().min(1, 'Director is required').max(255, 'Director name too long'),
  budget: z.string().min(1, 'Budget is required').max(100, 'Budget value too long'),
  location: z.string().min(1, 'Location is required').max(255, 'Location too long'),
  duration: z.string().min(1, 'Duration is required').max(100, 'Duration value too long'),
  yearTime: z.string().min(1, 'Year/Time is required').max(100, 'Year/Time value too long'),
  posterUrl: z.string().url('Invalid URL format').max(500, 'URL too long').optional(),
});

export const updateEntrySchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long').optional(),
  type: entryTypeEnum.optional(),
  director: z.string().min(1, 'Director is required').max(255, 'Director name too long').optional(),
  budget: z.string().min(1, 'Budget is required').max(100, 'Budget value too long').optional(),
  location: z.string().min(1, 'Location is required').max(255, 'Location too long').optional(),
  duration: z.string().min(1, 'Duration is required').max(100, 'Duration value too long').optional(),
  yearTime: z.string().min(1, 'Year/Time is required').max(100, 'Year/Time value too long').optional(),
  posterUrl: z.string().url('Invalid URL format').max(500, 'URL too long').optional(),
});

export const paginationSchema = z.object({
  limit: z.string().regex(/^\d+$/).transform(Number).refine((n) => n > 0 && n <= 100).optional(),
  pageToken: z.string().optional(),
  search: z.string().optional(),
  type: z.enum(['MOVIE', 'TV_SHOW']).optional(),
});

export type CreateEntryInput = z.infer<typeof createEntrySchema>;
export type UpdateEntryInput = z.infer<typeof updateEntrySchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;

