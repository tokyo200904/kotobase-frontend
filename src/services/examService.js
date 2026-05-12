const BASE_URL = 'http://localhost:8080/api/v1/exam';

export const examService = {
  // Lấy danh sách bài thi theo Level ID
  getExamsByLevel: async (levelId, page = 1, limit = 10) => {
    try {
      const response = await fetch(`${BASE_URL}/by_level?levelId=${levelId}&page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Không thể tải danh sách bài thi');
      return await response.json();
    } catch (error) {
      console.error("Exam Service Error:", error);
      throw error;
    }
  }
};