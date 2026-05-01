
const BASE_URL = 'http://localhost:8080/api/v1';

export const vocabService = {
  // Lấy danh sách Level
  getLevels: async () => {
    try {
      const response = await fetch(`${BASE_URL}/level`);
      if (!response.ok) throw new Error('Lỗi tải Levels');
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  // Lấy danh sách Bài học theo Level
getLessonsByLevel: async (levelId, type = 'vocab') => {
    try {
      const response = await fetch(`${BASE_URL}/lesson/levels/${levelId}?type=${type}`);
      if (!response.ok) throw new Error('Lỗi tải Lessons');
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  // Lấy danh sách Chủ đề theo Bài học
  getTopicsByLesson: async (lessonId) => {
    try {
      const response = await fetch(`${BASE_URL}/topic/${lessonId}`);
      if (!response.ok) throw new Error('Lỗi tải Topics');
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  // Lấy Từ vựng theo Chủ đề 
  getVocabsByTopic: async (topicId, page = 1, limit = 5) => {
    try {
      const response = await fetch(`${BASE_URL}/vocab/by_topic?topicId=${topicId}&page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Lỗi tải Vocabularies');
      return await response.json(); // Trả về object chứa data và thông tin phân trang
    } catch (error) {
      console.error(error);
      return { data: [], totalPages: 0, page: 0 };
    }
  }
};