import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sword, ChevronRight } from 'lucide-react';
import { grammarService } from '../../services/grammarService'; 
import { LEVEL_META } from '../../constants/vocabulary';

export const ExamLevelsPage = () => {
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
    <div className="custom-scrollbar h-[calc(100vh-6rem)] w-full overflow-y-auto pr-2 md:pr-4">
      <div className="mx-auto max-w-6xl space-y-8 pb-10 pt-2">
        
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4 dark:border-gray-800">
          <div className="rounded-xl bg-primary/10 p-2 text-primary dark:bg-primary/20">
            <Sword size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lộ trình Thi thử JLPT</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Chọn cấp độ để bắt đầu thử thách năng lực</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            [1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-3xl bg-gray-100 dark:bg-gray-800" />
            ))
          ) : (
            levels.map((level) => {
              const meta = LEVEL_META[level.level] || { title: 'Cấp độ', desc: 'Luyện thi JLPT' };
              return (
                <Link
                  key={level.id}
                  to={`/exam/level/${level.id}`}
                  className="group relative flex items-center gap-5 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gray-900 text-2xl font-black text-white group-hover:bg-primary dark:bg-black">
                    {level.level}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{meta.title}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{meta.desc}</p>
                  </div>
                  <ChevronRight className="text-gray-300 group-hover:text-primary" />
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};