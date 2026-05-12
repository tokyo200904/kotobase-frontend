import { BookOpen, Library, Sigma, BarChart2, Sword } from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'kanji', label: 'Kanji', path: '/kanji', icon: Sigma },
  { id: 'vocab', label: 'Từ vựng', path: '/vocabulary', icon: Library },
  { id: 'grammar', label: 'Ngữ pháp', path: '/grammar', icon: BookOpen },
  { id: 'exam', label: 'Thi thử JLPT', path: '/exam', icon: Sword },
  { id: 'stats', label: 'Thống kê học tập', path: '/statistics', icon: BarChart2 },
];

export const THEME_COLORS = ['blue', 'green', 'rose', 'orange'];