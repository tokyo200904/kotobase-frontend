import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookType, LayoutList, BookOpenCheck } from 'lucide-react';
import { grammarService } from '../../services/grammarService';
import { AudioButton } from '../../components/common/AudioButton'; 

export const GrammarListPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [grammarTitles, setGrammarTitles] = useState([]);
  const [isLoadingTitles, setIsLoadingTitles] = useState(true);

  const [activeGrammarId, setActiveGrammarId] = useState(null);
  const [grammarDetail, setGrammarDetail] = useState(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  useEffect(() => {
    const fetchTitles = async () => {
      setIsLoadingTitles(true);
      const data = await grammarService.getGrammarsByLesson(lessonId);
      setGrammarTitles(data);
      if (data.length > 0) {
        setActiveGrammarId(data[0].id);
      }
      setIsLoadingTitles(false);
    };
    fetchTitles();
  }, [lessonId]);

  useEffect(() => {
    if (!activeGrammarId) return;

    const fetchDetail = async () => {
      setIsLoadingDetail(true);
      const data = await grammarService.getGrammarDetail(activeGrammarId);
      setGrammarDetail(data);
      setIsLoadingDetail(false);
    };
    fetchDetail();
  }, [activeGrammarId]);

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col space-y-4">
      <div className="flex items-center gap-4 border-b border-gray-100 pb-4 dark:border-gray-800">
        <button 
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
            <BookType className="text-primary" /> Ngữ pháp Bài {lessonId}
          </h1>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6 overflow-hidden md:flex-row">
        
        <div className="flex h-1/3 flex-col rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 md:h-full md:w-1/3 lg:w-1/4">
          <div className="flex items-center gap-2 border-b border-gray-50 p-4 dark:border-gray-800">
            <LayoutList size={18} className="text-gray-400" />
            <h3 className="font-bold text-gray-700 dark:text-gray-200">Cấu trúc trong bài</h3>
          </div>
          
          <div className="custom-scrollbar flex-1 overflow-y-auto p-2">
            {isLoadingTitles ? (
              [1, 2, 3, 4].map((i) => <div key={i} className="mb-2 h-12 w-full animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800"></div>)
            ) : (
              grammarTitles.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveGrammarId(item.id)}
                  className={`mb-2 flex w-full items-center justify-between rounded-xl p-3 text-left font-semibold transition-all ${
                    activeGrammarId === item.id
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-transparent text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="truncate">{item.title}</span>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="custom-scrollbar flex flex-1 flex-col overflow-y-auto rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {isLoadingDetail || !grammarDetail ? (
            // Skeleton Detail
            <div className="animate-pulse space-y-6">
              <div className="h-10 w-1/2 rounded-xl bg-gray-200 dark:bg-gray-800"></div>
              <div className="h-24 rounded-2xl bg-gray-100 dark:bg-gray-800/50"></div>
              <div className="h-40 rounded-2xl bg-gray-100 dark:bg-gray-800/50"></div>
            </div>
          ) : (
            <div className="animate-fade-in space-y-6">
              
              <div className="border-b border-gray-100 pb-6 dark:border-gray-800">
                <h2 className="mb-4 text-4xl font-black text-gray-900 dark:text-white">
                  {grammarDetail.title}
                </h2>
                <div className="inline-flex rounded-xl bg-primary/10 px-4 py-3">
                  <span className="text-lg font-bold tracking-wide text-primary">
                    <span className="mr-2 opacity-60">Cấu trúc:</span>
                    {grammarDetail.structure}
                  </span>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-2xl bg-orange-50 p-5 dark:bg-orange-950/20">
                  <span className="mb-2 block text-sm font-bold uppercase text-orange-600 dark:text-orange-400">Ý nghĩa</span>
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{grammarDetail.meaning}</p>
                </div>
                <div className="rounded-2xl bg-green-50 p-5 dark:bg-green-950/20">
                  <span className="mb-2 block text-sm font-bold uppercase text-green-600 dark:text-green-400">Cách dùng</span>
                  <p className="font-medium text-gray-800 dark:text-gray-200">{grammarDetail.usages}</p>
                </div>
              </div>

              {grammarDetail.note && (
                <div className="rounded-2xl border border-red-100 bg-red-50 p-5 dark:border-red-900/30 dark:bg-red-950/20">
                  <span className="mb-2 block text-sm font-bold uppercase text-red-600 dark:text-red-400">Chú ý quan trọng</span>
                  <p className="text-gray-800 dark:text-gray-200">{grammarDetail.note}</p>
                </div>
              )}

              <div>
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-gray-200">
                  <BookOpenCheck className="text-primary" size={20} />
                  Ví dụ thực tế ({grammarDetail.examples?.length || 0})
                </h3>
                <div className="space-y-3">
                  {grammarDetail.examples?.map((ex) => (
                    <div key={ex.id} className="flex flex-col gap-2 rounded-xl border border-gray-100 bg-gray-50 p-4 transition-colors hover:border-primary/30 dark:border-gray-800 dark:bg-gray-800/50">
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{ex.content}</p>
                        <AudioButton text={ex.content} size={18} className="shrink-0" />
                      </div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{ex.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};