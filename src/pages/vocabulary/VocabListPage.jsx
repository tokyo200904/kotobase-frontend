import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { useVocabList } from '../../hooks/useVocabList';
import { VocabCard } from '../../components/vocab/VocabCard';
import { Pagination } from '../../components/common/Pagination';

import { PracticeActionGroup } from '../../components/practice/PracticeActionGroup';

export const VocabListPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();

  const { 
    vocabs, 
    isLoading, 
    currentPage, 
    totalPages, 
    handlePageChange 
  } = useVocabList(topicId);

  return (
    <div className="space-y-8 animate-fade-in custom-scrollbar h-[calc(100vh-6rem)] w-full overflow-y-auto pr-2 md:pr-4 pb-12 pt-2">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-500 transition-all hover:bg-gray-50 active:scale-95 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 shadow-sm"
            aria-label="Quay lại"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              <div className="bg-blue-100 p-1.5 rounded-xl text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <BookOpen size={24} />
              </div>
              Kho Từ Vựng
            </h1>
            <p className="mt-1.5 text-xs font-bold uppercase tracking-widest text-gray-400">
              Chủ đề #{topicId} • Khám phá và ghi nhớ
            </p>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-blue-100 bg-white p-6 shadow-sm dark:border-blue-900/40 dark:bg-gray-900 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl"></div>
        
        <div className="relative z-10">
          <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            Khu vực Luyện Tập
          </h2>
          <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400 max-w-md leading-relaxed">
            Áp dụng các phương pháp học tập tương tác cao (Lật thẻ, Đố vui, Đọc hiểu) để ghi nhớ từ vựng sâu hơn và lâu hơn.
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <PracticeActionGroup 
            module="VOCAB" 
            topicId={topicId} 
            isLocked={false} 
          />
        </div>
      </div>

      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 rounded-[2rem] bg-white border border-gray-100 animate-pulse dark:bg-gray-900 dark:border-gray-800 shadow-sm"></div>
            ))}
          </div>
        ) : vocabs.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 animate-fade-in">
            {vocabs.map((vocab) => (
              <VocabCard key={vocab.id} vocab={vocab} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white border border-dashed border-gray-200 rounded-[2.5rem] dark:bg-gray-900 dark:border-gray-800">
            <BookOpen size={48} className="mb-4 text-gray-300 dark:text-gray-700" />
            <p className="text-lg font-black text-gray-500 dark:text-gray-400">Trống rỗng</p>
            <p className="text-sm font-medium mt-1">Chưa có từ vựng nào được thêm vào chủ đề này.</p>
          </div>
        )}
      </div>

      {/* 4. PHÂN TRANG */}
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        </div>
      )}
      
    </div>
  );
};