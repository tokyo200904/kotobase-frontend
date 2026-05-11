import React from 'react';
import { Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../../constants/navigation';

export const Sidebar = ({ onOpenSettings }) => {
  const location = useLocation();

  return (
    <aside className="flex h-[calc(100vh-4rem)] w-64 flex-col justify-between border-r border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
      <nav className="flex flex-col gap-2 mt-2">
        <p className="mb-3 px-3 text-xs font-bold uppercase text-gray-400">Học Tập</p>
        
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/kanji');

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary' 
                  : 'text-gray-600 hover:bg-primary hover:text-white dark:text-gray-400'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button 
        onClick={onOpenSettings}
        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <Settings size={20} />
        <span>Cài đặt giao diện</span>
      </button>
    </aside>
  );
};