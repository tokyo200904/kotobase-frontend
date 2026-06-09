import { BookOpen, Library, Sigma, BarChart2, Sword, Crown } from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'kanji', label: 'Kanji', path: '/kanji', icon: Sigma },
  { id: 'vocab', label: 'Từ vựng', path: '/vocabulary', icon: Library },
  { id: 'grammar', label: 'Ngữ pháp', path: '/grammar', icon: BookOpen },
  { id: 'exam', label: 'Thi thử JLPT', path: '/exam', icon: Sword },
  { id: 'dashboard', label: 'Thống kê học tập', path: '/dashboard', icon: BarChart2 },
  { id: 'premium', label: 'Nâng cấp Premium', path: '/premium', icon: Crown },
];

export const THEME_COLORS = ['blue', 'green', 'rose', 'orange'];