import express from 'express';
import { register, login } from '../controllers/auth.controller.js';
import validateRequest from '../middleware/validationMiddleware.js';
import { registerSchema, loginSchema } from '../schemas/validationSchemas.js';

const router = express.Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);

export default router;
