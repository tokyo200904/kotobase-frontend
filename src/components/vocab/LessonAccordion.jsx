import React, { useState, useEffect } from 'react';
import { ChevronDown, Layers, Hash } from 'lucide-react'; 
import { Link } from 'react-router-dom';
import { vocabService } from '../../services/vocabService';

export const LessonAccordion = ({ lesson }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && topics.length === 0) {
      const fetchTopics = async () => {
        setIsLoading(true);
        const data = await vocabService.getTopicsByLesson(lesson.id);
        setTopics(data);
        setIsLoading(false);
      };
      fetchTopics();
    }
  }, [isOpen, lesson.id, topics.length]);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all dark:border-gray-800 dark:bg-gray-900">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between bg-gray-50/50 p-5 transition-colors hover:bg-gray-50 dark:bg-gray-900/50 dark:hover:bg-gray-800"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Layers size={20} />
          </div>
          <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
            {lesson.title}
          </span>
        </div>
        <ChevronDown 
          size={20} 
          className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <div 
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-gray-50 p-4 dark:border-gray-800">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[1, 2].map((i) => (
                <div key={i} className="h-14 rounded-2xl bg-gray-100 animate-pulse dark:bg-gray-800"></div>
              ))}
            </div>
          ) : topics.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {topics.map((topic) => (
                <Link
                  key={topic.id}
                  to={`/vocabulary/topic/${topic.id}`}
                  className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-3 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-md dark:border-gray-800 dark:bg-gray-900/50 dark:hover:border-primary"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary dark:bg-gray-800 dark:text-gray-500">
                    <Hash size={18} />
                  </div>
                  
                  <span className="font-semibold text-gray-700 transition-colors group-hover:text-primary dark:text-gray-300">
                    {topic.name}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500">Chưa có chủ đề nào.</p>
          )}
        </div>
      </div>
    </div>
  );
};