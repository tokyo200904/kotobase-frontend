import { useState, useEffect, useCallback } from 'react';
import { vocabService } from '../services/vocabService';

export const useVocabList = (topicId) => {
  const [vocabs, setVocabs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 6; 

  const fetchVocabs = useCallback(async () => {
    if (!topicId) return;
    
    setIsLoading(true);
    
    const response = await vocabService.getVocabsByTopic(topicId, currentPage, LIMIT);
    
    setVocabs(response.data || []);
    setTotalPages(response.totalPages > 0 ? response.totalPages : 1); 
    
    setIsLoading(false);
  }, [topicId, currentPage]);

  useEffect(() => {
    fetchVocabs();
  }, [fetchVocabs]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return {
    vocabs,
    isLoading,
    currentPage,
    totalPages,
    handlePageChange
  };
};