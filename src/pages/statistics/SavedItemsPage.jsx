import React, { useState, useEffect } from 'react';
import { BookMarked, Trash2, BrainCircuit, CalendarClock, Loader2 } from 'lucide-react';
import { progressService } from '../../services/progressService';
import { useToast } from '../../context/ToastContext';
import { Pagination } from '../../components/common/Pagination'; 


const SavedItemCard = ({ item, onDelete }) => {
  const displayText = item.itemType === 'KANJI' ? item.kanjiCharacter : item.vocabularyWord;
  
  const reviewDate = new Date(item.nextReviewDate).toLocaleString('vi-VN', {
    hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
  });

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      
      <button 
        onClick={() => onDelete(item)}
        className="absolute right-3 top-3 rounded-full p-2 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-gray-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
        title="Xóa khỏi danh sách"
      >
        <Trash2 size={18} />
      </button>

      <div>
        <div className="mb-2 inline-flex items-center rounded-lg bg-gray-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:bg-gray-800">
          {item.itemType}
        </div>
        <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-1">{displayText}</h3>
        <p className="mt-2 text-sm font-bold text-primary capitalize">{item.meaning}</p>
      </div>

      <div className="mt-5 space-y-2 border-t border-gray-50 pt-4 dark:border-gray-800">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
          <BrainCircuit size={14} className="text-purple-500" /> 
          <span>Mức độ ghi nhớ: <b className="text-gray-700 dark:text-gray-300">Level {item.memoryLevel}</b></span>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
          <CalendarClock size={14} className="text-orange-500" />
          <span>Ôn lần tới: {reviewDate}</span>
        </div>
      </div>

    </div>
  );
};



export const SavedItemsPage = () => {
  const { addToast } = useToast();
  
  const [activeTab, setActiveTab] = useState('KANJI');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchItems = async (type, page) => {
    setIsLoading(true);
    try {
      const res = await progressService.getSavedItems(type, page, 20);
      setItems(res.data || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch (error) {
      console.error("Lỗi lấy danh sách:", error);
      addToast("Không thể tải danh sách đã lưu!", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(activeTab, currentPage);
  }, [activeTab, currentPage]);

  const handleTabChange = (type) => {
    if (type !== activeTab) {
      setActiveTab(type);
      setCurrentPage(0); 
    }
  };

  const handleDelete = async (itemToRemove) => {
    setItems((prev) => prev.filter(item => item.progressId !== itemToRemove.progressId));
    setTotalElements((prev) => prev - 1);

    try {
      const res = await progressService.toggleSaveItem(itemToRemove.targetItemId, itemToRemove.itemType);
      addToast(res.message, "success");
    } catch (error) {
      console.error("Lỗi xóa từ:", error);
      addToast("Lỗi kết nối, không thể xóa!", "error");
      fetchItems(activeTab, currentPage); 
    }
  };

  return (
    <div className="custom-scrollbar h-[calc(100vh-6rem)] w-full overflow-y-auto pr-2 md:pr-4">
      <div className="mx-auto max-w-5xl space-y-6 pb-12 pt-4 animate-fade-in">
        
        <div className="flex flex-col gap-2 border-b border-gray-100 pb-6 dark:border-gray-800">
          <h1 className="flex items-center gap-2 text-3xl font-black text-gray-900 dark:text-white">
            <BookMarked className="text-primary" size={28} strokeWidth={2.5} /> Góc Lưu Trữ
          </h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Quản lý tất cả Kanji và Từ vựng bạn đã đánh dấu để ôn tập. Tổng cộng có {totalElements} mục.
          </p>
        </div>

        <div className="inline-flex rounded-xl bg-gray-100 p-1 dark:bg-gray-800/50 shadow-inner">
          <button
            onClick={() => handleTabChange('KANJI')}
            className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-bold transition-all ${
              activeTab === 'KANJI' ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            🈴 Kanji đã lưu
          </button>
          <button
            onClick={() => handleTabChange('VOCAB')}
            className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-bold transition-all ${
              activeTab === 'VOCAB' ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            📚 Từ vựng đã lưu
          </button>
        </div>

        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
          ) : items.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 animate-fade-in">
                {items.map((item) => (
                  <SavedItemCard 
                    key={item.progressId} 
                    item={item} 
                    onDelete={handleDelete} 
                  />
                ))}
              </div>

              <div className="mt-10">
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={(newPage) => setCurrentPage(newPage)} 
                />
              </div>
            </>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50/50 text-gray-400 dark:border-gray-800 dark:bg-gray-900/50">
              <BookMarked size={48} className="mb-4 opacity-50" />
              <p className="text-lg font-bold text-gray-500">Danh sách trống</p>
              <p className="text-sm">Bạn chưa lưu mục {activeTab === 'KANJI' ? 'Kanji' : 'Từ vựng'} nào cả.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};