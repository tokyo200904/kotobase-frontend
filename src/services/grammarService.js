const BASE_URL = 'http://localhost:8080/api/v1';

export const grammarService = {
  getGrammarsByLesson: async (lessonId) => {
    try {
      const response = await fetch(`${BASE_URL}/grammar/by-lesson?lessonId=${lessonId}`);
      if (!response.ok) throw new Error('Lỗi tải danh sách ngữ pháp');
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },
}