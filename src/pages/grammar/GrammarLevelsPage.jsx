import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Network, ChevronRight } from 'lucide-react';
import { grammarService } from '../../services/grammarService';
import { LEVEL_META } from '../../constants/vocabulary'; 
import { NotationTable } from '../../components/grammar/NotationTable';

export const GrammarLevelsPage = () => {
  const [levels, setLevels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLevels = async () => {
      const data = await grammarService.getLevels();
      setLevels(data);
      setIsLoading(false);
    };
    fetchLevels();
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <NotationTable />

      <div className="flex items-center gap-3 border-b border-gray-100 pb-4 dark:border-gray-800">
        <div className="rounded-xl bg-indigo-100 p-2 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
          <Network size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lộ trình Ngữ pháp</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Chinh phục cấu trúc từ cơ bản đến nâng cao</p>
        </div>
      </div>

      <div className="relative pl-4 md:pl-0">
        <div className="absolute bottom-0 left-8 top-0 w-1 bg-gray-100 dark:bg-gray-800 md:left-12"></div>

        <div className="space-y-8">
          {isLoading ? (
            [1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="relative flex items-center gap-6 md:gap-8">
                <div className="z-10 h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700 md:h-14 md:w-14 md:translate-x-[21px]"></div>
                <div className="h-28 w-full animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800"></div>
              </div>
            ))
          ) : (
            levels.map((level, index) => {
              const meta = LEVEL_META[level.level] || { title: 'Đang cập nhật', desc: '' };
              
              return (
                <Link
                  key={level.id}
                  to={`/grammar/level/${level.id}`}
                  className="group relative flex items-center gap-6 md:gap-8"
                >
                  <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white bg-indigo-100 text-indigo-600 shadow-sm transition-transform duration-300 group-hover:scale-125 group-hover:bg-indigo-600 group-hover:text-white dark:border-gray-950 dark:bg-indigo-900/50 dark:text-indigo-400 dark:group-hover:bg-indigo-500 md:h-14 md:w-14 md:translate-x-[21px]">
                    <span className="text-sm font-black md:text-lg">{level.level}</span>
                  </div>

                  <div className="flex-1 overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-800/50">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                          {level.level} - {meta.title}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {meta.desc}
                        </p>
                      </div>
                      
                      <div className="flex shrink-0 items-center gap-2 rounded-xl bg-gray-50 px-4 py-2 font-semibold text-gray-500 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:bg-gray-800 dark:text-gray-400 dark:group-hover:bg-indigo-900/30 dark:group-hover:text-indigo-400">
                        <span>Vào học</span>
                        <ChevronRight size={18} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};