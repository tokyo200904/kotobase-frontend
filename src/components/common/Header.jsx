import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, User as UserIcon, LogOut, Bell, Settings, ShieldCheck, Crown } from 'lucide-react'; 
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
      
      <Link to="/" className="group flex items-center gap-3 outline-none">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded bg-gradient-to-br from-gray-900 to-black text-white shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-primary/40 dark:border dark:border-gray-700 dark:from-gray-800 dark:to-gray-950">
          <span className="font-serif text-[22px] font-bold leading-none tracking-tighter">侍</span>
          <div className="absolute inset-0 overflow-hidden rounded">
            <div className="absolute -left-full top-0 h-[200%] w-1.5 origin-top-right rotate-45 bg-white/30 transition-all duration-500 group-hover:left-[200%]"></div>
          </div>
        </div>
        <span className="font-bold text-[34px] text-gray-900 transition-colors dark:text-white">
          Koto<span className="text-primary">base</span>
        </span>
      </Link>

      <div className="flex items-center gap-4">
        <button className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
          <Bell size={20} />
        </button>

        {isAuthenticated ? (
          <div className="relative" ref={menuRef}>
            
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center gap-2 rounded-full border p-1 pr-3 transition-all focus:outline-none ${
                user?.premium 
                  ? 'border-yellow-200 bg-yellow-50/50 hover:border-yellow-400 hover:shadow-sm dark:border-yellow-900/30 dark:bg-yellow-900/10' 
                  : 'border-gray-200 hover:border-primary/50 hover:shadow-sm dark:border-gray-700 dark:hover:border-primary/50'
              }`}
            >
              <div className="relative">
                <div className={`flex h-8 w-8 items-center justify-center overflow-hidden rounded-full ${
                  user?.premium ? 'ring-2 ring-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.5)]' : 'bg-primary/20 text-primary'
                }`}>
                  {user?.photo ? (
                    <img src={user.photo} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <UserIcon size={16} />
                  )}
                </div>
                {user?.premium && (
                  <div className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-sm border border-yellow-100 dark:bg-gray-800 dark:border-gray-700">
                    <Crown size={10} className="text-yellow-500 fill-yellow-500" />
                  </div>
                )}
              </div>
              
              <span className={`text-sm font-bold ${
                user?.premium 
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-amber-500 dark:from-yellow-400 dark:to-amber-500' 
                  : 'text-gray-700 dark:text-gray-200'
              }`}>
                {user?.fullName?.split(' ').pop() || 'User'}
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-3 w-64 origin-top-right rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-200 dark:border-gray-800 dark:bg-gray-900">
                
                <div className="mb-2 flex items-center gap-3 border-b border-gray-50 px-3 pb-4 pt-2 dark:border-gray-800">
                  <div className="relative shrink-0">
                    <div className={`flex h-12 w-12 items-center justify-center overflow-hidden rounded-full ${
                      user?.premium ? 'ring-2 ring-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.5)]' : 'bg-primary/10 text-primary'
                    }`}>
                      {user?.photo ? (
                        <img src={user.photo} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <UserIcon size={24} />
                      )}
                    </div>
                    {user?.premium && (
                      <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md border border-yellow-100 dark:bg-gray-800 dark:border-gray-700">
                        <Crown size={12} className="text-yellow-500 fill-yellow-500" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col overflow-hidden">
                    <span className={`truncate text-sm font-black capitalize ${
                      user?.premium 
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-amber-500 dark:from-yellow-400 dark:to-amber-500' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {user?.fullName || 'Học giả Koto'}
                    </span>
                    <span className="truncate text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      {user?.email}
                    </span>
                    
                    <span className={`inline-flex w-fit items-center rounded px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest ${
                      user?.premium 
                        ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400' 
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {user?.premium ? 'Thành viên PRO' : 'Gói miễn phí'}
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