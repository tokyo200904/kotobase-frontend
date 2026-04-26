import { create } from 'zustand';


export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null, // Sẽ chứa thông tin như { name: 'Nam', avatar: '...' }

  login: (userData) => set({ 
    isAuthenticated: true, 
    user: userData 
  }),

  logout: () => set({ 
    isAuthenticated: false, 
    user: null 
  }),
}));