const BASE_URL = 'http://localhost:8080/api/v1/exam';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

export const examService = {
  getExamsByLevel: async (levelId, page = 1, limit = 10) => {
    try {
      const response = await fetch(`${BASE_URL}/by_level?levelId=${levelId}&page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Không thể tải danh sách bài thi');
      return await response.json();
    } catch (error) {
      console.error("Exam Service Error:", error);
      throw error;
    }
  },

  startExam: async (examId) => {
    const res = await fetch(`${BASE_URL}/attempts/${examId}/start`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Không thể khởi tạo bài thi');
    return await res.json();
  },

  resumeAttempt: async (attemptId) => {
    const res = await fetch(`${BASE_URL}/attempts/${attemptId}/resume`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Mất lượt thi hoặc mã phòng thi không hợp lệ');
    return await res.json();
  },

  getSectionDetails: async (attemptId, sectionId) => {
    const res = await fetch(`${BASE_URL}/attempts/${attemptId}/sections/${sectionId}`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Không thể tải cấu trúc đề thi');
    return await res.json();
  },

  submitSection: async (attemptId, sectionId) => {
    const res = await fetch(`${BASE_URL}/attempts/${attemptId}/sections/${sectionId}/submit`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Gửi yêu cầu nộp bài thất bại');
    return await res.json();
  },

  getExamDetails: async (examId) => {
  const res = await fetch(`${BASE_URL}/${examId}`, {
    method: 'GET',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Không thể tải thông tin bài thi');
  return await res.json();
},

getExamResult: async (attemptId) => {
    const res = await fetch(`${BASE_URL}/result/${attemptId}`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Không thể tải kết quả bài thi');
    return await res.json();
  },

  getExamResultDetails: async (attemptId) => {
    const res = await fetch(`${BASE_URL}/result/${attemptId}/details`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Không thể tải chi tiết chữa bài');
    return await res.json();
  }

};