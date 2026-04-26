import React from 'react';
import { Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../../constants/navigation';

export const Sidebar = ({ onOpenSettings }) => {
  const location = useLocation();

  return (
    <aside className="flex h-[calc(100vh-4rem)] w-64 flex-col justify-between border-r border-gray-100 bg-white p-4 shadow-[2px_0_8px_-4px_rgba(0,0,0,0.05)] transition-colors duration-300 dark:border-gray-800 dark:bg-gray-950">
      
      <nav className="flex flex-col gap-2 mt-2">
        <p className="mb-3 px-3 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Học Tập
        </p>
        
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/kanji');

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 ${
                isActive
                  ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary' // Trạng thái đang chọn
                  : 'text-gray-600 hover:translate-x-1.5 hover:bg-primary hover:text-white dark:text-gray-400 dark:hover:bg-primary dark:hover:text-white shadow-sm hover:shadow-md' // Trạng thái bình thường & khi Hover
              }`}
            >
              <Icon 
                size={20} 
                className={`transition-colors duration-300 ${
                  isActive ? 'text-primary' : 'text-gray-400 group-hover:text-white'
                }`} 
              />
              <span className="tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button 
        onClick={onOpenSettings}
        className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-gray-600 transition-all duration-300 hover:translate-x-1.5 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        <Settings size={20} className="text-gray-400 transition-transform duration-500 group-hover:rotate-90 group-hover:text-gray-600 dark:group-hover:text-white" />
        <span className="tracking-wide">Cài đặt giao diện</span>
      </button>
    </aside>
  );
};