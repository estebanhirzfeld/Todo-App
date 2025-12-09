import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTasks = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const userTasks = await prisma.task.findMany({
      where: { userId },
    });
    res.json(userTasks);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { title } = req.body;
    const userId = req.user.userId;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        userId,
        completed: false,
      },
    });

    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { title, completed } = req.body;
    const userId = req.user.userId;

    const updatedTask = await prisma.task.update({
      where: {
        id: parseInt(taskId),
        userId, // Ensure user owns the task
      },
      data: {
        title,
        completed,
      },
    });

    res.json(updatedTask);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Task not found' });
    }
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.userId;

    await prisma.task.delete({
      where: {
        id: parseInt(taskId),
        userId, // Ensure user owns the task
      },
    });

    res.json({ message: 'Task deleted' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Task not found' });
    }
    next(error);
  }
};
