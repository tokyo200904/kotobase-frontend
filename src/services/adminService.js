const BASE_URL = "http://localhost:8080/api/v1/admin";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Có lỗi xảy ra từ hệ thống");
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
    const res = await fetch(`${BASE_URL}/level/compact`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
  getCompactLessons: async () => {
    const res = await fetch(`${BASE_URL}/lesson/compact`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
  getCompactTopics: async () => {
    const res = await fetch(`${BASE_URL}/topic/compact`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // ================= QUẢN LÝ HÁN TỰ (KANJI) =================
  getKanjis: async (search = "", levelId = "", page = 0, size = 10) => {
    const params = new URLSearchParams({ page, size });
    if (search) params.append("search", search);
    if (levelId) params.append("levelId", levelId);
    const res = await fetch(`${BASE_URL}/kanji?${params.toString()}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
  getKanjiById: async (id) => {
    const res = await fetch(`${BASE_URL}/kanji/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
  createKanji: async (data) => {
    const res = await fetch(`${BASE_URL}/kanji`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateKanji: async (id, data) => {
    const res = await fetch(`${BASE_URL}/kanji/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteKanji: async (id) => {
    const res = await fetch(`${BASE_URL}/kanji/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getCompactLessonsByLevel: async (levelId, lessonType = "") => {
    let url = `${BASE_URL}/lesson/compact?levelId=${levelId}`;
    if (lessonType) {
      url += `&lessonType=${lessonType}`;
    }
    const res = await fetch(url, { headers: getHeaders() });
    return handleResponse(res);
  },
  getCompactTopicsByLesson: async (lessonId) => {
    const res = await fetch(`${BASE_URL}/topic/compact?lessonId=${lessonId}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // ================= QUẢN LÝ TỪ VỰNG (VOCAB) =================
  getVocabs: async (
    search = "",
    levelId = "",
    topicId = "",
    page = 0,
    size = 10,
  ) => {
    const params = new URLSearchParams({ page, size });
    if (search) params.append("search", search);
    if (levelId) params.append("levelId", levelId);
    if (topicId) params.append("topicId", topicId);

    const res = await fetch(`${BASE_URL}/vocab?${params.toString()}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
  getVocabById: async (id) => {
    const res = await fetch(`${BASE_URL}/vocab/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
  createVocab: async (data) => {
    const res = await fetch(`${BASE_URL}/vocab`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateVocab: async (id, data) => {
    const res = await fetch(`${BASE_URL}/vocab/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteVocab: async (id) => {
    const res = await fetch(`${BASE_URL}/vocab/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // ================= QUẢN LÝ NGỮ PHÁP (GRAMMAR) =================
getGrammars: async (search = '', levelId = '', lessonId = '', page = 0, size = 10) => {
    const params = new URLSearchParams({ page, size });
    if (search) params.append('search', search);
    if (levelId) params.append('levelId', levelId);
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
  },

  // ================= QUẢN LÝ BÀI HỌC (LESSON) =================
  getLessons: async (search = '', levelId = '', lessonType = '', page = 0, size = 15) => {
    const params = new URLSearchParams({ page, size });
    if (search) params.append('search', search);
    if (levelId) params.append('levelId', levelId);
    if (lessonType) params.append('lessonType', lessonType);
    
    const res = await fetch(`${BASE_URL}/lesson?${params.toString()}`, { headers: getHeaders() });
    return handleResponse(res);
  },
  getLessonById: async (id) => {
    const res = await fetch(`${BASE_URL}/lesson/${id}`, { headers: getHeaders() });
    return handleResponse(res);
  },
  createLesson: async (data) => {
    const res = await fetch(`${BASE_URL}/lesson`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) });
    return handleResponse(res);
  },
  updateLesson: async (id, data) => {
    const res = await fetch(`${BASE_URL}/lesson/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(data) });
    return handleResponse(res);
  },
  deleteLesson: async (id) => {
    const res = await fetch(`${BASE_URL}/lesson/${id}`, { method: 'DELETE', headers: getHeaders() });
    return handleResponse(res);
  },

  // ================= QUẢN LÝ CHỦ ĐỀ (TOPIC) =================
  getTopics: async (search = '', lessonId = '', page = 0, size = 15) => {
    const params = new URLSearchParams({ page, size });
    if (search) params.append('search', search);
    // API backend của bạn chỉ cần filter theo lessonId
    if (lessonId) params.append('lessonId', lessonId); 
    
    const res = await fetch(`${BASE_URL}/topic?${params.toString()}`, { headers: getHeaders() });
    return handleResponse(res);
  },
  getTopicById: async (id) => {
    const res = await fetch(`${BASE_URL}/topic/${id}`, { headers: getHeaders() });
    return handleResponse(res);
  },
  createTopic: async (data) => {
    const res = await fetch(`${BASE_URL}/topic`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) });
    return handleResponse(res);
  },
  updateTopic: async (id, data) => {
    const res = await fetch(`${BASE_URL}/topic/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(data) });
    return handleResponse(res);
  },
  deleteTopic: async (id) => {
    const res = await fetch(`${BASE_URL}/topic/${id}`, { method: 'DELETE', headers: getHeaders() });
    return handleResponse(res);
  },

  // ================= QUẢN LÝ GÓI CƯỚC (PREMIUM PLANS) =================
  getPlans: async (search = '', isActive = '', page = 0, size = 10) => {
    const params = new URLSearchParams({ page, size });
    if (search) params.append('search', search);
    if (isActive !== '') params.append('isActive', isActive);
    
    const res = await fetch(`${BASE_URL}/plans?${params.toString()}`, { headers: getHeaders() });
    return handleResponse(res);
  },
  getPlanById: async (id) => {
    const res = await fetch(`${BASE_URL}/plans/${id}`, { headers: getHeaders() });
    return handleResponse(res);
  },
  createPlan: async (data) => {
    const res = await fetch(`${BASE_URL}/plans`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) });
    return handleResponse(res);
  },
  updatePlan: async (id, data) => {
    const res = await fetch(`${BASE_URL}/plans/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(data) });
    return handleResponse(res);
  },
  togglePlanStatus: async (id) => {
    const res = await fetch(`${BASE_URL}/plans/${id}/toggle-status`, { method: 'PATCH', headers: getHeaders() });
    return handleResponse(res);
  },

  // ================= QUẢN LÝ NHẬT KÝ GIAO DỊCH (TRANSACTIONS) =================
  getTransactions: async (search = '', status = '', page = 0, size = 15) => {
    const params = new URLSearchParams({ page, size });
    if (search) params.append('search', search);
    if (status) params.append('status', status); 
    
    const res = await fetch(`${BASE_URL}/transaction?${params.toString()}`, { headers: getHeaders() });
    return handleResponse(res);
  },
  
  getTransactionDetail: async (id) => {
    const res = await fetch(`${BASE_URL}/transaction/${id}`, { headers: getHeaders() });
    return handleResponse(res);
  },

  // ================= QUẢN LÝ NGƯỜI DÙNG (USERS) =================
  getUsers: async (search = '', isEnabled = '', isPremium = '', page = 0, size = 15) => {
    const params = new URLSearchParams({ page, size });
    if (search) params.append('search', search);
    if (isEnabled !== '') params.append('isEnabled', isEnabled);
    if (isPremium !== '') params.append('isPremium', isPremium);
    
    const res = await fetch(`${BASE_URL}/user?${params.toString()}`, { headers: getHeaders() });
    return handleResponse(res);
  },
  getUserDetail: async (id) => {
    const res = await fetch(`${BASE_URL}/user/${id}`, { headers: getHeaders() });
    return handleResponse(res);
  },
  toggleUserStatus: async (id) => {
    const res = await fetch(`${BASE_URL}/user/${id}/toggle-status`, { method: 'PATCH', headers: getHeaders() });
    return handleResponse(res);
  },
  grantManualPremium: async (id, planId) => {
    const res = await fetch(`${BASE_URL}/user/${id}/grant-premium`, { 
      method: 'POST', 
      headers: getHeaders(), 
      body: JSON.stringify({ planId }) 
    });
    return handleResponse(res);
  },

  getActivePlansForDropdown: async () => {
    const res = await fetch(`${BASE_URL}/plans/active-list`, { headers: getHeaders() });
    return handleResponse(res);
  },

  // ================= QUẢN LÝ ĐỀ THI (EXAMS) =================
  getExams: async (search = '', levelId = '', page = 0, size = 10) => {
    const params = new URLSearchParams({ page, size });
    if (search) params.append('search', search);
    if (levelId) params.append('levelId', levelId);
    
    // Ghi chú: Dùng đúng path /exam/attempts theo backend của bạn
    const res = await fetch(`${BASE_URL}/exam/attempts?${params.toString()}`, { headers: getHeaders() });
    return handleResponse(res);
  },
  getExamById: async (id) => {
    const res = await fetch(`${BASE_URL}/exam/attempts/${id}`, { headers: getHeaders() });
    return handleResponse(res);
  },
  createExam: async (data) => {
    const res = await fetch(`${BASE_URL}/exam/attempts`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) });
    return handleResponse(res);
  },
  updateExam: async (id, data) => {
    const res = await fetch(`${BASE_URL}/exam/attempts/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(data) });
    return handleResponse(res);
  },
  deleteExam: async (id) => {
    const res = await fetch(`${BASE_URL}/exam/attempts/${id}`, { method: 'DELETE', headers: getHeaders() });
    return handleResponse(res);
  },

  // ================= QUẢN LÝ CÂU HỎI (QUESTION GROUPS) =================
  getQuestionGroupsBySection: async (sectionId) => {
    const res = await fetch(`${BASE_URL}/exam/group/sections/${sectionId}/question-groups`, { headers: getHeaders() });
    return handleResponse(res);
  },
  createQuestionGroup: async (sectionId, data) => {
    const res = await fetch(`${BASE_URL}/exam/group/sections/${sectionId}/question-groups`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) });
    return handleResponse(res);
  },
  updateQuestionGroup: async (groupId, data) => {
    const res = await fetch(`${BASE_URL}/exam/group/question-groups/${groupId}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(data) });
    return handleResponse(res);
  },
  deleteQuestionGroup: async (groupId) => {
    const res = await fetch(`${BASE_URL}/exam/group/question-groups/${groupId}`, { method: 'DELETE', headers: getHeaders() });
    return handleResponse(res);
  },

  // ================= QUẢN LÝ ĐA PHƯƠNG TIỆN (AUDIO & IMAGE UPLOAD) =================
  uploadAudio: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('token');
    
    const res = await fetch(`http://localhost:8080/api/v1/audios/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }, 
      body: formData
    });
    return handleResponse(res);
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('token');
    
    const res = await fetch(`http://localhost:8080/api/v1/images/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    return handleResponse(res);
  },

  // ================= QUẢN LÝ CÂU HỎI CON CHI TIẾT (SUB-QUESTIONS) =================
  getQuestionsByGroup: async (groupId) => {
    // Lưu ý: Path bám sát @RequestMapping("/api/v1/admin/") của sếp
    const res = await fetch(`${BASE_URL}/question-groups/${groupId}/questions`, { headers: getHeaders() });
    return handleResponse(res);
  },
  addQuestionToGroup: async (groupId, data) => {
    const res = await fetch(`${BASE_URL}/question-groups/${groupId}/questions`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) });
    return handleResponse(res);
  },
  updateQuestion: async (questionId, data) => {
    const res = await fetch(`${BASE_URL}/questions/${questionId}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(data) });
    return handleResponse(res);
  },
  deleteQuestion: async (questionId) => {
    const res = await fetch(`${BASE_URL}/questions/${questionId}`, { method: 'DELETE', headers: getHeaders() });
    return handleResponse(res);
  },

  // ================= QUẢN LÝ LỘ TRÌNH GAMIFICATION (STATIONS) =================
  getStations: async (search = '', levelId = '', itemType = '', page = 0, size = 15) => {
    const params = new URLSearchParams({ page, size });
    if (search) params.append('search', search);
    if (levelId) params.append('levelId', levelId);
    if (itemType) params.append('itemType', itemType);
    
    const res = await fetch(`${BASE_URL}/station?${params.toString()}`, { headers: getHeaders() });
    return handleResponse(res);
  },
  getStationById: async (id) => {
    const res = await fetch(`${BASE_URL}/station/${id}`, { headers: getHeaders() });
    return handleResponse(res);
  },
  createStation: async (data) => {
    const res = await fetch(`${BASE_URL}/station`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) });
    return handleResponse(res);
  },
  updateStation: async (id, data) => {
    const res = await fetch(`${BASE_URL}/station/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(data) });
    return handleResponse(res);
  },
  deleteStation: async (id) => {
    const res = await fetch(`${BASE_URL}/station/${id}`, { method: 'DELETE', headers: getHeaders() });
    return handleResponse(res);
  },
  reorderStations: async (items) => {
    const res = await fetch(`${BASE_URL}/station/reorder`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ items }) });
    return handleResponse(res);
  },

  getCompactDictionary: async (levelId, type) => {
    const endpoint = type === 'KANJI' ? `/kanji/compact?levelId=${levelId}` : `/vocab/compact?levelId=${levelId}`;
    const res = await fetch(`${BASE_URL}${endpoint}`, { headers: getHeaders() });
    return handleResponse(res);
  },
};
