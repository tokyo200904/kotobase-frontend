import { 
  LayoutDashboard, 
  Layers, Book, Bookmark, 
  Type, BookA, BookOpen, 
  Map, FileText, 
  Users, 
  Crown, ReceiptText
} from 'lucide-react';

export const ADMIN_NAV_GROUPS = [
  {
    group: 'Tổng quan',
    items: [
      { id: 'dashboard', path: '/admin', label: 'Dashboard', icon: LayoutDashboard }
    ]
  },
  {
    group: 'Khung chương trình',
    items: [
      { id: 'levels', path: '/admin/levels', label: 'Cấp độ (Levels)', icon: Layers },
      { id: 'lessons', path: '/admin/lessons', label: 'Bài học (Lessons)', icon: Book },
      { id: 'topics', path: '/admin/topics', label: 'Chủ đề (Topics)', icon: Bookmark },
    ]
  },
  {
    group: 'Nội dung cốt lõi',
    items: [
      { id: 'kanji', path: '/admin/kanji', label: 'Hán tự (Kanji)', icon: Type },
      { id: 'vocab', path: '/admin/vocab', label: 'Từ vựng (Vocab)', icon: BookA },
      { id: 'grammar', path: '/admin/grammar', label: 'Ngữ pháp (Grammar)', icon: BookOpen },
    ]
  },
  {
    group: 'Gamification & Thi thử',
    items: [
      { id: 'roadmap', path: '/admin/roadmap', label: 'Trạm học (Roadmap)', icon: Map },
      { id: 'exams', path: '/admin/exams', label: 'Đề thi JLPT', icon: FileText },
    ]
  },
  {
    group: 'Khách hàng & Tài chính',
    items: [
      { id: 'users', path: '/admin/users', label: 'Người dùng', icon: Users },
      { id: 'premium', path: '/admin/premium', label: 'Gói cước Premium', icon: Crown },
      { id: 'transactions', path: '/admin/transactions', label: 'Giao dịch', icon: ReceiptText },
    ]
  }
];