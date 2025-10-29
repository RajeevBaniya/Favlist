import { Router } from 'express';
import { healthRoutes } from './health.routes.js';
import authRoutes from './auth.routes.js';
import { entryRoutes } from './entry.routes.js';

const router = Router();

// Health check
router.use('/health', healthRoutes);

// Auth routes
router.use('/auth', authRoutes);

// API routes
router.use('/entries', entryRoutes);

export { router as apiRoutes };

