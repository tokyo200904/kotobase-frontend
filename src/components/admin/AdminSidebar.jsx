import React from 'react';
import { Settings, ShieldCheck, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ADMIN_NAV_GROUPS } from '../../constants/adminNavigation';

export const AdminSidebar = ({ onOpenSettings }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="custom-scrollbar flex h-[calc(100vh-4rem)] w-72 shrink-0 flex-col justify-between border-r border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-950 overflow-y-auto">
      
      <div className="flex-1 pb-6">
        {/* Logo Admin */}
        <div className="mb-6 mt-4 flex items-center gap-3 px-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/30">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white leading-tight">Admin Panel</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary">KotoBase System</p>
          </div>
        </div>

        {/* Danh sách Menu chia theo Nhóm */}
        <nav className="flex flex-col gap-6 px-4">
          {ADMIN_NAV_GROUPS.map((group, groupIdx) => (
            <div key={groupIdx}>
              <p className="mb-2 px-2 text-[11px] font-black uppercase tracking-wider text-gray-400">
                {group.group}
              </p>
              <div className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  // Kiểm tra active cho trang chủ Admin (/admin) hoặc các trang con (/admin/...)
                  const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));

                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-all ${
                        isActive
                          ? 'bg-primary/10 text-primary shadow-sm' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-primary dark:text-gray-400 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Sidebar (Cài đặt & Thoát) */}
      <div className="sticky bottom-0 flex flex-col gap-1 border-t border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
        <button 
          onClick={onOpenSettings}
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
        >
          <Settings size={20} />
          <span>Cài đặt giao diện</span>
        </button>
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut size={20} />
          <span>Về trang người dùng</span>
        </button>
      </div>
      
    </aside>
  );
};