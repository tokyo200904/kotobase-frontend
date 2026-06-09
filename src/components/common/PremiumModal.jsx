import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Lock, Sparkles, Crown } from 'lucide-react';

export const PremiumModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all animate-fade-in">
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>
      <div className="relative z-10 w-full max-w-md flex flex-col items-center rounded-[2.5rem] bg-white p-8 text-center shadow-2xl border-2 border-yellow-400/20 dark:border-gray-800 dark:bg-gray-900">
        
        <button onClick={onClose} className="absolute right-6 top-6 rounded-full bg-gray-100 p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
          <X size={18} />
        </button>

        <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-yellow-50 text-yellow-500 shadow-xl shadow-yellow-500/10 dark:bg-yellow-500/10">
          <div className="absolute inset-0 animate-ping rounded-full bg-yellow-400 opacity-10"></div>
          <Crown size={44} strokeWidth={2} className="relative z-10 animate-bounce-short" />
        </div>
        
        <h2 className="mb-2 text-2xl font-black text-gray-900 dark:text-white uppercase tracking-wide">Quyền lợi Premium</h2>
        <p className="mb-8 text-sm font-medium leading-relaxed text-gray-500 dark:text-gray-400 px-2">
          Nội dung này thuộc chương trình cấp cao. Hãy kích hoạt gói Premium để mở khóa không giới hạn kho tàng học thuật của KotoBase!
        </p>

        <button 
          onClick={() => navigate('/premium')}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 py-4 text-lg font-black text-white shadow-[0_6px_0_#d97706] transition-all hover:brightness-110 active:translate-y-1.5 active:shadow-none"
        >
          Nâng cấp Premium ngay <Sparkles size={20} fill="currentColor" />
        </button>
      </div>
    </div>
  );
};