const BASE_STAT_URL = 'http://localhost:8080/api/v1/statistics';
const BASE_PROG_URL = 'http://localhost:8080/api/v1/progress';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' };
};

export const studyService = {
  getDashboard: async () => {
    const res = await fetch(`${BASE_STAT_URL}/dashboard`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Lỗi tải Dashboard');
    return await res.json();
  },
  
  getNextQuestion: async (type) => {
    const res = await fetch(`${BASE_PROG_URL}/next?type=${type}`, { headers: getHeaders() });
    if (res.status === 204 || !res.ok) return null; 
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  },

  submitAnswer: async (progressId, isCorrect, timeSpentSeconds) => {
    const res = await fetch(`${BASE_PROG_URL}/submit`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ progressId, isCorrect, timeSpentSeconds })
    });
    return await res.json();
  },

  getExtraPractice: async (type) => {
    const res = await fetch(`${BASE_PROG_URL}/extra-practice?type=${type}`, { headers: getHeaders() });
    if (!res.ok) return [];
    return await res.json(); 
  },

  submitExtraPractice: async (progressId, isCorrect, timeSpentSeconds) => {
    const res = await fetch(`${BASE_PROG_URL}/extra-practice/submit`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ progressId, isCorrect, timeSpentSeconds })
    });
    return await res.json();
  }
};