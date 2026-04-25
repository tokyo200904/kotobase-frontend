import { useState, useEffect } from 'react';

// Bảng màu để map
// Bạn copy nguyên đoạn này để lên đầu file src/hooks/useTheme.js
const THEME_DICTIONARY = {
  blue: { main: '#2563eb', hover: '#1d4ed8' },
  green: { main: '#16a34a', hover: '#15803d' },
  rose: { main: '#e11d48', hover: '#be123c' },
  orange: { main: '#ea580c', hover: '#c2410c' }
};

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('blue');

  useEffect(() => {
    // Khôi phục Dark Mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Khôi phục Màu chủ đạo
    const savedColor = localStorage.getItem('primaryColor') || 'blue';
    changePrimaryColor(savedColor);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newMode;
    });
  };

const changePrimaryColor = (colorKey) => {
    setPrimaryColor(colorKey);
    const root = document.documentElement;
    
    if (THEME_DICTIONARY[colorKey]) {
      // Ghi đè trực tiếp vào biến CSS gốc
      root.style.setProperty('--theme-primary', THEME_DICTIONARY[colorKey].main);
      root.style.setProperty('--theme-primary-hover', THEME_DICTIONARY[colorKey].hover);
      localStorage.setItem('primaryColor', colorKey);
    }
  };

  return { isDarkMode, toggleDarkMode, primaryColor, changePrimaryColor };
};