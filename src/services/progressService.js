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
  }
};