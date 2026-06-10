import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Gamepad2, BookOpenText, Lock } from 'lucide-react';

export const PracticeActionGroup = ({ module, level, levelId, topicId, grammarId, isLocked }) => {
  const navigate = useNavigate();

  const handleNavigate = (practiceType) => {
    if (isLocked) return; 
    
    let url = `/practice/${practiceType}?module=${module}`;
    if (module === 'KANJI') {
      url += `&level=${level}&levelId=${levelId}`;
    } else if (module === 'VOCAB') {
      url += `&topicId=${topicId}`;
    } else if (module === 'GRAMMAR') {
      url += `&grammarId=${grammarId}`;
    }
    
    navigate(url);
  };

  return (
    <div className="flex flex-wrap gap-4">
      
      {module !== 'GRAMMAR' && (
        <>
          <button
            type="button"
            onClick={() => handleNavigate('flashcard')}
            disabled={isLocked}
            className={`group relative flex h-[88px] w-[88px] flex-col items-center justify-center rounded-[1.25rem] border-2 bg-white transition-all duration-200 
              ${isLocked 
                ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed grayscale dark:border-gray-700 dark:bg-gray-800' 
                : 'border-gray-100 hover:border-blue-500 hover:-translate-y-1 hover:shadow-[0_6px_0_rgba(59,130,246,0.2)] active:translate-y-1 active:shadow-none cursor-pointer dark:border-gray-800 dark:bg-gray-900'
              }`}
          >
            <div className={`mb-2 rounded-xl bg-gray-50 p-2 transition-colors dark:bg-gray-800 ${isLocked ? 'text-gray-400' : 'group-hover:bg-blue-500/10 group-hover:text-blue-500'}`}>
              {isLocked ? <Lock size={24} /> : <Layers size={24} />}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${isLocked ? 'text-gray-400' : 'text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white'}`}>
              Lật thẻ
            </span>
          </button>
          
          <button
            type="button"
            onClick={() => handleNavigate('quiz')}
            disabled={isLocked}
            className={`group relative flex h-[88px] w-[88px] flex-col items-center justify-center rounded-[1.25rem] border-2 bg-white transition-all duration-200 
              ${isLocked 
                ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed grayscale dark:border-gray-700 dark:bg-gray-800' 
                : 'border-gray-100 hover:border-green-500 hover:-translate-y-1 hover:shadow-[0_6px_0_rgba(34,197,94,0.2)] active:translate-y-1 active:shadow-none cursor-pointer dark:border-gray-800 dark:bg-gray-900'
              }`}
          >
            <div className={`mb-2 rounded-xl bg-gray-50 p-2 transition-colors dark:bg-gray-800 ${isLocked ? 'text-gray-400' : 'group-hover:bg-green-500/10 group-hover:text-green-500'}`}>
              {isLocked ? <Lock size={24} /> : <Gamepad2 size={24} />}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${isLocked ? 'text-gray-400' : 'text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white'}`}>
              Đố vui
            </span>
          </button>
        </>
      )}

      {module === 'VOCAB' && (
        <button
          type="button"
          onClick={() => handleNavigate('dokkai')}
          disabled={isLocked}
          className={`group relative flex h-[88px] w-[88px] flex-col items-center justify-center rounded-[1.25rem] border-2 bg-white transition-all duration-200 
            ${isLocked 
              ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed grayscale dark:border-gray-700 dark:bg-gray-800' 
              : 'border-gray-100 hover:border-purple-500 hover:-translate-y-1 hover:shadow-[0_6px_0_rgba(168,85,247,0.2)] active:translate-y-1 active:shadow-none cursor-pointer dark:border-gray-800 dark:bg-gray-900'
            }`}
        >
          <div className={`mb-2 rounded-xl bg-gray-50 p-2 transition-colors dark:bg-gray-800 ${isLocked ? 'text-gray-400' : 'group-hover:bg-purple-500/10 group-hover:text-purple-500'}`}>
            {isLocked ? <Lock size={24} /> : <BookOpenText size={24} />}
          </div>
          <span className={`text-[10px] font-black uppercase tracking-widest ${isLocked ? 'text-gray-400' : 'text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white'}`}>
            Đọc hiểu
          </span>
        </button>
      )}

      {module === 'GRAMMAR' && (
        <button
          type="button"
          onClick={() => handleNavigate('grammar-dokkai')}
          disabled={isLocked}
          className={`group relative flex h-[88px] w-[88px] flex-col items-center justify-center rounded-[1.25rem] border-2 bg-white transition-all duration-200 
            ${isLocked 
              ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed grayscale dark:border-gray-700 dark:bg-gray-800' 
              : 'border-gray-100 hover:border-purple-500 hover:-translate-y-1 hover:shadow-[0_6px_0_rgba(168,85,247,0.2)] active:translate-y-1 active:shadow-none cursor-pointer dark:border-gray-800 dark:bg-gray-900'
            }`}
        >
          <div className={`mb-2 rounded-xl bg-gray-50 p-2 transition-colors dark:bg-gray-800 ${isLocked ? 'text-gray-400' : 'group-hover:bg-purple-500/10 group-hover:text-purple-500'}`}>
            {isLocked ? <Lock size={24} /> : <BookOpenText size={24} />}
          </div>
          <span className={`text-[10px] font-black uppercase tracking-widest ${isLocked ? 'text-gray-400' : 'text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white'}`}>
            Nối câu
          </span>
        </button>
      )}

    </div>
  );
};