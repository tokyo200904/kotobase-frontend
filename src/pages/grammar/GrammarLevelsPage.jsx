import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, GraduationCap } from "lucide-react";
import { grammarService } from "../../services/grammarService";
import { LEVEL_META } from "../../constants/vocabulary";
import { NotationTable } from "../../components/grammar/NotationTable";

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
    <div className="custom-scrollbar h-[calc(100vh-6rem)] w-full overflow-y-auto pr-2 md:pr-4">
      <div className="mx-auto max-w-5xl space-y-8 pb-10 pt-2">
        <NotationTable />

        <div className="flex items-center justify-between border-b border-gray-100 pb-6 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-primary/20">
              <GraduationCap size={28} />
            </div>
            <div>
              <h1 className="font-['Dancing_Script',_cursive] text-4xl font-bold text-gray-900 dark:text-white">
                Grammar <span className="text-primary">Paths</span>
              </h1>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Đạo của Ngữ pháp - Chọn con đường của bạn
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
          {isLoading
            ? 
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-[280px] w-full animate-pulse rounded-3xl bg-gray-100 dark:bg-gray-800"
                ></div>
              ))
            : levels.map((level) => {
                const meta = LEVEL_META[level.level] || {
                  title: "Cấp độ học",
                  desc: "Đang cập nhật",
                };

                return (
                  <Link
                    key={level.id}
                    to={`/grammar/level/${level.id}`}
                    className="group relative flex h-[260px] flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-gray-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="absolute left-[-150%] top-0 z-0 h-full w-[150%] -skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-[200%] group-hover:opacity-100 dark:via-white/5"></div>

                    <div className="absolute bottom-0 left-0 z-20 h-1.5 w-0 bg-primary transition-all duration-500 ease-out group-hover:w-full"></div>

                    <div className="relative z-10 mb-6 flex h-24 w-24 flex-col items-center justify-center rounded-[20px] bg-gray-900 text-white shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:bg-primary dark:bg-black">
                      <span className="mb-0.5 text-[11px] font-black uppercase tracking-widest opacity-70">
                        Level
                      </span>
                      <span className="text-4xl font-black">{level.level}</span>
                    </div>

                    <div className="relative z-10 flex flex-col items-center transition-transform duration-300 group-hover:-translate-y-3">
                      <h2 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-primary dark:text-white sm:text-2xl">
                        {meta.title}
                      </h2>
                      <p className="mt-2 max-w-[85%] text-sm font-medium text-gray-500 line-clamp-2 dark:text-gray-400">
                        {meta.desc}
                      </p>
                    </div>

                    <div className="absolute bottom-6 z-10 flex translate-y-4 items-center gap-1 text-sm font-bold text-primary opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <span>Khám phá ngay</span>
                      <ChevronRight size={16} className="mt-0.5" />
                    </div>
                  </Link>
                );
              })}
        </div>
      </div>
    </div>
  );
};
