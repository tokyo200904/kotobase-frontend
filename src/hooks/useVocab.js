import { useState, useEffect, useCallback } from 'react';
import { vocabService } from '../services/vocabService';

export const useVocab = () => {
  // State lưu trữ dữ liệu
  const [levels, setLevels] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [topics, setTopics] = useState([]);
  const [vocabs, setVocabs] = useState([]);
  
  // State quản lý lựa chọn hiện tại
  const [activeLevel, setActiveLevel] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);

  // State phân trang từ vựng
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isLoadingLevels, setIsLoadingLevels] = useState(false);
  const [isLoadingLessons, setIsLoadingLessons] = useState(false);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [isLoadingVocabs, setIsLoadingVocabs] = useState(false);

  useEffect(() => {
    const fetchLevels = async () => {
      setIsLoadingLevels(true);
      const data = await vocabService.getLevels();
      setLevels(data);
      if (data.length > 0) setActiveLevel(data[0]); 
      setIsLoadingLevels(false);
    };
    fetchLevels();
  }, []);

  useEffect(() => {
    if (!activeLevel) return;
    const fetchLessons = async () => {
      setIsLoadingLessons(true);
      setTopics([]); setVocabs([]); 
      setActiveLesson(null); setActiveTopic(null);

      const data = await vocabService.getLessonsByLevel(activeLevel.id);
      setLessons(data);
      if (data.length > 0) setActiveLesson(data[0]);
      setIsLoadingLessons(false);
    };
    fetchLessons();
  }, [activeLevel]);

  useEffect(() => {
    if (!activeLesson) return;
    const fetchTopics = async () => {
      setIsLoadingTopics(true);
      setVocabs([]); setActiveTopic(null);

      const data = await vocabService.getTopicsByLesson(activeLesson.id);
      setTopics(data);
      if (data.length > 0) setActiveTopic(data[0]);
      setIsLoadingTopics(false);
    };
    fetchTopics();
  }, [activeLesson]);

  const fetchVocabs = useCallback(async () => {
    if (!activeTopic) return;
    setIsLoadingVocabs(true);
    const result = await vocabService.getVocabsByTopic(activeTopic.id, currentPage, 10); 
    setVocabs(result.data || []);
    setTotalPages(result.totalPages || 1);
    setIsLoadingVocabs(false);
  }, [activeTopic, currentPage]);

  useEffect(() => {
    fetchVocabs();
  }, [fetchVocabs]);

  // Hàm chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Hàm đổi Topic (Reset page về 1)
  const handleTopicChange = (topic) => {
    setActiveTopic(topic);
    setCurrentPage(1);
  };

  return {
    levels, activeLevel, setActiveLevel, isLoadingLevels,
    lessons, activeLesson, setActiveLesson, isLoadingLessons,
    topics, activeTopic, handleTopicChange, isLoadingTopics,
    vocabs, isLoadingVocabs,
    currentPage, totalPages, handlePageChange
  };
};