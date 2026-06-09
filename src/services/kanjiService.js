const BASE_URL = 'http://localhost:8080/api/v1/kanji';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export const kanjiService = {
  getKanjiListByLevel: async (level) => {
    const res = await fetch(`${BASE_URL}?level=${level}`, { 
      method: 'GET',
      headers: getHeaders() 
    });
    
    if (res.status === 401) throw new Error('Vui lòng đăng nhập để xem dữ liệu này');
    if (!res.ok) throw new Error('Lỗi tải danh sách Kanji');
    
    return await res.json();
  },

getKanjiDetail: async (id) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'GET',
      headers: getHeaders() 
    });
    
    if (!response.ok) {
      throw new Error('Lỗi tải chi tiết Kanji');
    }
    return await response.json();
  },

searchKanji: async (keyword) => {
    const res = await fetch(`${BASE_URL}/search?keyword=${keyword}`, { 
      method: 'GET',
      headers: getHeaders() 
    });
    
    if (!res.ok) throw new Error('Lỗi tìm kiếm Kanji');
    return await res.json();
  },
};