import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useKanji } from '../hooks/useKanji';
import { KanjiDetailModal } from '../components/kanji/KanjiDetailModal';

const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];

export const KanjiPage = () => {
  const { 
    activeLevel, setActiveLevel, 
    kanjiList, isLoadingList, 
    searchResults, isSearching, handleSearch, clearSearchResults,
    selectedKanji, isLoadingDetail, 
    isModalOpen, handleOpenDetail, handleCloseModal 
  } = useKanji('N5');

  const [searchInput, setSearchInput] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchInput.trim()) {
        handleSearch(searchInput);
      } else {
        clearSearchResults();
      }
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


  const onSelectSearchResult = (id) => {
    handleOpenDetail(id);
    clearSearchResults();
    setSearchInput('');
  };

  const clearSearch = () => {
    setSearchInput('');
    clearSearchResults();
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col space-y-6">
      
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Danh sách Kanji</h1>
        
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          
          <div className="relative z-50 flex w-full sm:w-72 flex-col" ref={dropdownRef}>
            <div className="relative flex items-center w-full">
              <input
                type="text"
                placeholder="Tìm chữ, nghĩa, âm Hán..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-4 pr-10 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-primary"
              />
              
              {isSearching ? (
                <div className="absolute right-3 text-primary animate-spin">
                  <Loader2 size={16} />
                </div>
              ) : searchInput ? (
                <button type="button" onClick={clearSearch} className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <X size={16} />
                </button>
              ) : (
                <div className="absolute right-3 text-gray-400">
                  <Search size={16} />
                </div>
              )}
            </div>


            {searchInput.trim() && !isSearching && (
              <div className="absolute top-full mt-2 w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
                {searchResults.length > 0 ? (
                  <div className="custom-scrollbar max-h-80 overflow-y-auto">
                    {searchResults.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onSelectSearchResult(item.id)}
                        className="flex w-full items-center gap-4 border-b border-gray-50 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50 last:border-0"
                      >
                        <span className="text-3xl font-black text-gray-900 dark:text-white">
                          {item.characters}
                        </span>
                        <div className="flex flex-col">
                          {item.han && (
                            <span className="text-xs font-bold text-primary uppercase">
                              [{item.han}]
                            </span>
                          )}
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300 capitalize">
                            {item.meaning}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Không tìm thấy chữ Kanji nào.
                  </div>
                )}
              </div>
            )}
          </div>


          <div className={`inline-flex rounded-2xl bg-gray-100/80 p-1.5 shadow-inner backdrop-blur-sm dark:bg-gray-800/80 transition-opacity ${
            searchInput ? 'opacity-50 grayscale pointer-events-none' : 'opacity-100'
          }`}>
            {LEVELS.map((level) => {
              const isActive = activeLevel === level;
              
              return (
                <button
                  key={level}
                  onClick={() => setActiveLevel(level)}
                  className={`relative flex items-center justify-center rounded-xl px-5 py-2 text-sm font-black transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary text-white shadow-md scale-100' 
                      : 'text-gray-500 hover:bg-white hover:text-gray-800 hover:shadow-sm dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white scale-95 hover:scale-100'
                  }`}
                >
                  {level}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-2xl bg-white p-4 shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800 sm:p-6">
        <div className="custom-scrollbar h-full w-full overflow-y-auto pr-2">
          {isLoadingList ? (
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
                  className="group flex aspect-square cursor-pointer items-center justify-center rounded-2xl border border-gray-100 bg-white text-3xl font-medium text-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary hover:text-primary hover:shadow-lg dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:hover:border-primary dark:hover:text-primary"
                >
                  {kanji.characters}
                </button>
              ))}
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