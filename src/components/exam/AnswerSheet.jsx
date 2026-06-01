import React from 'react';
import { useExam } from '../../context/ExamContext';
import { Clock, CheckCircle2 } from 'lucide-react';

export const AnswerSheet = ({ onManualSubmit }) => {
  const { remainingTime, sectionData, savedAnswers, wsStatus } = useExam();

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [
      h > 0 ? String(h).padStart(2, '0') : null,
      String(m).padStart(2, '0'),
      String(s).padStart(2, '0')
    ].filter(Boolean).join(':');
  };

  const allQuestions = sectionData?.questionGroups?.flatMap(g => g.questions || []) || [];
  const completedCount = allQuestions.filter(q => savedAnswers[q.id]).length;

  const scrollToQuestion = (qId) => {
    const element = document.getElementById(`q-${qId}`);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handlePreSubmit = () => {
    if (completedCount < allQuestions.length) {
      const confirmIncomplete = window.confirm(`CẢNH BÁO: Bạn mới làm ${completedCount}/${allQuestions.length} câu. Bạn có chắc chắn muốn nộp phần thi này không?`);
      if (!confirmIncomplete) return;
    } else {
      const confirmComplete = window.confirm("Bạn có chắc chắn muốn nộp phần thi này để chuyển sang phần tiếp theo?");
      if (!confirmComplete) return;
    }
    onManualSubmit(); 
  };

  return (
    <div className="flex h-full flex-col justify-between bg-white p-6 shadow-xl dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800">
      <div className="space-y-6">
        <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-gray-800/80">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Clock size={18} />
            <span className="text-sm font-semibold">Thời gian còn lại</span>
          </div>
          <span className={`text-2xl font-black font-mono tracking-tight ${remainingTime < 60 ? 'text-red-500 animate-pulse' : 'text-gray-900 dark:text-white'}`}>
            {formatTime(remainingTime)}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
          <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Tiến độ làm bài</span>
          <span className="text-sm font-black text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
            {completedCount}/{allQuestions.length} Câu
          </span>
        </div>

        <div className="custom-scrollbar max-h-[calc(100vh-24rem)] overflow-y-auto pr-1">
          <div className="grid grid-cols-5 gap-2.5">
            {allQuestions.map((q, index) => {
              const isAnswered = !!savedAnswers[q.id];
              return (
                <button
                  key={q.id}
                  onClick={() => scrollToQuestion(q.id)}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 ${
                    isAnswered
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <button
        onClick={handlePreSubmit}
        disabled={wsStatus === 'RECONNECTING'}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3.5 text-sm font-bold text-white transition-all hover:bg-black active:scale-98 disabled:opacity-50 shadow-lg cursor-pointer dark:bg-primary dark:hover:bg-primary-hover"
      >
        <CheckCircle2 size={18} />
        Nộp phần thi này
      </button>
    </div>
  );
};