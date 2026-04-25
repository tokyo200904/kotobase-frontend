import React from 'react';
import { Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NAV_ITEMS } from '../../constants/navigation';

export const Sidebar = ({ onOpenSettings }) => {
  return (
    <aside className="flex h-[calc(100vh-4rem)] w-64 flex-col justify-between border-r border-gray-200 bg-gray-50 p-4 transition-colors duration-300 dark:border-gray-800 dark:bg-gray-950">
      
      <nav className="flex flex-col gap-2">
        <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Menu Học Tập
        </p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.path}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-[var(--primary)] hover:text-white dark:text-gray-300 dark:hover:bg-[var(--primary)] dark:hover:text-white"
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Nút bấm mở Modal Cài Đặt */}
      <button 
        onClick={onOpenSettings}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <Settings size={18} />
        Cài đặt giao diện
      </button>
    </aside>
  );
};