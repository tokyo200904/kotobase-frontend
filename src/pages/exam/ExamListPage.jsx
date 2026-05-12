import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Timer, FileQuestion, Trophy, Sword, ChevronRight, ArrowLeft } from 'lucide-react';
import { examService } from '../../services/examService';

export const ExamListPage = () => {
  const { levelId } = useParams();
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      setIsLoading(true);
      try {
        const data = await examService.getExamsByLevel(levelId);
        setExams(data.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExams();
  }, [levelId]);

  return (
    <div className="custom-scrollbar h-[calc(100vh-6rem)] w-full overflow-y-auto pr-2 md:pr-4">
      <div className="mx-auto max-w-[1400px] space-y-8 pb-10 pt-2">
        
        <div className="flex items-center gap-4 border-b border-gray-100 pb-4 dark:border-gray-800">
          <Link 
            to="/exam"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
              <Sword className="text-primary" />
              Danh sách Bài thi
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Cấp độ #{levelId} • Vượt qua thử thách, khẳng định trình độ
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading ? (
            [1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="h-[240px] animate-pulse rounded-[2rem] bg-gray-100 dark:bg-gray-800" />
            ))
          ) : exams.map((exam) => (
            <Link
              key={exam.id}
              to={`/exam/start/${exam.id}`}
              className="group relative flex h-[240px] flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-gray-100 bg-white p-5 text-center transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="absolute left-[-150%] top-0 z-0 h-full w-[150%] -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-[200%] group-hover:opacity-100 dark:via-white/5"></div>
              
              <div className="relative z-10 mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-900 text-xl font-black text-white group-hover:bg-primary dark:bg-black transition-colors duration-300">
                {exam.level}
              </div>

              <h2 className="relative z-10 px-2 text-base font-bold text-gray-800 dark:text-white group-hover:text-primary line-clamp-2">
                {exam.title}
              </h2>

              <div className="relative z-10 mt-4 flex items-center justify-center gap-4 text-[11px] font-bold text-gray-400">
                <div className="flex flex-col items-center gap-1">
                  <Timer size={14} className="group-hover:text-primary" />
                  <span>{exam.durationMinutes} Phút</span>
                </div>
                <div className="h-6 w-px bg-gray-100 dark:bg-gray-800"></div>
                <div className="flex flex-col items-center gap-1">
                  <FileQuestion size={14} className="group-hover:text-primary" />
                  <span>{exam.totalQuestions} Câu</span>
                </div>
                <div className="h-6 w-px bg-gray-100 dark:bg-gray-800"></div>
                <div className="flex flex-col items-center gap-1">
                  <Trophy size={14} className="group-hover:text-primary" />
                  <span>{exam.passingScore}đ</span>
                </div>
              </div>

              <div className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-tighter">
                Bắt đầu thử thách <ChevronRight size={12} />
              </div>

              <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-500 group-hover:w-full"></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};