'use client';

import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export function Toast({ message, type = 'success', onClose }: ToastProps) {
  const colorClasses = {
    success: 'bg-success',
    error: 'bg-error',
    info: 'bg-brand-500',
  };

  return createPortal(
    <div className="fixed bottom-4 right-4 z-[100] animate-slide-in-right">
      <div className={`${colorClasses[type]} text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3`}>
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="text-white/80 hover:text-white text-lg">
          ✕
        </button>
      </div>
    </div>,
    document.body
  );
}
