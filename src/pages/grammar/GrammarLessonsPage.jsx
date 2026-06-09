import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookType, Lock } from 'lucide-react';
import { grammarService } from '../../services/grammarService';
import { GrammarAccordion } from '../../components/grammar/GrammarAccordion';
import { PremiumModal } from '../../components/common/PremiumModal';

export const GrammarLessonsPage = () => {
  const { levelId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  useEffect(() => {
    const fetchLessons = async () => {
      setIsLoading(true);
      try {
        const data = await grammarService.getLessonsByLevel(levelId);
        if (Array.isArray(data)) {
          setLessons(data);
        } else if (data && Array.isArray(data.data)) {
          setLessons(data.data);
        } else {
          setLessons([]);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách bài học:", error);
        setLessons([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLessons();
  }, [levelId]);

  return (
    <div className="custom-scrollbar h-[calc(100vh-6rem)] w-full overflow-y-auto pr-2 md:pr-4 bg-[#f8fafc] dark:bg-gray-950">
      
      <div className="mx-auto max-w-6xl space-y-6 pb-10 pt-2 animate-fade-in">
        
        <div className="flex items-center gap-4 border-b border-gray-100 pb-4 dark:border-gray-800">
          <Link 
            to="/grammar"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
              <BookType className="text-primary" /> 
              Danh sách Bài học Ngữ pháp
            </h1>
            <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
              Cấp độ #{levelId} • 5 Bài đầu miễn phí, mở khóa Premium để học tiếp
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2 lg:gap-6">
          {isLoading ? (
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[82px] w-full rounded-2xl bg-gray-100 animate-pulse dark:bg-gray-800" />
            ))
          ) : lessons?.length > 0 ? (
            lessons.map((lesson) => (
              
              <div key={lesson?.id || Math.random()} className="relative group">
                
                <div className={lesson.isLocked ? "pointer-events-none opacity-40 blur-[1px] transition-all duration-300 group-hover:blur-sm grayscale-[30%]" : ""}>
                  <GrammarAccordion lesson={lesson} />
                </div>

                {lesson.isLocked && (
                  <div
                    onClick={() => setIsPremiumModalOpen(true)}
                    className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center rounded-2xl bg-gray-900/5 transition-all hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10"
                  >
                    <div className="flex items-center gap-2 rounded-xl border border-gray-200/50 bg-white/80 px-4 py-2 text-sm font-bold text-gray-500 shadow-sm backdrop-blur-md transition-all group-hover:scale-105 group-hover:border-yellow-300 group-hover:text-yellow-600 dark:border-gray-700/50 dark:bg-gray-800/80 dark:text-gray-400">
                      <Lock size={16} /> Mở khóa cấu trúc VIP
                    </div>
                  </div>
                )}
                
              </div>

            ))
          ) : (
            <div className="col-span-full py-16 text-center font-bold text-gray-400">
              Chưa có bài học nào cho cấp độ này.
            </div>
          )}
        </div>

      </div>

      <PremiumModal isOpen={isPremiumModalOpen} onClose={() => setIsPremiumModalOpen(false)} />
    </div>
  );
};