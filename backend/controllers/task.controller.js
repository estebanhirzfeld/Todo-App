import { tasks } from '../models/data.js';

export const getTasks = (req, res) => {
  const { userId } = req.params;
  const userTasks = tasks.filter(task => task.userId === userId);
  res.json(userTasks);
};

export const createTask = (req, res) => {
  const { title, userId } = req.body;

  if (!title || !userId) {
    return res.status(400).json({ message: 'Title and userId are required' });
  }

  const newTask = {
    id: Date.now().toString(),
    title,
    userId,
    completed: false,
    createdAt: new Date()
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
};

export const updateTask = (req, res) => {
  const { taskId } = req.params;
  const { title, completed } = req.body;

  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  const task = tasks[taskIndex];
  if (title !== undefined) task.title = title;
  if (completed !== undefined) task.completed = completed;

  res.json(task);
};

export const deleteTask = (req, res) => {
  const { taskId } = req.params;
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  res.json({ message: 'Task deleted' });
};
