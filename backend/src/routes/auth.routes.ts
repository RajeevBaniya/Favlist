import { Router } from 'express';
import { signupHandler, loginHandler, logoutHandler, meHandler } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { signupSchema, loginSchema } from '../schemas/auth.schema.js';

const router = Router();

router.post('/signup', validate(signupSchema), signupHandler);
router.post('/login', validate(loginSchema), loginHandler);
router.post('/logout', logoutHandler);
router.get('/me', authenticate, meHandler);

export default router;

