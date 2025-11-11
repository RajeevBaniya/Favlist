import type { Request, Response, NextFunction } from 'express';
import { 
  createEntry, 
  getEntries, 
  getEntryById, 
  updateEntry, 
  deleteEntry, 
  searchEntries 
} from '../services/entry.service.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../utils/constants.js';
import type { CreateEntryInput, UpdateEntryInput, PaginationInput } from '../schemas/entry.schema.js';
import type { TypedRequest } from '../types/index.js';

// Pure utility functions
const createSuccessResponse = (data: any, message?: string) => ({
  success: true,
  data,
  ...(message && { message }),
});

const createPaginatedResponse = (data: any, pagination: any) => ({
  success: true,
  data,
  pagination,
});

const createErrorResponse = (error: string) => ({
  success: false,
  error,
});

const validateSearchQuery = (q: unknown): q is string => 
  typeof q === 'string' && q.trim().length > 0;

// Pure controller functions
const createEntryHandler = async (
    req: TypedRequest<CreateEntryInput>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
    const entry = await createEntry(req.body);
    res.status(HTTP_STATUS.CREATED).json(
      createSuccessResponse(entry, 'Entry created successfully')
    );
    } catch (error) {
      next(error);
    }
};

const getEntriesHandler = async (
    req: Request<object, object, object, PaginationInput & { search?: string; type?: 'MOVIE' | 'TV_SHOW' }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
      const { limit, pageToken, search, type } = req.query;
      console.log('Search params:', { search, type, limit, pageToken });
    
    const result = await getEntries(limit, pageToken, search, type);
      
    res.status(HTTP_STATUS.OK).json(
      createPaginatedResponse(result.data, {
          nextPageToken: result.nextPageToken,
          hasMore: result.hasMore,
      })
    );
    } catch (error) {
      next(error);
    }
};

const getEntryByIdHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
      const { id } = req.params;
    const entry = await getEntryById(id);

      if (!entry) {
      res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse(ERROR_MESSAGES.NOT_FOUND)
      );
        return;
      }

    res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(entry)
    );
    } catch (error) {
      next(error);
    }
};

const updateEntryHandler = async (
    req: TypedRequest<UpdateEntryInput>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
      const { id } = req.params;
    const entry = await updateEntry(id, req.body);

    res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(entry, 'Entry updated successfully')
    );
    } catch (error) {
      next(error);
    }
};

const deleteEntryHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
      const { id } = req.params;
    await deleteEntry(id);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Entry deleted successfully',
      });
    } catch (error) {
      next(error);
    }
};

const searchEntriesHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
      const { q } = req.query;
      
    if (!validateSearchQuery(q)) {
      res.status(HTTP_STATUS.BAD_REQUEST).json(
        createErrorResponse('Search query is required')
      );
        return;
      }

    const entries = await searchEntries(q);
      
    res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(entries)
    );
    } catch (error) {
      next(error);
    }
};

// Export individual functions
export { 
  createEntryHandler, 
  getEntriesHandler, 
  getEntryByIdHandler, 
  updateEntryHandler, 
  deleteEntryHandler, 
  searchEntriesHandler 
};

// Default export object for backward compatibility
const entryController = {
  createEntry: createEntryHandler,
  getEntries: getEntriesHandler,
  getEntryById: getEntryByIdHandler,
  updateEntry: updateEntryHandler,
  deleteEntry: deleteEntryHandler,
  searchEntries: searchEntriesHandler,
};

export default entryController;

