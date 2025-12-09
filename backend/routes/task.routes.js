import express from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/task.controller.js';
import authenticateToken from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validationMiddleware.js';
import { createTaskSchema, updateTaskSchema } from '../schemas/validationSchemas.js';

const router = express.Router();

router.use(authenticateToken); // Protect all routes

router.get('/', getTasks);
router.post('/', validateRequest(createTaskSchema), createTask);
router.put('/:taskId', validateRequest(updateTaskSchema), updateTask);
router.delete('/:taskId', deleteTask);

export default router;
