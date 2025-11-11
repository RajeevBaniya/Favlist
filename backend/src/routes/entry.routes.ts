import { Router } from 'express';
import { 
  createEntryHandler, 
  getEntriesHandler, 
  getEntryByIdHandler, 
  updateEntryHandler, 
  deleteEntryHandler, 
  searchEntriesHandler 
} from '../controllers/entry.controller.js';
import { validate, validateQuery } from '../middlewares/validate.middleware.js';
import { createEntrySchema, updateEntrySchema, paginationSchema } from '../schemas/entry.schema.js';

const router = Router();

// POST /api/entries - Create new entry
router.post(
  '/',
  validate(createEntrySchema),
  createEntryHandler
);

// GET /api/entries - List all entries with pagination
router.get(
  '/',
  validateQuery(paginationSchema),
  getEntriesHandler
);

// GET /api/entries/search - Search entries
router.get(
  '/search',
  searchEntriesHandler
);

// GET /api/entries/:id - Get single entry
router.get(
  '/:id',
  getEntryByIdHandler
);

// PUT /api/entries/:id - Update entry
router.put(
  '/:id',
  validate(updateEntrySchema),
  updateEntryHandler
);

// DELETE /api/entries/:id - Delete entry
router.delete(
  '/:id',
  deleteEntryHandler
);

export { router as entryRoutes };

