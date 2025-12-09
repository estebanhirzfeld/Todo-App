"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Modal from '../../components/Modal';
import Toast from '../../components/Toast';

interface Task {
  id: number; // Changed to number to match backend
  title: string;
  completed: boolean;
  userId: number;
}

type ModalType = 'create' | 'edit' | 'delete' | null;

export default function TasksPage() {
  const { user, token, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  
  // Form State
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editTaskTitle, setEditTaskTitle] = useState('');
  
  // Toast State
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    } else if (token) {
      fetchTasks();
    }
  }, [isAuthenticated, token, router]);

  const fetchTasks = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      } else if (res.status === 401) {
        logout();
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: string) => {
    setToast({ message, type });
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTaskTitle }),
      });

      if (res.ok) {
        const newTask = await res.json();
        setTasks([...tasks, newTask]);
        setNewTaskTitle('');
        setActiveModal(null);
        showToast('Task created successfully', 'success');
      } else if (res.status === 401) {
        logout();
      } else {
        showToast('Failed to create task', 'error');
      }
    } catch (error) {
      showToast('Error creating task', 'error');
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTask || !token) return;

    try {
      const res = await fetch(`${API_URL}/tasks/${currentTask.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title: editTaskTitle }),
      });

      if (res.ok) {
        const updatedTask = await res.json();
        setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
        setActiveModal(null);
        setCurrentTask(null);
        showToast('Task updated successfully', 'success');
      } else if (res.status === 401) {
        logout();
      } else {
        showToast('Failed to update task', 'error');
      }
    } catch (error) {
      showToast('Error updating task', 'error');
    }
  };

  const handleToggleComplete = async (task: Task) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: !task.completed }),
      });

      if (res.ok) {
        const updatedTask = await res.json();
        setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
      } else if (res.status === 401) {
        logout();
      }
    } catch (error) {
      showToast('Error updating task', 'error');
    }
  };

  const handleDeleteTask = async () => {
    if (!currentTask || !token) return;

    try {
      const res = await fetch(`${API_URL}/tasks/${currentTask.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setTasks(tasks.filter(t => t.id !== currentTask.id));
        setActiveModal(null);
        setCurrentTask(null);
        showToast('Task deleted successfully', 'success');
      } else if (res.status === 401) {
        logout();
      } else {
        showToast('Failed to delete task', 'error');
      }
    } catch (error) {
      showToast('Error deleting task', 'error');
    }
  };

  const openEditModal = (task: Task) => {
    setCurrentTask(task);
    setEditTaskTitle(task.title);
    setActiveModal('edit');
  };

  const openDeleteModal = (task: Task) => {
    setCurrentTask(task);
    setActiveModal('delete');
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">User: {user?.email}</span>
            <button onClick={logout} className="text-red-500 hover:text-red-700 font-medium">Logout</button>
          </div>
        </div>

        <button
          onClick={() => setActiveModal('create')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mb-6"
        >
          Add New Task
        </button>

        <div className="bg-white rounded shadow overflow-hidden">
          {tasks.length === 0 ? (
            <p className="p-6 text-center text-gray-500">No tasks found. Create one!</p>
          ) : (
            <ul>
              {tasks.map(task => (
                <li key={task.id} className="border-b last:border-b-0 p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task)}
                      className="h-5 w-5 text-blue-600 rounded"
                    />
                    <span className={`text-lg ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                      {task.title}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(task)}
                      className="text-blue-500 hover:text-blue-700 px-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(task)}
                      className="text-red-500 hover:text-red-700 px-2"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <Modal isOpen={activeModal === 'create'} onClose={() => setActiveModal(null)} title="Create Task">
        <form onSubmit={handleCreateTask}>
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Task title"
            className="w-full border border-gray-300 p-2 rounded mb-4 text-gray-900"
            required
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Create</button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={activeModal === 'edit'} onClose={() => setActiveModal(null)} title="Edit Task">
        <form onSubmit={handleUpdateTask}>
          <input
            type="text"
            value={editTaskTitle}
            onChange={(e) => setEditTaskTitle(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mb-4 text-gray-900"
            required
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Save</button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={activeModal === 'delete'} onClose={() => setActiveModal(null)} title="Confirm Delete">
        <p className="mb-4 text-gray-600">Are you sure you want to delete this task?</p>
        <div className="flex justify-end gap-2">
          <button onClick={() => setActiveModal(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
          <button onClick={handleDeleteTask} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
        </div>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
