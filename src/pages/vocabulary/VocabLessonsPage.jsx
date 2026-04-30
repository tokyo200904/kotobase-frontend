import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { vocabService } from '../../services/vocabService';
import { LessonAccordion } from '../../components/vocab/LessonAccordion';


export const VocabLessonsPage = () => {
  const { levelId } = useParams(); 
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      setIsLoading(true);
      const data = await vocabService.getLessonsByLevel(levelId);
      setLessons(data);
      setIsLoading(false);
    };
    fetchLessons();
  }, [levelId]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      
      {/* Header Điều hướng */}
      <div className="flex items-center gap-4 border-b border-gray-100 pb-4 dark:border-gray-800">
        <Link 
          to="/vocabulary"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
          aria-label="Quay lại danh sách cấp độ"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Danh sách Bài học</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Cấp độ #{levelId} • Chọn một bài học để bắt đầu
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2 lg:gap-6">
        {isLoading ? (
          [1, 2, 3, 4, 5, 6].map((i) => (
            <div 
              key={i} 
              className="h-[82px] w-full rounded-2xl bg-gray-100 animate-pulse dark:bg-gray-800"
            />
          ))
        ) : lessons.length > 0 ? (
          lessons.map((lesson) => (
            <LessonAccordion key={lesson.id} lesson={lesson} />
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-gray-500 dark:text-gray-400">
            Chưa có bài học nào cho cấp độ này.
          </div>
        )}
      </div>

    </div>
  );
};