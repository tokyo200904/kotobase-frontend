import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, Lock, Loader2 } from 'lucide-react';
import { examService } from '../../services/examService';

export const ExamReviewPage = () => {
  const { attemptId } = useParams();
  const [details, setDetails] = useState(null);
  const [activeTabId, setActiveTabId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isPremiumUser = false; 

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await examService.getExamResultDetails(attemptId);
        setDetails(data);
        if (data.sections?.length > 0) setActiveTabId(data.sections[0].sectionId);
      } catch (error) {
        alert(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [attemptId]);

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div>;
  if (!details) return null;

  const activeSection = details.sections.find(s => s.sectionId === activeTabId);
  const allQuestionsInSection = activeSection?.questionGroups?.flatMap(g => g.questions || []) || [];

  const scrollToQuestion = (qId) => {
    const element = document.getElementById(`review-q-${qId}`);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="flex h-screen w-full flex-col bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      
      <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 z-10">
        <div className="flex items-center gap-4">
          <Link to={`/exam/result/${attemptId}`} className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-lg font-bold">Chữa bài chi tiết</h1>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          <div className="mx-auto max-w-3xl space-y-10">
            {activeSection?.questionGroups?.map((group) => (
              <div key={group.groupId} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                
                <div className="mb-6 rounded-xl bg-gray-50 p-4 font-semibold dark:bg-gray-800/50">
                  {group.content}
                </div>

                {group.audioUrl && <audio src={group.audioUrl} controls className="mb-6 w-full" />}
                {group.imageUrl && <img src={group.imageUrl} alt="Exam" className="mb-6 rounded-lg border w-full object-contain" />}

                <div className="space-y-8 divide-y divide-gray-100 dark:divide-gray-800">
                  {group.questions?.map((q, qIdx) => (
                    <div key={q.questionId} id={`review-q-${q.questionId}`} className={`pt-8 ${qIdx === 0 ? 'pt-0 border-none' : ''}`}>
                      <p className="font-bold text-lg mb-4">Câu {qIdx + 1}: {q.content}</p>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {q.answers?.map((ans) => {
                          const isCorrectActual = ans.id === q.correctAnswerId;
                          const isUserSelected = ans.id === q.userSelectedAnswerId;
                          const isWrongSelection = isUserSelected && !q.isCorrect;

                          let boxClass = "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/40 text-gray-700 dark:text-gray-300";
                          let icon = null;

                          if (isCorrectActual) {
                            boxClass = "border-green-500 bg-green-50 text-green-800 font-bold ring-1 ring-green-500 dark:bg-green-900/30 dark:text-green-400";
                            icon = <CheckCircle2 size={18} className="text-green-600 dark:text-green-400" />;
                          } else if (isWrongSelection) {
                            boxClass = "border-red-400 bg-red-50 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400";
                            icon = <XCircle size={18} className="text-red-500" />;
                          }

                          return (
                            <div key={ans.id} className={`flex items-center justify-between rounded-xl border p-4 text-sm ${boxClass}`}>
                              <span>{ans.content}</span>
                              {icon}
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-6 relative overflow-hidden rounded-xl bg-blue-50/50 p-5 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                        <h4 className="mb-2 text-sm font-bold text-blue-800 dark:text-blue-400">💡 Lời giải chi tiết:</h4>
                        
                        {isPremiumUser ? (
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{q.explanation}</p>
                        ) : (
                          <div className="relative">
                            <p className="text-sm text-gray-700 blur-[4px] select-none dark:text-gray-300">{q.explanation || "Giải thích ẩn do chưa nâng cấp. Giải thích ẩn do chưa nâng cấp."}</p>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <button className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-lg hover:bg-blue-700">
                                <Lock size={14} /> Nâng cấp Premium
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-80 flex flex-col border-l border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 z-10 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col gap-2 p-4 border-b border-gray-100 dark:border-gray-800">
            {details.sections.map(sec => (
              <button
                key={sec.sectionId}
                onClick={() => setActiveTabId(sec.sectionId)}
                className={`rounded-lg px-4 py-2.5 text-left text-sm font-bold transition-all ${activeTabId === sec.sectionId ? 'bg-primary text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400'}`}
              >
                {sec.sectionName}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">Danh sách câu hỏi</h4>
            <div className="grid grid-cols-5 gap-2.5">
              {allQuestionsInSection.map((q, idx) => {
                let btnClass = "bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:border-gray-700"; 
                
                if (q.userSelectedAnswerId) {
                  if (q.isCorrect) btnClass = "bg-green-100 text-green-700 border-green-300 dark:bg-green-900/40 dark:text-green-400 dark:border-green-800"; 
                  else btnClass = "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/40 dark:text-red-400 dark:border-red-800"; 
                }

                return (
                  <button
                    key={q.questionId}
                    onClick={() => scrollToQuestion(q.questionId)}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border text-xs font-bold transition-transform hover:scale-110 active:scale-95 ${btnClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};