"use client";

import { useEffect } from 'react';
import PropTypes from 'prop-types';

interface ToastProps {
  message: string;
  type: string;
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors: { [key: string]: string } = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };

  return (
    <div className={`fixed bottom-4 right-4 ${bgColors[type] || 'bg-gray-500'} text-white px-4 py-2 rounded shadow-lg z-50 transition-opacity duration-300`}>
      {message}
    </div>
  );
}

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
