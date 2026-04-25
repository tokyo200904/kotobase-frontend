import React from 'react';
import { useKanji } from '../hooks/useKanji';
import { KanjiDetailModal } from '../components/kanji/KanjiDetailModal';

const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];

export const KanjiPage = () => {
  const { 
    activeLevel, setActiveLevel, 
    kanjiList, isLoadingList, 
    selectedKanji, isLoadingDetail, 
    isModalOpen, handleOpenDetail, handleCloseModal 
  } = useKanji('N5');

  return (
    // Thêm h-[calc(100vh-6rem)] để ép component này vừa đúng chiều cao màn hình còn lại
    <div className="flex h-[calc(100vh-6rem)] flex-col space-y-6">
      
      {/* Header & Tabs chọn Level (Giữ nguyên) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Danh sách Kanji</h1>
        
        <div className="flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
          {LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => setActiveLevel(level)}
              className={`px-5 py-2 text-sm font-semibold rounded-md transition-all ${
                activeLevel === level 
                  ? 'bg-white text-primary shadow-sm dark:bg-gray-700 dark:text-white' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Khu vực danh sách Kanji - Đã thêm tính năng CUỘN */}
      <div className="flex-1 overflow-hidden rounded-2xl bg-white p-4 shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800 sm:p-6">
        
        {/* Lớp bọc có thanh cuộn: max-h-full và overflow-y-auto */}
        <div className="custom-scrollbar h-full w-full overflow-y-auto pr-2">
          {isLoadingList ? (
            // Skeleton UX
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
              {[...Array(40)].map((_, i) => (
                <div key={i} className="aspect-square rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
              {kanjiList.map((kanji) => (
                <button
                  key={kanji.id}
                  onClick={() => handleOpenDetail(kanji.id)}
                  /* THIẾT KẾ MỚI CHO Ô KANJI: Tối giản, sang trọng, hiệu ứng bay bổng */
                  className="group flex aspect-square cursor-pointer items-center justify-center rounded-2xl border border-gray-100 bg-white text-3xl font-medium text-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary hover:text-primary hover:shadow-lg dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:hover:border-primary dark:hover:text-primary"
                >
                  {kanji.characters}
                </button>
              ))}
              
              {kanjiList.length === 0 && (
                <div className="col-span-full py-20 text-center text-gray-500">
                  Không có dữ liệu Kanji cho cấp độ này.
                </div>
              )}
            </div>
          )}
        </div>
        
      </div>

      <KanjiDetailModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        kanji={selectedKanji}
        isLoading={isLoadingDetail}
      />
    </div>
  );
};