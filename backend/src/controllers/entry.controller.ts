import type { Request, Response, NextFunction } from 'express';
import { entryService } from '../services/entry.service.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../utils/constants.js';
import type { CreateEntryInput, UpdateEntryInput, PaginationInput } from '../schemas/entry.schema.js';
import type { TypedRequest } from '../types/index.js';

export class EntryController {
  async createEntry(
    req: TypedRequest<CreateEntryInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const entry = await entryService.createEntry(req.body);
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: entry,
        message: 'Entry created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getEntries(
    req: Request<object, object, object, PaginationInput & { search?: string; type?: 'MOVIE' | 'TV_SHOW' }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { limit, pageToken, search, type } = req.query;
      console.log('Search params:', { search, type, limit, pageToken });
      const result = await entryService.getEntries(limit, pageToken, search, type);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result.data,
        pagination: {
          nextPageToken: result.nextPageToken,
          hasMore: result.hasMore,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getEntryById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const entry = await entryService.getEntryById(id);

      if (!entry) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          error: ERROR_MESSAGES.NOT_FOUND,
        });
        return;
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: entry,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateEntry(
    req: TypedRequest<UpdateEntryInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const entry = await entryService.updateEntry(id, req.body);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: entry,
        message: 'Entry updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteEntry(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      await entryService.deleteEntry(id);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Entry deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async searchEntries(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string') {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'Search query is required',
        });
        return;
      }

      const entries = await entryService.searchEntries(q);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: entries,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const entryController = new EntryController();

