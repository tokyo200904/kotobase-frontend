const BASE_URL = 'http://localhost:8080/api/v1/practice';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

export const practiceService = {
  getKanjiFlashcards: async (level) => {
    const res = await fetch(`${BASE_URL}/flashcard/kanji?level=${level}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Không thể tải Flashcard Kanji');
    return await res.json();
  },
  
  getKanjiQuiz: async (levelId) => {
    const res = await fetch(`${BASE_URL}/quiz/kanji?levelId=${levelId}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Không thể tải bài Trắc nghiệm Kanji');
    return await res.json();
  },

  // 2. VOCAB: Lấy Flashcard, Trắc nghiệm & Đọc hiểu
  getVocabFlashcards: async (topicId) => {
    const res = await fetch(`${BASE_URL}/flashcard/vocab?topicId=${topicId}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Không thể tải Flashcard Từ vựng');
    return await res.json();
  },

  getVocabQuiz: async (topicId) => {
    const res = await fetch(`${BASE_URL}/quiz/vocab?topicId=${topicId}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Không thể tải bài Trắc nghiệm Từ vựng');
    return await res.json();
  },

  getVocabDokkai: async (topicId) => {
    const res = await fetch(`${BASE_URL}/vocab/dokkai?topicId=${topicId}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Không thể tải bài Đọc hiểu Từ vựng');
    return await res.json();
  },

  getGrammarDokkai: async (grammarId) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/grammar/dokkai?grammarId=${grammarId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  });
  if (!res.ok) throw new Error('Không thể tải bài tập ngữ pháp');
  return await res.json();
},
};