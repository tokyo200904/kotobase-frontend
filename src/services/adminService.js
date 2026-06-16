const BASE_URL = 'http://localhost:8080/api/v1/admin';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

const handleResponse = async (res) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Có lỗi xảy ra từ hệ thống');
  }
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await res.json();
  }
  return await res.text();
};

export const adminService = {
  // ================= DANH MỤC COMPACT (CHO DROPDOWN & FILTER) =================
  getCompactLevels: async () => {
    const res = await fetch(`${BASE_URL}/level/compact`, { headers: getHeaders() });
    return handleResponse(res);
  },
  getCompactLessons: async () => {
    const res = await fetch(`${BASE_URL}/lesson/compact`, { headers: getHeaders() });
    return handleResponse(res);
  },
  getCompactTopics: async () => {
    const res = await fetch(`${BASE_URL}/topic/compact`, { headers: getHeaders() });
    return handleResponse(res);
  },

  // ================= QUẢN LÝ HÁN TỰ (KANJI) =================
  getKanjis: async (search = '', levelId = '', page = 0, size = 10) => {
    const params = new URLSearchParams({ page, size });
    if (search) params.append('search', search);
    if (levelId) params.append('levelId', levelId);
    const res = await fetch(`${BASE_URL}/kanji?${params.toString()}`, { headers: getHeaders() });
    return handleResponse(res);
  },
  getKanjiById: async (id) => {
    const res = await fetch(`${BASE_URL}/kanji/${id}`, { headers: getHeaders() });
    return handleResponse(res);
  },
  createKanji: async (data) => {
    const res = await fetch(`${BASE_URL}/kanji`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) });
    return handleResponse(res);
  },
  updateKanji: async (id, data) => {
    const res = await fetch(`${BASE_URL}/kanji/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(data) });
    return handleResponse(res);
  },
  deleteKanji: async (id) => {
    const res = await fetch(`${BASE_URL}/kanji/${id}`, { method: 'DELETE', headers: getHeaders() });
    return handleResponse(res);
  },

getCompactLessonsByLevel: async (levelId, lessonType = '') => {
    let url = `${BASE_URL}/lesson/compact?levelId=${levelId}`;
    if (lessonType) {
      url += `&lessonType=${lessonType}`;
    }
    const res = await fetch(url, { headers: getHeaders() });
    return handleResponse(res);
  },
  getCompactTopicsByLesson: async (lessonId) => {
    // Dựa vào code backend bạn vừa gửi: /topic/compact?lessonId=...
    const res = await fetch(`${BASE_URL}/topic/compact?lessonId=${lessonId}`, { headers: getHeaders() });
    return handleResponse(res);
  },

  // ================= QUẢN LÝ TỪ VỰNG (VOCAB) =================
  getVocabs: async (search = '', levelId = '', topicId = '', page = 0, size = 10) => {
    const params = new URLSearchParams({ page, size });
    if (search) params.append('search', search);
    if (levelId) params.append('levelId', levelId); // API hỗ trợ lọc Level
    if (topicId) params.append('topicId', topicId); // API hỗ trợ lọc Topic
    
    const res = await fetch(`${BASE_URL}/vocab?${params.toString()}`, { headers: getHeaders() });
    return handleResponse(res);
  },
  getVocabById: async (id) => {
    const res = await fetch(`${BASE_URL}/vocab/${id}`, { headers: getHeaders() });
    return handleResponse(res);
  },
  createVocab: async (data) => {
    const res = await fetch(`${BASE_URL}/vocab`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) });
    return handleResponse(res);
  },
  updateVocab: async (id, data) => {
    const res = await fetch(`${BASE_URL}/vocab/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(data) });
    return handleResponse(res);
  },
  deleteVocab: async (id) => {
    const res = await fetch(`${BASE_URL}/vocab/${id}`, { method: 'DELETE', headers: getHeaders() });
    return handleResponse(res);
  },

  // ================= QUẢN LÝ NGỮ PHÁP (GRAMMAR) =================
  getGrammars: async (search = '', lessonId = '', page = 0, size = 10) => {
    const params = new URLSearchParams({ page, size });
    if (search) params.append('search', search);
    if (lessonId) params.append('lessonId', lessonId);
    const res = await fetch(`${BASE_URL}/grammar?${params.toString()}`, { headers: getHeaders() });
    return handleResponse(res);
  },
  getGrammarById: async (id) => {
    const res = await fetch(`${BASE_URL}/grammar/${id}`, { headers: getHeaders() });
    return handleResponse(res);
  },
  createGrammar: async (data) => {
    const res = await fetch(`${BASE_URL}/grammar`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) });
    return handleResponse(res);
  },
  updateGrammar: async (id, data) => {
    const res = await fetch(`${BASE_URL}/grammar/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(data) });
    return handleResponse(res);
  },
  deleteGrammar: async (id) => {
    const res = await fetch(`${BASE_URL}/grammar/${id}`, { method: 'DELETE', headers: getHeaders() });
    return handleResponse(res);
  }
};