import React, { useState, useEffect } from 'react';
import { ChevronDown, Layers, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { grammarService } from '../../services/grammarService';
import { ChevronRight } from "lucide-react";
export const GrammarAccordion = ({ lesson }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [titles, setTitles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && titles.length === 0) {
      const fetchTitles = async () => {
        setIsLoading(true);
        const data = await grammarService.getGrammarsByLesson(lesson.id);
        setTitles(data);
        setIsLoading(false);
      };
      fetchTitles();
    }
  }, [isOpen, lesson.id, titles.length]);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all dark:border-gray-800 dark:bg-gray-900">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between bg-gray-50/50 p-5 transition-colors hover:bg-gray-50 dark:bg-gray-900/50 dark:hover:bg-gray-800"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
            <Layers size={20} />
          </div>
          <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
            {lesson.title}
          </span>
        </div>
        <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="border-t border-gray-50 p-4 dark:border-gray-800">
          <Link
            to={`/grammar/lesson/${lesson.id}`}
            className="group flex w-full items-center justify-between rounded-xl bg-indigo-50 p-3 transition-colors hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40"
          >
            <div className="flex items-center gap-3">
              <Target size={18} className="text-indigo-500" />
              <span className="font-bold text-indigo-700 dark:text-indigo-300">
                Vào học {titles.length > 0 ? `${titles.length} cấu trúc` : 'chi tiết bài'}
              </span>
            </div>
            <ChevronRight size={16} className="text-indigo-400 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};