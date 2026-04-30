import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { useVocabList } from '../../hooks/useVocabList';
import { VocabCard } from '../../components/vocab/VocabCard';
import { Pagination } from '../../components/common/Pagination';

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
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-gray-100 pb-4 dark:border-gray-800">
        <button 
          onClick={() => navigate(-1)} 
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
          aria-label="Quay lại"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
            <BookOpen className="text-primary" size={24} /> Học Từ Vựng
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Chủ đề #{topicId} • Hoàn thành các từ vựng dưới đây
          </p>
        </div>
      </div>

      <div className="min-h-[500px]">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-gray-100 animate-pulse dark:bg-gray-800"></div>
            ))}
          </div>
        ) : vocabs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 animate-fade-in">
            {vocabs.map((vocab) => (
              <VocabCard key={vocab.id} vocab={vocab} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
            <BookOpen size={48} className="mb-4 text-gray-300 dark:text-gray-700" />
            <p className="text-lg font-medium">Chưa có từ vựng nào.</p>
            <p className="text-sm">Vui lòng quay lại sau.</p>
          </div>
        )}
      </div>

      {!isLoading && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={handlePageChange} 
        />
      )}
    </div>
  );
};