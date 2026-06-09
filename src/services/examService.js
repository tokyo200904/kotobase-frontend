const BASE_URL = 'http://localhost:8080/api/v1/exam';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const handleResponse = async (res, errorMessage) => {
  if (res.status === 401) throw new Error('Vui lòng đăng nhập để thực hiện chức năng này.');
  if (res.status === 403) throw new Error('Tính năng này chỉ dành cho tài khoản Premium.');
  if (!res.ok) throw new Error(errorMessage);
  return await res.json();
};

export const examService = {
  getExamsByLevel: async (levelId, page = 1, limit = 10) => {
    const res = await fetch(`${BASE_URL}/by_level?levelId=${levelId}&page=${page}&limit=${limit}`);
    return handleResponse(res, 'Không thể tải danh sách bài thi');
  },

  getExamDetails: async (examId) => {
    const res = await fetch(`${BASE_URL}/${examId}`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(res, 'Không thể tải thông tin bài thi');
  },



  startExam: async (examId) => {
    const res = await fetch(`${BASE_URL}/attempts/${examId}/start`, {
      method: 'POST',
      headers: getHeaders()
    });
    return handleResponse(res, 'Không thể khởi tạo bài thi');
  },

  resumeAttempt: async (attemptId) => {
    const res = await fetch(`${BASE_URL}/attempts/${attemptId}/resume`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(res, 'Mất lượt thi hoặc mã phòng thi không hợp lệ');
  },

  getSectionDetails: async (attemptId, sectionId) => {
    const res = await fetch(`${BASE_URL}/attempts/${attemptId}/sections/${sectionId}`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(res, 'Không thể tải cấu trúc đề thi');
  },

  submitSection: async (attemptId, sectionId) => {
    const res = await fetch(`${BASE_URL}/attempts/${attemptId}/sections/${sectionId}/submit`, {
      method: 'POST',
      headers: getHeaders()
    });
    return handleResponse(res, 'Gửi yêu cầu nộp bài thất bại');
  },

  getExamResult: async (attemptId) => {
    const res = await fetch(`${BASE_URL}/result/${attemptId}`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(res, 'Không thể tải kết quả bài thi');
  },

  getExamResultDetails: async (attemptId) => {
    const res = await fetch(`${BASE_URL}/result/${attemptId}/details`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(res, 'Không thể tải chi tiết chữa bài');
  }
};