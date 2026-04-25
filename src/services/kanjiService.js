const BASE_URL = 'http://localhost:8080/api/v1';

export const kanjiService = {
  // Lấy danh sách Kanji theo Level
  getKanjiListByLevel: async (level) => {
    try {
      const response = await fetch(`${BASE_URL}/kanji?level=${level}`);
      if (!response.ok) throw new Error('Lỗi khi tải danh sách Kanji');
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  // Lấy chi tiết một chữ Kanji bằng ID
  getKanjiDetail: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/kanji/${id}`);
      if (!response.ok) throw new Error('Lỗi khi tải chi tiết Kanji');
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  }
};