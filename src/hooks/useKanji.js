import { useState, useEffect } from 'react';
import { kanjiService } from '../services/kanjiService';

export const useKanji = (initialLevel = 'N5') => {
  // State cho danh sách
  const [activeLevel, setActiveLevel] = useState(initialLevel);
  const [kanjiList, setKanjiList] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(false);

  // State cho chi tiết (Modal)
  const [selectedKanji, setSelectedKanji] = useState(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Luồng dữ liệu: Tự động fetch danh sách khi level thay đổi
  useEffect(() => {
    const fetchList = async () => {
      setIsLoadingList(true);
      const data = await kanjiService.getKanjiListByLevel(activeLevel);
      setKanjiList(data);
      setIsLoadingList(false);
    };
    fetchList();
  }, [activeLevel]);

  // Luồng dữ liệu: Bấm vào 1 Kanji -> Fetch chi tiết -> Mở Modal
  const handleOpenDetail = async (id) => {
    setIsModalOpen(true); // Mở modal ngay lập tức để hiện Skeleton (Loading)
    setIsLoadingDetail(true);
    
    const data = await kanjiService.getKanjiDetail(id);
    setSelectedKanji(data);
    setIsLoadingDetail(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Timeout nhỏ để đợi animation đóng modal xong mới xóa data, tránh giật UI
    setTimeout(() => setSelectedKanji(null), 300);
  };

  return {
    activeLevel, setActiveLevel,
    kanjiList, isLoadingList,
    selectedKanji, isLoadingDetail,
    isModalOpen, handleOpenDetail, handleCloseModal
  };
};