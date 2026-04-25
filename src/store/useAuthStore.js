import { create } from 'zustand';

/**
 * useAuthStore: Quản lý trạng thái xác thực người dùng.
 * Luồng dữ liệu: Bất kỳ component nào (Header, Trang bảo mật) cũng có thể 
 * gọi hook này để lấy thông tin user hoặc thực hiện login/logout mà không cần re-render toàn app.
 */
export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null, // Sẽ chứa thông tin như { name: 'Nam', avatar: '...' }

  // Action: Xử lý đăng nhập (Thực tế sẽ gọi API ở đây hoặc gọi API ở service rồi truyền data vào đây)
  login: (userData) => set({ 
    isAuthenticated: true, 
    user: userData 
  }),

  // Action: Xử lý đăng xuất
  logout: () => set({ 
    isAuthenticated: false, 
    user: null 
  }),
}));