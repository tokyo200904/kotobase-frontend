import { useState, useEffect, useCallback } from 'react';
import { kanjiService } from '../services/kanjiService';

export const useKanji = (initialLevel = 'N5') => {
  // State cho danh sách lưới theo Level
  const [activeLevel, setActiveLevel] = useState(initialLevel);
  const [kanjiList, setKanjiList] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  
  // State RIÊNG cho khung Tìm kiếm xổ xuống
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // State cho Modal chi tiết
  const [selectedKanji, setSelectedKanji] = useState(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchListByLevel = useCallback(async (level) => {
    setIsLoadingList(true);
    const data = await kanjiService.getKanjiListByLevel(level);
    setKanjiList(data);
    setIsLoadingList(false);
  }, []);

  // Gọi API danh sách Level
  useEffect(() => {
    fetchListByLevel(activeLevel);
  }, [activeLevel, fetchListByLevel]);

  // Hàm gọi API tìm kiếm
  const handleSearch = async (keyword) => {
    if (!keyword || keyword.trim() === '') {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const data = await kanjiService.searchKanji(keyword);
    setSearchResults(data);
    setIsSearching(false);
  };

  // Hàm xóa kết quả tìm kiếm
  const clearSearchResults = () => {
    setSearchResults([]);
  };

  // Mở modal chi tiết
  const handleOpenDetail = async (id) => {
    setIsModalOpen(true);
    setIsLoadingDetail(true);
    const data = await kanjiService.getKanjiDetail(id);
    setSelectedKanji(data);
    setIsLoadingDetail(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedKanji(null), 300);
  };

  return {
    activeLevel, setActiveLevel,
    kanjiList, isLoadingList,
    searchResults, isSearching, handleSearch, clearSearchResults, // Dữ liệu cho Dropdown
    selectedKanji, isLoadingDetail,
    isModalOpen, handleOpenDetail, handleCloseModal
  };
};