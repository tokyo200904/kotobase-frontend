import React from 'react';
import { X, Moon, Sun } from 'lucide-react';
import { THEME_COLORS } from '../../constants/navigation';

export const SettingsModal = ({ isOpen, onClose, isDarkMode, toggleDarkMode, primaryColor, changePrimaryColor }) => {
  // Nếu isOpen = false, không render gì cả (Tiết kiệm hiệu năng)
  if (!isOpen) return null;

  return (
    // Lớp phủ đen mờ (Backdrop)
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
      
      {/* Khung Modal */}
      <div className="relative w-full max-w-md scale-100 rounded-2xl bg-white p-6 shadow-2xl transition-transform duration-300 dark:bg-gray-900 border dark:border-gray-800">
        
        {/* Nút đóng */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <X size={20} />
        </button>

        <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">Cài đặt giao diện</h2>

        {/* Cài đặt Sáng/Tối */}
        <div className="mb-6 flex items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Chế độ tối</span>
          <button 
            onClick={toggleDarkMode}
            className="flex h-8 w-14 items-center rounded-full bg-gray-200 p-1 transition-colors dark:bg-gray-700"
          >
            <div className={`flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-300 ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`}>
              {isDarkMode ? <Moon size={14} className="text-slate-700" /> : <Sun size={14} className="text-yellow-500" />}
            </div>
          </button>
        </div>

        {/* Cài đặt Màu chủ đạo */}
        <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
          <span className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-200">Màu chủ đạo</span>
          <div className="flex gap-4">
            {THEME_COLORS.map((color) => {
              // Bảng màu tĩnh để render UI nút chọn
              const colorHexMap = { blue: '#2563eb', green: '#16a34a', rose: '#e11d48', orange: '#ea580c' };
              
              return (
                <button
                  key={color}
                  onClick={() => changePrimaryColor(color)}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all hover:scale-110 ${
                    primaryColor === color ? 'border-gray-900 scale-110 dark:border-white' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: colorHexMap[color] }}
                  aria-label={`Chọn màu ${color}`}
                >
                  {/* Dấu chấm nhỏ cho màu đang được chọn */}
                  {primaryColor === color && <span className="h-2 w-2 rounded-full bg-white"></span>}
                </button>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  );
};