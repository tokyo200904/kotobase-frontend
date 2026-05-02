import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BookType } from "lucide-react";
import { grammarService } from "../../services/grammarService";

import { GrammarAccordion } from "../../components/grammar/GrammarAccordion";

export const GrammarLessonsPage = () => {
  const { levelId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      setIsLoading(true);
      try {
        const data = await grammarService.getLessonsByLevel(levelId);

        if (Array.isArray(data)) {
          setLessons(data);
        } else if (data && Array.isArray(data.data)) {
          setLessons(data.data);
        } else {
          setLessons([]);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách bài học:", error);
        setLessons([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLessons();
  }, [levelId]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center gap-4 border-b border-gray-100 pb-4 dark:border-gray-800">
        <Link
          to="/grammar"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
            <BookType className="text-primary" />
             Danh sách Bài học Ngữ pháp
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Cấp độ #{levelId} • Chọn một bài học để xem các cấu trúc
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
        ) : lessons?.length > 0 ? (
          lessons.map((lesson) => (
            <GrammarAccordion
              key={lesson?.id || Math.random()}
              lesson={lesson}
            />
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
