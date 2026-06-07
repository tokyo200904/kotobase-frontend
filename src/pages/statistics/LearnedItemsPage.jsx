import React, { useEffect, useState } from 'react';
import { BookMarked, BrainCircuit, CalendarClock, Trash2, Loader2, Library, Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { progressService } from '../../services/progressService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Pagination } from '../../components/common/Pagination';

// ============================================================================
// COMPONENT CON: THẺ TỪ VỰNG / KANJI
// ============================================================================
const SavedItemCard = ({ item, onDelete }) => {
  const displayText = item.itemType === 'KANJI' ? item.kanjiCharacter : item.vocabularyWord;
  const reviewDate = new Date(item.nextReviewDate).toLocaleString('vi-VN', {
    hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
  });

  return (
    <div className="group relative flex flex-col justify-between rounded-[2rem] border-2 border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900">
      <button 
        onClick={() => onDelete(item)}
        className="absolute right-4 top-4 rounded-full p-2 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-gray-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
        title="Xóa khỏi danh sách"
      >
        <Trash2 size={18} />
      </button>

      <div>
        <div className="mb-3 inline-flex items-center rounded-lg bg-gray-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          {item.itemType}
        </div>
        <h3 className="mt-1 text-4xl font-black text-gray-900 dark:text-white">{displayText}</h3>
        <p className="mt-2 text-base font-bold text-primary capitalize">{item.meaning}</p>
      </div>

      <div className="mt-6 space-y-3 border-t-2 border-dashed border-gray-100 pt-4 dark:border-gray-800">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400">
          <BrainCircuit size={16} className="text-purple-500" /> 
          <span>Mức độ ghi nhớ: <b className="text-purple-600 dark:text-purple-400">Level {item.memoryLevel}</b></span>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400">
          <CalendarClock size={16} className="text-orange-500" />
          <span>Ôn lần tới: {reviewDate}</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT CHÍNH: TRANG KHO TÀNG
// ============================================================================
export const LearnedItemsPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { setAuthModalOpen } = useAuth();
  
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  const [activeTab, setActiveTab] = useState('KANJI');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchItems = async (type, page) => {
    setIsLoading(true);
    try {
      const res = await progressService.getSavedItems(type, page, 20); // API cũ của bạn
      setItems(res.data || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch (error) {
      console.error("Lỗi lấy danh sách:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchItems(activeTab, currentPage);
    }
  }, [activeTab, currentPage, isAuthenticated]);

  const handleDelete = async (itemToRemove) => {
    setItems((prev) => prev.filter(item => item.progressId !== itemToRemove.progressId));
    setTotalElements((prev) => prev - 1);
    try {
      const res = await progressService.toggleSaveItem(itemToRemove.targetItemId, itemToRemove.itemType);
      addToast(res.message, "success");
    } catch (error) {
      addToast("Lỗi kết nối, không thể xóa!", "error");
      fetchItems(activeTab, currentPage); 
    }
  };

  // CHỐT CHẶN BẢO MẬT
  if (!isAuthenticated) {
    return (
      <div className="flex h-[calc(100vh-6rem)] w-full flex-col items-center justify-center bg-gray-50/50 px-4 text-center dark:bg-gray-950/50">
        <div className="animate-fade-in flex flex-col items-center rounded-[2.5rem] border border-gray-100 bg-white p-10 shadow-2xl dark:border-gray-800 dark:bg-gray-900 max-w-lg">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 text-blue-500 relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-blue-400 opacity-20"></div>
            <Lock size={40} strokeWidth={2.5} className="relative z-10" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Kho tàng Kiến thức</h1>
          <p className="mt-4 text-sm font-medium text-gray-500">Đăng nhập để xem danh sách các từ vựng và Kanji bạn đã thu thập được trên hành trình.</p>
          <button onClick={() => setAuthModalOpen(true)} className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-lg font-black text-white shadow-[0_6px_0_rgb(37,99,235)] transition-all active:translate-y-1.5 active:shadow-none">
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="custom-scrollbar h-[calc(100vh-6rem)] w-full overflow-y-auto pr-2 md:pr-4 bg-[#f8fafc] dark:bg-gray-950">
      <div className="mx-auto max-w-5xl space-y-8 pb-12 pt-6 animate-fade-in">
        
        {/* HEADER */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b-2 border-gray-100 pb-6 dark:border-gray-800">
          <div>
            <button onClick={() => navigate('/dashboard')} className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary transition-colors">
              <ArrowLeft size={16} /> Quay lại Dashboard
            </button>
            <h1 className="flex items-center gap-3 text-3xl font-black text-gray-900 dark:text-white">
              <div className="rounded-xl bg-primary/10 p-2 text-primary"><Library size={28} /></div> 
              Kho tàng Kiến thức
            </h1>
            <p className="mt-2 text-sm font-medium text-gray-500">Bạn đã thu thập được tổng cộng <b className="text-primary">{totalElements}</b> mục.</p>
          </div>

          {/* TAB CHUYỂN ĐỔI KANJI / VOCAB */}
          <div className="flex rounded-2xl bg-white border-2 border-gray-100 p-1.5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <button onClick={() => { setActiveTab('KANJI'); setCurrentPage(0); }} className={`rounded-xl px-6 py-2.5 text-sm font-black transition-all ${activeTab === 'KANJI' ? 'bg-primary text-white shadow-[0_4px_0_rgb(37,99,235)] active:translate-y-1 active:shadow-none' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400'}`}>
              🈴 Kanji
            </button>
            <button onClick={() => { setActiveTab('VOCAB'); setCurrentPage(0); }} className={`rounded-xl px-6 py-2.5 text-sm font-black transition-all ${activeTab === 'VOCAB' ? 'bg-primary text-white shadow-[0_4px_0_rgb(37,99,235)] active:translate-y-1 active:shadow-none' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400'}`}>
              📚 Từ vựng
            </button>
          </div>
        </div>

        {/* LƯỚI HIỂN THỊ */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-primary" size={48} /></div>
          ) : items.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {items.map((item) => (
                  <SavedItemCard key={item.progressId} item={item} onDelete={handleDelete} />
                ))}
              </div>
              <div className="mt-10 border-t-2 border-gray-100 pt-8 dark:border-gray-800">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </div>
            </>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-gray-200 bg-white text-gray-400 dark:border-gray-800 dark:bg-gray-900">
              <BookMarked size={48} className="mb-4 opacity-30" />
              <p className="text-xl font-black text-gray-500">Chưa có dữ liệu</p>
              <p className="text-sm font-medium mt-1">Bạn chưa học {activeTab === 'KANJI' ? 'Kanji' : 'Từ vựng'} nào trong lộ trình.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};