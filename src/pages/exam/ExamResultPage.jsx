import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Trophy,
  AlertTriangle,
  BookOpen,
  ChevronRight,
  Home,
  Loader2,
  Sparkles,
} from "lucide-react";
import { examService } from "../../services/examService";

export const ExamResultPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await examService.getExamResult(attemptId);
        setResult(data);
      } catch (error) {
        console.error(error);
        alert(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResult();
  }, [attemptId]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!result) return null;

  const isPassed = result.isPassed;

  return (
    <div className="min-h-screen bg-gray-50 py-10 dark:bg-gray-950">
      <div className="mx-auto max-w-4xl px-4 space-y-6">
        <div
          className={`relative overflow-hidden rounded-[2rem] p-10 text-center text-white shadow-xl ${isPassed ? "bg-gradient-to-br from-green-500 to-emerald-700" : "bg-gradient-to-br from-red-500 to-rose-700"}`}
        >
          {isPassed && (
            <Sparkles className="absolute right-10 top-10 h-16 w-16 text-yellow-300 opacity-50 animate-pulse" />
          )}

          <h1 className="text-sm font-black uppercase tracking-[0.3em] opacity-80">
            Kết quả bài thi
          </h1>
          <div className="my-4 text-6xl font-black tracking-widest">
            {isPassed ? "合格" : "不合格"}
          </div>
          <p className="text-lg font-bold">
            {isPassed
              ? "Chúc mừng bạn đã thi đỗ!"
              : "Rất tiếc, bạn chưa vượt qua bài thi này."}
          </p>

          <div className="mt-8 inline-block rounded-2xl bg-white/20 px-8 py-4 backdrop-blur-md">
            <span className="text-5xl font-black">{result.totalScore}</span>
            <span className="text-xl font-bold opacity-70">
              {" "}
              / {result.maxScore}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {result.sections.map((sec) => {
            const isParalyzed = !sec.isPass;
            const percentage = (sec.score / sec.maxScore) * 100;

            return (
              <div
                key={sec.setionId}
                className={`relative flex flex-col justify-between rounded-2xl border bg-white p-6 shadow-sm dark:bg-gray-900 ${isParalyzed ? "border-red-400 bg-red-50/30 dark:border-red-900/50 dark:bg-red-950/20" : "border-gray-100 dark:border-gray-800"}`}
              >
                {isParalyzed && (
                  <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-[10px] font-bold text-red-600 dark:bg-red-900/50 dark:text-red-400">
                    <AlertTriangle size={12} /> Bị điểm liệt
                  </div>
                )}

                <div>
                  <h3 className="font-bold text-gray-900 pr-16 line-clamp-2 dark:text-white">
                    {sec.setionName}
                  </h3>
                  <div className="mt-4 text-3xl font-black text-gray-900 dark:text-white">
                    {sec.score}
                    <span className="text-base font-bold text-gray-400">
                      /{sec.maxScore}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${isParalyzed ? "bg-red-500" : "bg-primary"}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to={`/exam/result/${attemptId}/review`}
            className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-8 py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-black hover:shadow-xl active:scale-95 dark:bg-primary dark:hover:bg-primary-hover"
          >
            <BookOpen size={18} />
            Xem lời giải chi tiết
          </Link>
          <Link
            to="/exam"
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-8 py-4 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Home size={18} />
            Trở về trang chủ thi
          </Link>
        </div>
      </div>
    </div>
  );
};
