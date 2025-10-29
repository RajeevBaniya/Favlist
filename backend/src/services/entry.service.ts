import { prisma } from '../db/client.js';
import type { CreateEntryInput, UpdateEntryInput } from '../schemas/entry.schema.js';
import type { PaginatedResponse } from '../types/index.js';
import { DEFAULT_PAGE_LIMIT } from '../utils/constants.js';
import type { Entry } from '@prisma/client';

export class EntryService {
  async createEntry(data: CreateEntryInput): Promise<Entry> {
    return await prisma.entry.create({
      data,
    });
  }

  async getEntries(
    limit: number = DEFAULT_PAGE_LIMIT, 
    pageToken?: string,
    searchQuery?: string,
    filterType?: 'MOVIE' | 'TV_SHOW'
  ): Promise<PaginatedResponse<Entry>> {
    const take = Math.min(limit, 100);

    const whereClause: any = {};

    console.log('Service received:', { searchQuery, filterType, limit, pageToken });

    // Add search filter
    if (searchQuery && searchQuery.trim()) {
      console.log('Adding search filter for:', searchQuery);
      whereClause.OR = [
        { title: { contains: searchQuery } },
        { director: { contains: searchQuery } },
        { location: { contains: searchQuery } },
      ];
    }

    // Add type filter
    if (filterType) {
      whereClause.type = filterType;
    }

    const entries = await prisma.entry.findMany({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      take: take + 1,
      ...(pageToken && {
        skip: 1,
        cursor: {
          id: pageToken,
        },
      }),
      orderBy: {
        createdAt: 'desc',
      },
    });

    const hasMore = entries.length > take;
    const data = hasMore ? entries.slice(0, -1) : entries;
    const nextPageToken = hasMore ? data[data.length - 1].id : null;

    return {
      data,
      nextPageToken,
      hasMore,
    };
  }

  async getEntryById(id: string): Promise<Entry | null> {
    return await prisma.entry.findUnique({
      where: { id },
    });
  }

  async updateEntry(id: string, data: UpdateEntryInput): Promise<Entry> {
    return await prisma.entry.update({
      where: { id },
      data,
    });
  }

  async deleteEntry(id: string): Promise<Entry> {
    return await prisma.entry.delete({
      where: { id },
    });
  }

  async searchEntries(query: string, limit: number = DEFAULT_PAGE_LIMIT): Promise<Entry[]> {
    return await prisma.entry.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { director: { contains: query } },
          { location: { contains: query } },
        ],
      },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}

export const entryService = new EntryService();

