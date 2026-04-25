import React from 'react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 bg-white py-4 text-center text-sm text-gray-500 transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
      <p>© {new Date().getFullYear()} KotoBase. Nền tảng học tiếng Nhật thông minh.</p>
    </footer>
  );
};