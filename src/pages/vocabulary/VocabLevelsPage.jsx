import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight } from 'lucide-react';
import { vocabService } from '../../services/vocabService';
import { LEVEL_META } from '../../constants/vocabulary';

export const VocabLevelsPage = () => {
  const [levels, setLevels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLevels = async () => {
      const data = await vocabService.getLevels();
      setLevels(data);
      setIsLoading(false);
    };
    fetchLevels();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-primary/10 p-2 text-primary">
          <BookOpen size={24} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Từ vựng theo cấp độ</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          [1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-40 rounded-2xl bg-gray-100 animate-pulse dark:bg-gray-800"></div>
          ))
        ) : (
          levels.map((level) => {
            const meta = LEVEL_META[level.level] || { title: 'Đang cập nhật', desc: '', color: 'gray' };
            
            return (
              <Link
                key={level.id}
                to={`/vocabulary/level/${level.id}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150"></div>
                
                <div className="relative z-10">
                  <div className="flex items-end gap-3">
                    <h2 className="text-5xl font-black text-primary">{level.level}</h2>
                    <span className="mb-1 text-lg font-bold text-gray-700 dark:text-gray-200">
                      - {meta.title}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {meta.desc}
                  </p>
                </div>

                <div className="relative z-10 mt-6 flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary transition-colors group-hover:text-primary-hover">
                    Bắt đầu học
                  </span>
                  <div className="rounded-full bg-gray-50 p-2 text-gray-400 transition-colors group-hover:bg-primary group-hover:text-white dark:bg-gray-800 dark:text-gray-500">
                    <ChevronRight size={16} />
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};