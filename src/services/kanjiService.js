const BASE_URL = 'http://localhost:8080/api/v1';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

export const kanjiService = {
  getKanjiListByLevel: async (level) => {
    try {
      const response = await fetch(`${BASE_URL}/kanji?level=${level}`);
      if (!response.ok) throw new Error('Lỗi tải danh sách Kanji');
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

getKanjiDetail: async (id) => {
    const response = await fetch(`${BASE_URL}/kanji/${id}`, {
      method: 'GET',
      headers: getHeaders() 
    });
    
    if (!response.ok) {
      throw new Error('Lỗi tải chi tiết Kanji');
    }
    return await response.json();
  },

  searchKanji: async (keyword) => {
    try {
      const response = await fetch(`${BASE_URL}/kanji/search?keyword=${encodeURIComponent(keyword)}`);
      if (!response.ok) throw new Error('Lỗi khi tìm kiếm Kanji');
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }
};