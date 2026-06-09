import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, Lock, Sparkles, Crown, BookOpen, GraduationCap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useKanji } from '../hooks/useKanji';
import { KanjiDetailModal } from '../components/kanji/KanjiDetailModal';
import { useAuth } from '../context/AuthContext';

const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];

const PremiumRequiredModal = ({ isOpen, onClose }) => {
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
          Hệ thống đang khóa các cấp độ nâng cao từ N4 đến N1. Hãy kích hoạt gói Premium để mở khóa không giới hạn kho tàng Kanji, Từ vựng và Đề thi thử!
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

export const KanjiPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); 
  
  const { 
    activeLevel, setActiveLevel, 
    kanjiList, isLoadingList, 
    searchResults, isSearching, handleSearch, clearSearchResults,
    selectedKanji, isLoadingDetail, 
    isModalOpen, handleOpenDetail, handleCloseModal 
  } = useKanji('N5');

  const [searchInput, setSearchInput] = useState('');
  const dropdownRef = useRef(null);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  const handleKanjiClick = (item) => {
    if (item.isLocked) {
      setIsPremiumModalOpen(true);
    } else {
      handleOpenDetail(item.id);
    }
  };

  const onSelectSearchResult = (item) => {
    handleKanjiClick(item);
    clearSearchResults();
    setSearchInput('');
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchInput.trim()) handleSearch(searchInput);
      else clearSearchResults();
    }, 300); 
    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        clearSearchResults();
        setSearchInput(''); 
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="custom-scrollbar h-[calc(100vh-6rem)] w-full overflow-y-auto pr-2 md:pr-4 bg-[#f8fafc] dark:bg-gray-950">
      <div className="mx-auto max-w-6xl space-y-6 pb-12 pt-2 animate-fade-in">
        
        <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-2 text-primary"><BookOpen size={26} /></div>
              Thư viện Kanji
            </h1>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-gray-400">Tra cứu cấu trúc bộ thủ & cách viết</p>
          </div>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center w-full lg:w-auto">
            {/* KHUNG TÌM KIẾM CAO CẤP */}
            <div className="relative z-50 flex flex-1 sm:w-72 flex-col" ref={dropdownRef}>
              <div className="relative flex items-center w-full">
                <input
                  type="text" placeholder="Tìm chữ, nghĩa, âm Hán..." value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 py-3 pl-4 pr-10 text-sm font-medium outline-none transition-all focus:border-primary focus:bg-white dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                />
                {isSearching ? (
                  <Loader2 size={18} className="absolute right-3 text-primary animate-spin" />
                ) : searchInput ? (
                  <button onClick={() => { setSearchInput(''); clearSearchResults(); }} className="absolute right-3 text-gray-400 hover:text-gray-600"><X size={18} /></button>
                ) : (
                  <Search size={18} className="absolute right-3 text-gray-400" />
                )}
              </div>

              {searchInput.trim() && !isSearching && (
                <div className="absolute top-full mt-2 w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800">
                  {searchResults.length > 0 ? (
                    <div className="custom-scrollbar max-h-80 overflow-y-auto">
                      {searchResults.map((item) => (
                        <button
                          key={item.id} onClick={() => onSelectSearchResult(item)}
                          className="group flex w-full items-center justify-between border-b border-gray-50 px-4 py-3.5 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50 last:border-0"
                        >
                          <div className="flex items-center gap-4">
                            <span className={`text-3xl font-black ${item.isLocked ? 'text-gray-300 blur-[0.5px]' : 'text-gray-900 dark:text-white'}`}>{item.characters}</span>
                            <div className="flex flex-col">
                              {item.han && <span className={`text-xs font-black uppercase ${item.isLocked ? 'text-gray-400' : 'text-primary'}`}>[{item.han}]</span>}
                              <span className={`text-sm font-bold capitalize ${item.isLocked ? 'text-gray-400 font-medium' : 'text-gray-600 dark:text-gray-300'}`}>{item.meaning}</span>
                            </div>
                          </div>
                          {item.isLocked && <Lock size={16} className="text-gray-300 group-hover:text-amber-500 transition-colors" />}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm font-bold text-gray-400">Không tìm thấy chữ Kanji phù hợp.</div>
                  )}
                </div>
              )}
            </div>

            <div className="flex rounded-2xl bg-gray-100 p-1.5 dark:bg-gray-900 border dark:border-gray-800 shadow-inner">
              {LEVELS.map((level) => {
                const isActive = activeLevel === level;
                const isPremiumLvl = level !== 'N5'; 

                return (
                  <button
                    key={level} onClick={() => setActiveLevel(level)}
                    className={`relative flex items-center gap-1 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                      isActive 
                        ? 'bg-white text-gray-900 shadow-md dark:bg-gray-800 dark:text-white scale-100' 
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 scale-95'
                    }`}
                  >
                    <span>{level}</span>
                    {isPremiumLvl && (
                      <Crown size={10} className={`shrink-0 ${isActive ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {activeLevel !== 'N5' && !user?.premium && (
          <div className="relative overflow-hidden rounded-[2rem] border-2 border-yellow-400/20 bg-gradient-to-r from-yellow-500/10 via-amber-500/5 to-transparent p-6 dark:from-yellow-500/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm animate-fade-in">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-white shadow-md shadow-yellow-500/20"><GraduationCap size={24} /></div>
              <div>
                <h3 className="text-base font-black text-gray-900 dark:text-white">Bạn đang xem kho lưu trữ cấp độ {activeLevel} Pro</h3>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">Mở khóa gói Premium ngay hôm nay để kích hoạt toàn bộ tính năng phân tích nét vẽ chi tiết.</p>
              </div>
            </div>
            <button onClick={() => navigate('/premium')} className="flex items-center gap-1.5 rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-md transition-all hover:bg-black active:scale-95 shrink-0 dark:bg-gray-800">
              Nâng cấp ngay <ArrowRight size={14} strokeWidth={3} />
            </button>
          </div>
        )}

        <div className="rounded-[2.5rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8 min-h-[400px]">
          {isLoadingList ? (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
              {[...Array(40)].map((_, i) => <div key={i} className="aspect-square rounded-2xl bg-gray-50 dark:bg-gray-800/50 animate-pulse"></div>)}
            </div>
          ) : kanjiList.length > 0 ? (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
              {kanjiList.map((kanji) => {
                return (
                  <button
                    key={kanji.id} onClick={() => handleKanjiClick(kanji)}
                    className={`group relative flex aspect-square cursor-pointer items-center justify-center rounded-2xl border transition-all duration-300 ${
                      kanji.isLocked
                        ? 'border-gray-100 bg-gray-50/50 text-gray-300/40 hover:border-yellow-400 hover:bg-yellow-50/30 dark:border-gray-800 dark:bg-gray-950/40'
                        : 'border-gray-100 bg-white text-gray-800 shadow-sm hover:-translate-y-1.5 hover:border-primary hover:text-primary hover:shadow-xl dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200 dark:hover:border-primary'
                    }`}
                  >
                    <span className={`font-serif text-3xl font-bold transition-all duration-300 ${kanji.isLocked ? 'blur-[1.5px] opacity-40 group-hover:blur-[3px]' : 'group-hover:scale-110'}`}>
                      {kanji.characters}
                    </span>
                    
                    {kanji.isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-2xl transition-all">
                        <div className="rounded-xl bg-white p-1.5 shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800 transition-transform group-hover:scale-110 group-hover:border-yellow-400 group-hover:text-yellow-500 text-gray-400">
                          <Lock size={16} strokeWidth={2.5} className="animate-pulse-slow" />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center text-gray-400 font-bold">Chưa có dữ liệu chữ Kanji nào được tải lên.</div>
          )}
        </div>
      </div>

      <KanjiDetailModal isOpen={isModalOpen} onClose={handleCloseModal} kanji={selectedKanji} isLoading={isLoadingDetail} />

      <PremiumRequiredModal isOpen={isPremiumModalOpen} onClose={() => setIsPremiumModalOpen(false)} />
      
    </div>
  );
};