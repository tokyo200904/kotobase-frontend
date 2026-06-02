import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Check, AlertCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

const ToastItem = ({ toast, onRemove }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300);
  };

  const isSuccess = toast.type === 'success';

  return (
    <div
      className={`pointer-events-auto flex w-full max-w-sm transform items-center gap-4 overflow-hidden rounded-2xl bg-white p-4 pr-3 shadow-2xl ring-1 ring-black/5 transition-all duration-300 ease-in-out dark:bg-gray-900 dark:ring-white/10
      ${isClosing ? 'translate-x-[120%] opacity-0' : 'translate-x-0 opacity-100 animate-toast-slide-in'}`}
    >
      {/* Khối Icon */}
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
        isSuccess ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
      }`}>
        {isSuccess ? <Check size={20} strokeWidth={3} /> : <AlertCircle size={20} strokeWidth={3} />}
      </div>
      
      <div className="flex-1">
        <p className="text-sm font-bold text-gray-900 dark:text-white">
          {isSuccess ? 'Thành công!' : 'Lỗi kết nối'}
        </p>
        <p className="mt-0.5 text-xs font-medium text-gray-500 dark:text-gray-400">
          {toast.message}
        </p>
      </div>
      
      <button
        onClick={handleClose}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
      >
        <X size={16} strokeWidth={3} />
      </button>
    </div>
  );
};


export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      
      <style>
        {`
          @keyframes toast-slide-in {
            0% { transform: translateX(100%); opacity: 0; }
            70% { transform: translateX(-15px); opacity: 1; }
            100% { transform: translateX(0); opacity: 1; }
          }
          .animate-toast-slide-in {
            animation: toast-slide-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}
      </style>

      <div className="pointer-events-none fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast phải được đặt trong ToastProvider');
  return context;
};