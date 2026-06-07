import { getHeaders } from './authService';

const BASE_URL = 'http://localhost:8080/api/v1/roadmaps';

export const roadmapService = {
  // 1. Lấy danh sách trạm (Đã làm ở Dashboard)
  getRoadmapStations: async (levelId, type) => {
    const res = await fetch(`${BASE_URL}?levelId=${levelId}&type=${type}`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Không thể tải lộ trình học');
    return await res.json();
  },

  // 2. Lấy chi tiết các từ/Kanji trong 1 trạm
  getStationItems: async (stationId) => {
    const res = await fetch(`${BASE_URL}/stations/${stationId}/items`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Không thể tải dữ liệu bài học');
    return await res.json(); // Trả về { itemType: "KANJI" | "VOCAB", items: [...] }
  },

  // 3. Nộp bài Test
  submitStationTest: async (stationId, payload) => {
    const res = await fetch(`${BASE_URL}/stations/${stationId}/submit-test`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Lỗi khi nộp bài');
    return await res.json(); // Trả về { score, isPassed, message... }
  },

  // 4. Xác nhận hoàn thành và mở khóa trạm tiếp theo
  completeStation: async (stationId) => {
    const res = await fetch(`${BASE_URL}/stations/${stationId}/complete`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Lỗi khi mở khóa trạm mới');
    return await res.json();
  }
};