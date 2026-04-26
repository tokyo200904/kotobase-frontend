const BASE_URL = 'http://localhost:8080/api/v1';

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
    try {
      const response = await fetch(`${BASE_URL}/kanji/${id}`);
      if (!response.ok) throw new Error('Lỗi tải chi tiết Kanji');
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
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