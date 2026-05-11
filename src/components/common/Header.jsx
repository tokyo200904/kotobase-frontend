import React, { useState, useRef, useEffect } from 'react';
import { LogIn, User as UserIcon, LogOut, Bell, Settings, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AuthModal } from '../auth/AuthModal';

export const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-[50] flex h-16 items-center justify-between border-b border-gray-100 bg-white/80 px-6 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-primary"></div>
        <span className="text-xl font-black tracking-tighter text-gray-900 dark:text-white">
          KOTObase
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
          <Bell size={20} />
        </button>

        {isAuthenticated ? (
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 rounded-full border border-gray-200 p-1 pr-3 transition-all hover:border-primary/50 hover:shadow-sm focus:outline-none dark:border-gray-700 dark:hover:border-primary/50"
            >
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-primary/20 text-primary">
                {user?.photo ? (
                  <img src={user.photo} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <UserIcon size={16} />
                )}
              </div>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                {user?.fullName?.split(' ').pop() || 'User'}
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-3 w-60 origin-top-right rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-200 dark:border-gray-800 dark:bg-gray-900">
                
                <div className="mb-2 flex items-center gap-3 border-b border-gray-50 px-3 pb-3 pt-2 dark:border-gray-800">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary">
                    {user?.photo ? (
                      <img src={user.photo} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <UserIcon size={20} />
                    )}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-sm font-bold text-gray-900 dark:text-white capitalize">
                      {user?.fullName || 'Học giả Koto'}
                    </span>
                    <span className="truncate text-xs font-medium text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
                    <ShieldCheck size={18} className="text-gray-400" />
                    Tài khoản của tôi
                  </button>
                  <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
                    <Settings size={18} className="text-gray-400" />
                    Cài đặt hệ thống
                  </button>
                </div>

                <div className="my-1 border-t border-gray-50 dark:border-gray-800"></div>

                <button 
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  className="group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <LogOut size={18} className="transition-transform group-hover:-translate-x-1" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <button 
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-md active:translate-y-0"
          >
            <LogIn size={18} />
            <span className="hidden sm:inline">Đăng nhập</span>
          </button>
        )}
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
};