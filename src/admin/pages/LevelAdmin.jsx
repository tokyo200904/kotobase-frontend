import React, { useState, useEffect } from 'react';
import { Layers, Loader2, Book, Bookmark, Trophy, ChevronRight } from 'lucide-react';
import { adminService } from '../../services/adminService';

export const LevelAdmin = () => {
  const [levels, setLevels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLevels = async () => {
      setIsLoading(true);
      try {
        const res = await adminService.getCompactLevels();
        // Sắp xếp tự động N5 -> N1 dựa theo tên nếu backend trả về lộn xộn
        const sortedLevels = (res.data || res || []).sort((a, b) => b.levelName.localeCompare(a.levelName));
        setLevels(sortedLevels);
      } catch (err) {
        console.error('Lỗi tải Cấp độ:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLevels();
  }, []);

  // Hàm tiện ích tạo màu sắc đặc trưng cho từng cấp độ JLPT
  const getLevelStyle = (levelName) => {
    switch (levelName) {
      case 'N5': return { bg: 'bg-blue-500', lightBg: 'bg-blue-50', text: 'text-blue-600', shadow: 'shadow-blue-500/20', border: 'border-blue-100' };
      case 'N4': return { bg: 'bg-green-500', lightBg: 'bg-green-50', text: 'text-green-600', shadow: 'shadow-green-500/20', border: 'border-green-100' };
      case 'N3': return { bg: 'bg-orange-500', lightBg: 'bg-orange-50', text: 'text-orange-600', shadow: 'shadow-orange-500/20', border: 'border-orange-100' };
      case 'N2': return { bg: 'bg-purple-500', lightBg: 'bg-purple-50', text: 'text-purple-600', shadow: 'shadow-purple-500/20', border: 'border-purple-100' };
      case 'N1': return { bg: 'bg-red-500', lightBg: 'bg-red-50', text: 'text-red-600', shadow: 'shadow-red-500/20', border: 'border-red-100' };
      default: return { bg: 'bg-gray-500', lightBg: 'bg-gray-50', text: 'text-gray-600', shadow: 'shadow-gray-500/20', border: 'border-gray-100' };
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* HEADER PAGE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="relative z-10 flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
            <Layers size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Hệ thống Cấp độ</h1>
            <p className="text-sm font-bold text-gray-400 mt-1">Danh mục gốc định hình cấu trúc toàn bộ nội dung học tập</p>
          </div>
        </div>
      </div>

      {/* DANH SÁCH CÁC THẺ LEVEL */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 size={40} className="animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {levels.map((level) => {
            const style = getLevelStyle(level.levelName);
            
            return (
              <div 
                key={level.id}
                className={`group relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-gray-900 border-2 ${style.border} dark:border-gray-800 p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${style.shadow}`}
              >
                {/* Background Pattern trang trí */}
                <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full ${style.lightBg} opacity-50 dark:opacity-5 transition-transform group-hover:scale-150`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${style.bg} text-white font-black text-3xl shadow-lg`}>
                      {level.levelName}
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                      <Trophy size={16} strokeWidth={2.5} />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1">Định danh CSDL</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">Level ID: #{level.id}</p>
                    </div>
                    
                    <div className={`h-px w-full bg-gray-100 dark:bg-gray-800`}></div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Book size={16} className={style.text} strokeWidth={2.5} />
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Bài học</span>
                      </div>
                      {/* Dữ liệu bài học giả định (Có thể map với lessonCount từ Backend sau) */}
                      <span className={`text-sm font-black ${style.text}`}>
                        {level.lessonCount !== undefined ? level.lessonCount : '---'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bookmark size={16} className={style.text} strokeWidth={2.5} />
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Chủ đề</span>
                      </div>
                      <span className={`text-sm font-black ${style.text}`}>
                        {level.topicCount !== undefined ? level.topicCount : '---'}
                      </span>
                    </div>
                  </div>

                  <div className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl ${style.lightBg} py-3 text-sm font-black ${style.text} opacity-0 transition-all group-hover:opacity-100 dark:bg-gray-800/50`}>
                    Xem chi tiết <ChevronRight size={16} strokeWidth={3} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* THÔNG BÁO BẢO MẬT */}
      <div className="rounded-2xl bg-gray-50 p-6 border border-gray-200 dark:bg-gray-900/50 dark:border-gray-800 flex items-start gap-4">
        <div className="h-10 w-10 shrink-0 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
          <Layers size={20} strokeWidth={2.5} />
        </div>
        <div>
          <h4 className="text-sm font-black text-gray-900 dark:text-white">Dữ liệu Hệ thống tĩnh (Static Data)</h4>
          <p className="text-sm font-medium text-gray-500 mt-1 leading-relaxed">
            Các cấp độ JLPT từ N5 đến N1 được nạp mặc định từ Cơ sở dữ liệu và không thể thêm/xóa/sửa từ giao diện để đảm bảo tính toàn vẹn của hệ thống. 
            Mọi cấu trúc Bài học (Lessons) và Chủ đề (Topics) đều được liên kết chặt chẽ với các thẻ định danh này.
          </p>
        </div>
      </div>

    </div>
  );
};