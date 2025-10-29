import { Router } from 'express';
import { entryController } from '../controllers/entry.controller.js';
import { validate, validateQuery } from '../middlewares/validate.middleware.js';
import { createEntrySchema, updateEntrySchema, paginationSchema } from '../schemas/entry.schema.js';

const router = Router();

// POST /api/entries - Create new entry
router.post(
  '/',
  validate(createEntrySchema),
  entryController.createEntry.bind(entryController)
);

// GET /api/entries - List all entries with pagination
router.get(
  '/',
  validateQuery(paginationSchema),
  entryController.getEntries.bind(entryController)
);

// GET /api/entries/search - Search entries
router.get(
  '/search',
  entryController.searchEntries.bind(entryController)
);

// GET /api/entries/:id - Get single entry
router.get(
  '/:id',
  entryController.getEntryById.bind(entryController)
);

// PUT /api/entries/:id - Update entry
router.put(
  '/:id',
  validate(updateEntrySchema),
  entryController.updateEntry.bind(entryController)
);

// DELETE /api/entries/:id - Delete entry
router.delete(
  '/:id',
  entryController.deleteEntry.bind(entryController)
);

export { router as entryRoutes };

