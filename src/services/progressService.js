const BASE_URL = 'http://localhost:8080/api/v1/progress';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

export const progressService = {
  toggleSaveItem: async (itemId, itemType) => {
    const res = await fetch(`${BASE_URL}/toggle`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ itemId, itemType })
    });
    
    if (!res.ok) throw new Error('Không thể cập nhật danh sách ôn tập');
    return await res.json(); 
  },

  getSavedItems: async (type, page = 0, size = 20) => {
    const res = await fetch(`${BASE_URL}/saved-items?type=${type}&page=${page}&size=${size}`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Lỗi tải danh sách đã lưu');
    return await res.json();
  }

  
};