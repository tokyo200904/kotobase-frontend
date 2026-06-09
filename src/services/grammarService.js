const BASE_URL = 'http://localhost:8080/api/v1';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

export const grammarService = {
  getLevels: async () => {
    try {
      const response = await fetch(`${BASE_URL}/level`, {
        headers: getHeaders() 
      });
      if (!response.ok) throw new Error('Lỗi tải danh sách cấp độ');
      return await response.json();
    } catch (error) {
      console.error('Lỗi getLevels:', error);
      return [];
    }
  },

  getLessonsByLevel: async (levelId) => {
    try {
      const response = await fetch(`${BASE_URL}/lesson/levels/${levelId}?type=grammar`, {
        headers: getHeaders() 
      });
      if (!response.ok) throw new Error('Lỗi tải danh sách bài học ngữ pháp');
      return await response.json();
    } catch (error) {
      console.error('Lỗi getLessonsByLevel:', error);
      return [];
    }
  },

  getGrammarsByLesson: async (lessonId) => {
    try {
      const response = await fetch(`${BASE_URL}/grammar/by-lesson?lessonId=${lessonId}`, {
        headers: getHeaders() 
      });
      if (!response.ok) throw new Error('Lỗi tải danh sách cấu trúc ngữ pháp');
      return await response.json();
    } catch (error) {
      console.error('Lỗi getGrammarsByLesson:', error);
      return [];
    }
  },

  getGrammarDetail: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/grammar/${id}`, {
        headers: getHeaders() 
      });
      if (!response.ok) throw new Error('Lỗi tải chi tiết cấu trúc');
      return await response.json();
    } catch (error) {
      console.error('Lỗi getGrammarDetail:', error);
      return null;
    }
  }
};