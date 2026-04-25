import React from 'react';
import { X } from 'lucide-react';
import { KanjiStrokeWriter } from './KanjiStrokeWriter';

export const KanjiDetailModal = ({ isOpen, onClose, kanji, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-2xl scale-100 rounded-3xl bg-white p-6 md:p-8 shadow-2xl dark:border dark:border-gray-800 dark:bg-gray-900 animate-fade-in">
        
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X size={20} />
        </button>

        {isLoading || !kanji ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 animate-pulse py-4">
            <div className="flex flex-col items-center space-y-4 border-r-0 md:border-r border-gray-100 dark:border-gray-800">
               <div className="h-40 w-40 rounded-2xl bg-gray-200 dark:bg-gray-800"></div>
            </div>
            <div className="space-y-4">
              <div className="h-8 w-32 rounded bg-gray-200 dark:bg-gray-800 mb-6"></div>
              <div className="h-24 w-full rounded-xl bg-gray-200 dark:bg-gray-800"></div>
              <div className="h-24 w-full rounded-xl bg-gray-200 dark:bg-gray-800"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            
            {/* Cột trái: Animation nét vẽ */}
            <div className="flex flex-col items-center justify-center border-b border-gray-100 pb-6 md:border-b-0 md:border-r md:pb-0 dark:border-gray-800">
              <div className="mb-2 rounded-lg bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                Cấp độ {kanji.level}
              </div>
              <KanjiStrokeWriter character={kanji.characters} />
            </div>

            {/* Cột phải: Thông tin chi tiết ĐÃ ĐƯỢC NÂNG CẤP */}
            <div className="flex flex-col justify-center">
              
              {/* Thêm chữ Kanji gốc vào bên phải cùng với ý nghĩa */}
              <div className="mb-6 flex items-baseline gap-3 border-b border-gray-100 pb-4 dark:border-gray-800">
                <h2 className="text-5xl font-black text-gray-900 dark:text-white leading-none">
                  {kanji.characters}
                </h2>
                <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300 capitalize">
                  - {kanji.meaning}
                </h3>
              </div>

              <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                Số nét: <span className="font-semibold text-gray-700 dark:text-gray-300">{kanji.strokeCount}</span>
              </p>

              <div className="space-y-4">
                {/* Âm On - Chỉnh màu sắc để ĐỌC RÕ HƠN */}
                <div className="rounded-xl border border-red-100 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-950/20">
                  <span className="mb-2 block text-xs font-bold uppercase text-red-600 dark:text-red-400">Onyomi (Âm Hán)</span>
                  <div className="flex flex-wrap gap-2">
                    {kanji.on?.map((item, idx) => (
                      <span key={idx} className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-bold text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
                        {item.reading} <span className="ml-1 text-xs font-medium text-gray-500 dark:text-gray-400">({item.romaji})</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Âm Kun - Chỉnh màu sắc để ĐỌC RÕ HƠN */}
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-950/20">
                  <span className="mb-2 block text-xs font-bold uppercase text-blue-600 dark:text-blue-400">Kunyomi (Âm Nhật)</span>
                  <div className="flex flex-wrap gap-2">
                    {kanji.kun?.map((item, idx) => (
                      <span key={idx} className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-bold text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
                        {item.reading} <span className="ml-1 text-xs font-medium text-gray-500 dark:text-gray-400">({item.romaji})</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};