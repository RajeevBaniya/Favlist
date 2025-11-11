import { prisma } from '../db/client.js';
import type { CreateEntryInput, UpdateEntryInput } from '../schemas/entry.schema.js';
import type { PaginatedResponse } from '../types/index.js';
import { DEFAULT_PAGE_LIMIT } from '../utils/constants.js';
import type { Entry } from '@prisma/client';

// Pure utility functions
const buildSearchFilter = (searchQuery?: string) => {
  if (!searchQuery?.trim()) return {};
  
  return {
    OR: [
        { title: { contains: searchQuery } },
        { director: { contains: searchQuery } },
        { location: { contains: searchQuery } },
    ],
  };
};

const buildTypeFilter = (filterType?: 'MOVIE' | 'TV_SHOW') => 
  filterType ? { type: filterType } : {};

const buildWhereClause = (searchQuery?: string, filterType?: 'MOVIE' | 'TV_SHOW') => {
  const searchFilter = buildSearchFilter(searchQuery);
  const typeFilter = buildTypeFilter(filterType);
  
  const whereClause = { ...searchFilter, ...typeFilter };
  return Object.keys(whereClause).length > 0 ? whereClause : undefined;
};

const buildPaginationResponse = <T>(entries: T[], take: number): PaginatedResponse<T> => {
    const hasMore = entries.length > take;
    const data = hasMore ? entries.slice(0, -1) : entries;
  const nextPageToken = hasMore && data.length > 0 ? (data[data.length - 1] as any).id : null;

    return {
      data,
      nextPageToken,
      hasMore,
    };
};

// Pure service functions
const createEntry = async (data: CreateEntryInput): Promise<Entry> => 
  prisma.entry.create({ data });

const getEntries = async (
  limit: number = DEFAULT_PAGE_LIMIT, 
  pageToken?: string,
  searchQuery?: string,
  filterType?: 'MOVIE' | 'TV_SHOW'
): Promise<PaginatedResponse<Entry>> => {
  const take = Math.min(limit, 100);
  const whereClause = buildWhereClause(searchQuery, filterType);

  console.log('Service received:', { searchQuery, filterType, limit, pageToken });

  const entries = await prisma.entry.findMany({
    where: whereClause,
    take: take + 1,
    ...(pageToken && {
      skip: 1,
      cursor: { id: pageToken },
    }),
    orderBy: { createdAt: 'desc' },
    });

  return buildPaginationResponse(entries, take);
};

const getEntryById = async (id: string): Promise<Entry | null> =>
  prisma.entry.findUnique({ where: { id } });

const updateEntry = async (id: string, data: UpdateEntryInput): Promise<Entry> =>
  prisma.entry.update({ where: { id }, data });

const deleteEntry = async (id: string): Promise<Entry> =>
  prisma.entry.delete({ where: { id } });

const searchEntries = async (query: string, limit: number = DEFAULT_PAGE_LIMIT): Promise<Entry[]> => {
  const whereClause = buildSearchFilter(query);
  
  return prisma.entry.findMany({
    where: whereClause,
      take: limit,
    orderBy: { createdAt: 'desc' },
    });
};

// Export individual functions
export { 
  createEntry, 
  getEntries, 
  getEntryById, 
  updateEntry, 
  deleteEntry, 
  searchEntries 
};

// Default export object for backward compatibility
const entryService = {
  createEntry,
  getEntries,
  getEntryById,
  updateEntry,
  deleteEntry,
  searchEntries,
};

export default entryService;

