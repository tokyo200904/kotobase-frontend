import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Sword, ChevronRight, Sparkles } from 'lucide-react';
import { grammarService } from '../../services/grammarService'; 
import { LEVEL_META } from '../../constants/vocabulary';

export const ExamLevelsPage = () => {
  const [levels, setLevels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const data = await grammarService.getLevels();
        setLevels(data);
      } catch (error) {
        console.error("Lỗi lấy danh sách cấp độ thi:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLevels();
  }, []);

  return (
    <div className="custom-scrollbar h-[calc(100vh-6rem)] w-full overflow-y-auto pr-2 md:pr-4 bg-[#f8fafc] dark:bg-gray-950">
      <div className="mx-auto max-w-6xl space-y-10 pb-12 pt-6 animate-fade-in">
        
        <div className="flex flex-col items-start gap-4 border-b border-gray-100 pb-8 dark:border-gray-800 md:flex-row md:items-center">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.25rem] bg-primary/10 text-primary dark:bg-primary/20">
            <Sword size={32} strokeWidth={2.5} />
            <Sparkles size={16} className="absolute -right-2 -top-2 animate-pulse text-yellow-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white md:text-2xl">
              thi thử JLPT
            </h1>
            <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              Chinh phục các bộ đề chuẩn cấu trúc thi thật. Dành riêng cho thành viên Premium.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            [1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex h-48 flex-col justify-between rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="flex justify-between">
                  <div className="h-16 w-16 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800"></div>
                  <div className="h-8 w-8 animate-pulse rounded-full bg-gray-50 dark:bg-gray-800"></div>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="h-5 w-1/2 animate-pulse rounded-md bg-gray-100 dark:bg-gray-800"></div>
                  <div className="h-4 w-3/4 animate-pulse rounded-md bg-gray-50 dark:bg-gray-800"></div>
                </div>
              </div>
            ))
          ) : (
            levels.map((level) => {
              const meta = LEVEL_META[level.level] || { title: 'Cấp độ', desc: 'Luyện thi JLPT' };
              return (
                <button
                  key={level.id}
                  onClick={() => navigate(`/exam/level/${level.id}`)}
                  className="group relative flex w-full flex-col justify-between overflow-hidden rounded-[2rem] border border-gray-100 bg-white p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl font-black text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/30">
                      {level.level}
                    </div>
                    
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition-colors group-hover:bg-primary/10 group-hover:text-primary dark:bg-gray-800">
                      <ChevronRight size={20} strokeWidth={2.5} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-xl font-black text-gray-900 transition-colors group-hover:text-primary dark:text-white">
                      {meta.title}
                    </h2>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-2">
                      {meta.desc}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};