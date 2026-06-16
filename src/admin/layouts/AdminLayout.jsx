import React, { useState } from 'react';
import { Outlet } from 'react-router-dom'; 
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { SettingsModal } from '../../components/common/SettingsModal';
import { useTheme } from '../../hooks/useTheme';
import { AdminSidebar } from '../../components/admin/AdminSidebar';

export const AdminLayout = () => {
  const themeProps = useTheme(); 
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); 

  return (
    // 1. Chặn chiều cao bằng đúng màn hình (h-screen) và không cho cuộn tổng thể (overflow-hidden)
    <div className="flex h-screen flex-col bg-white dark:bg-gray-950 transition-colors duration-300 overflow-hidden">
      
      {/* Header cố định trên cùng */}
      <div className="shrink-0">
        <Header />
      </div>

      {/* 2. Vùng thân chứa Sidebar và Nội dung */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar có thể cuộn độc lập nếu menu quá dài */}
        <AdminSidebar onOpenSettings={() => setIsSettingsOpen(true)} />

        {/* Nội dung chính cuộn độc lập (overflow-y-auto) */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc] dark:bg-gray-950/50">
          {/* Bao bọc nội dung, dùng min-h-full để luôn đẩy Footer xuống dưới cùng nếu nội dung ngắn */}
          <div className="flex flex-col min-h-full">
            <div className="flex-1 p-6 mx-auto w-full max-w-7xl animate-fade-in pb-12">
              <Outlet />
            </div>
            {/* Footer nằm dưới cùng của phần cuộn nội dung */}
            <Footer />
          </div>
        </main>

      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} {...themeProps} />
    </div>
  );
};