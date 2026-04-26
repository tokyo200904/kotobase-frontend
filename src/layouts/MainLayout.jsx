import React, { useState } from 'react';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { Footer } from '../components/common/Footer';
import { SettingsModal } from '../components/common/SettingsModal';
import { useTheme } from '../hooks/useTheme';

export const MainLayout = ({ children }) => {
  const themeProps = useTheme(); 
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // Quản lý Modal

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950 transition-colors duration-300">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar onOpenSettings={() => setIsSettingsOpen(true)} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl animate-fade-in">
            {children}
          </div>
        </main>
      </div>

      <Footer />

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        {...themeProps} 
      />
    </div>
  );
};