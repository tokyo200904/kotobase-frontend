const BASE_URL = 'http://localhost:8080/api/v1/auth';
export const GOOGLE_LOGIN_URL = 'http://localhost:8080/oauth2/authorize/google';

export const authService = {
  login: async (email, password) => {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Email hoặc mật khẩu không chính xác');
    return await response.json(); 
  },

  register: async (email, password, fullname) => {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullname }),
    });
    if (!response.ok) throw new Error('Đăng ký thất bại, email có thể đã tồn tại');
    return await response.json(); 
  },

  getMe: async (token) => {
    const response = await fetch(`${BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    if (!response.ok) throw new Error('Token không hợp lệ hoặc đã hết hạn');
    return await response.json(); 
  }
};