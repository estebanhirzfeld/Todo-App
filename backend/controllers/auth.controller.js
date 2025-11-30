import { users } from '../models/data.js';

export const register = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password, // Stored in plain text as per requirements
    role: 'user' // Default role
  };

  // Check if it's the first user, maybe make them admin? Or just manual.
  // Prompt says: "Un usuario administrador... también podrá crear usuarios de ambos tipos."
  // For simplicity, let's say if the name contains "admin", they are admin. Or just a hardcoded check.
  // Actually, I'll just default to 'user'.

  users.push(newUser);

  res.status(201).json({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role
  });
};

export const login = (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  });
};
