import React from 'react';
import { Bell, LogIn, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore'; // Import store

export const Header = () => {
  // Lấy state và actions từ Zustand
  const { isAuthenticated, user, login, logout } = useAuthStore();

  // Hàm mô phỏng việc đăng nhập thành công
  const handleMockLogin = () => {
    login({ name: 'Học giả Koto', role: 'Premium' });
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6 transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900">
<div className="flex items-center gap-2 cursor-pointer">
  {/* Đã đổi bg-blue-600 thành bg-primary */}
  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold transition-colors duration-300">
    K
  </div>
  <span className="text-xl font-bold text-gray-900 dark:text-white">KotoBase</span>
</div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100 transition-colors dark:text-gray-300 dark:hover:bg-gray-800">
          <Bell size={20} />
          <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-gray-900"></span>
        </button>
        
        {/* Render UI dựa trên state từ Zustand */}
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Chào, {user?.name}
            </span>
            <button 
              onClick={logout}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 active:scale-95 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <LogOut size={16} />
              <span>Đăng xuất</span>
            </button>
          </div>
        ) : (
<button 
  onClick={handleMockLogin}
  /* Đã đổi bg-blue-600 thành bg-primary và hover:bg-primary-hover */
  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-hover active:scale-95"
>
  <LogIn size={18} />
  <span>Đăng nhập</span>
</button>
        )}
      </div>
    </header>
  );
};