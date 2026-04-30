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
      const data = await vocabService.getLessonsByLevel(levelId);
      setLessons(data);
      setIsLoading(false);
    };
    fetchLessons();
  }, [levelId]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          to="/vocabulary"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Danh sách Bài học</h1>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          [1, 2, 3].map((i) => <div key={i} className="h-20 rounded-2xl bg-gray-100 animate-pulse dark:bg-gray-800"></div>)
        ) : (
          lessons.map((lesson) => (
            <LessonAccordion key={lesson.id} lesson={lesson} />
          ))
        )}
      </div>
    </div>
  );
};