import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { X, CheckCircle2, XCircle, Trophy, Flame, Loader2, ArrowLeft, Target } from 'lucide-react';
import { studyService } from '../../services/studyService';

export const QuizPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'KANJI';
  const totalDue = parseInt(searchParams.get('total')) || 1;

  const [question, setQuestion] = useState(null); 
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isExtraMode, setIsExtraMode] = useState(false);

  const extraQuestionsRef = useRef([]); 
  const extraCurrentIndexRef = useRef(0);

  const [selectedId, setSelectedId] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempted, setTotalAttempted] = useState(0);
  
  const [displayTimer, setDisplayTimer] = useState(0); 
  const questionStartTimeRef = useRef(null); 
  const uiTimerIntervalRef = useRef(null);
  const finalTimeSpentSecondsRef = useRef(0);

  const startQuestionTimer = () => {
    questionStartTimeRef.current = Date.now();
    finalTimeSpentSecondsRef.current = 0;
    setDisplayTimer(0);

    if (uiTimerIntervalRef.current) clearInterval(uiTimerIntervalRef.current);
    uiTimerIntervalRef.current = setInterval(() => {
      setDisplayTimer((prev) => prev + 1);
    }, 1000);
  };

  const stopQuestionTimer = () => {
    if (uiTimerIntervalRef.current) clearInterval(uiTimerIntervalRef.current);
    if (questionStartTimeRef.current) {
      const elapsedMs = Date.now() - questionStartTimeRef.current;
      const elapsedSeconds = Math.max(1, Math.round(elapsedMs / 1000));
      finalTimeSpentSecondsRef.current = elapsedSeconds;
    }
  };

  const fetchQuestion = async () => {
    setIsLoading(true);
    setSelectedId(null);
    setIsLocked(false);

    try {
      if (isExtraMode) {

        const currentIndex = extraCurrentIndexRef.current;
        const totalExtraQuestions = extraQuestionsRef.current.length;

        if (totalExtraQuestions === 0 && currentIndex === 0) {
          const data = await studyService.getExtraPractice(type);
          
          if (data && data.length > 0) {
            extraQuestionsRef.current = data; 
            setQuestion(data[0]);
            setIsLoading(false);
            startQuestionTimer();
          } else {
            setIsFinished(true);
          }
        } 
        else if (currentIndex < totalExtraQuestions) {
          setQuestion(extraQuestionsRef.current[currentIndex]);
          setIsLoading(false);
          startQuestionTimer();
        } 
        else {
          setIsFinished(true);
          setQuestion(null);
        }
      } else {

        const data = await studyService.getNextQuestion(type);
        
        if (!data || data.isDone === true || !data.questionText) {
          setIsFinished(true);
          setQuestion(null);
        } else {
          setQuestion(data);
          setIsLoading(false);
          startQuestionTimer();
        }
      }
    } catch (error) {
      console.error("Lỗi khi nạp thẻ câu hỏi:", error);
      setIsFinished(true);
    }
  };

  useEffect(() => {
    fetchQuestion();
    return () => {
      if (uiTimerIntervalRef.current) clearInterval(uiTimerIntervalRef.current);
    };
  }, [isExtraMode]);

  const handleSelect = (optionId) => {
    if (isLocked) return;
    stopQuestionTimer();
    setSelectedId(optionId);
    setIsLocked(true);
  };

  const handleNext = async () => {
    if (!question) return;
    
    const isCorrect = Number(selectedId) === Number(question.targetItemId);
    const secondsSpent = finalTimeSpentSecondsRef.current;

    setTotalAttempted((prev) => prev + 1);
    if (isCorrect) setCorrectCount((prev) => prev + 1);

    try {
      if (isExtraMode) {
        await studyService.submitExtraPractice(question.progressId, isCorrect, secondsSpent);
        extraCurrentIndexRef.current += 1;
      } else {
        await studyService.submitAnswer(question.progressId, isCorrect, secondsSpent);
      }
    } catch (error) {
      console.error("Lỗi submit API:", error);
    }

    fetchQuestion();
  };

  const sessionAccuracy = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;

  if (isFinished) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 text-center dark:bg-gray-950 p-6 animate-fade-in">
        <div className="relative mb-6">
          <div className="absolute inset-0 animate-ping rounded-full bg-yellow-400 opacity-20"></div>
          <Trophy size={110} className="relative text-yellow-400 drop-shadow-2xl animate-bounce" />
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 dark:text-white md:text-4xl">
          {isExtraMode ? 'Hoàn thành phần Luyện tập thêm!' : 'Tuyệt vời! Bạn đã hoàn thành xuất sắc mục tiêu hôm nay!'}
        </h1>
        <p className="mt-4 max-w-md text-sm font-medium text-gray-500 dark:text-gray-400">
          {isExtraMode 
            ? 'Bạn đã giải quyết gọn gàng các câu hỏi bổ sung để gia cố chuỗi ngày học. Giờ hãy nghỉ ngơi nhé!' 
            : 'Não bộ của bạn đã ghi nhớ thêm được rất nhiều kiến thức mới. Hãy nghỉ ngơi hoặc tiếp tục luyện tập nhé!'}
        </p>

        <div className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-primary/10 px-5 py-2.5 font-black text-primary">
          <Target size={18} /> Độ chính xác phiên học: {sessionAccuracy}%
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 w-full max-w-xs">
          {!isExtraMode && (
            <button 
              onClick={() => { 
                setIsFinished(false); 
                setIsExtraMode(true); 
                setTotalAttempted(0); 
                setCorrectCount(0); 
                extraQuestionsRef.current = []; 
                extraCurrentIndexRef.current = 0; 
              }}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 py-4.5 text-base font-black text-white shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Flame size={20} /> Luyện tập ngẫu nhiên để giữ chuỗi
            </button>
          )}
          
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full rounded-2xl border border-gray-200 bg-white py-4 text-sm font-bold text-gray-600 transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
          >
            ⬅️ Quay lại Bảng điều khiển
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col bg-gray-50 font-sans dark:bg-gray-950 select-none overflow-hidden">
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .animate-shake { animation: shake 0.35s ease-in-out; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <header className="flex h-20 shrink-0 items-center justify-between px-8 bg-white dark:bg-gray-900 border-b dark:border-gray-800 z-10">
        <button onClick={() => navigate('/dashboard')} className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
          <X size={26} strokeWidth={3} />
        </button>
        
        <div className="mx-auto flex w-full max-w-md flex-col items-center gap-1.5 px-4">
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
            {isExtraMode 
              ? `⚡ LUYỆN TẬP THÊM: ${extraCurrentIndexRef.current + 1} / ${extraQuestionsRef.current.length}` 
              : `TIẾN ĐỘ: ${totalAttempted} / ${totalDue}`}
          </span>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div 
              className="h-full rounded-full bg-green-500 transition-all duration-500 ease-out" 
              style={{ 
                width: `${isExtraMode 
                  ? ((extraCurrentIndexRef.current) / extraQuestionsRef.current.length) * 100 
                  : (totalAttempted / totalDue) * 100}%` 
              }}
            ></div>
          </div>
        </div>
        
        <div className="text-sm font-bold font-mono text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg border dark:border-gray-700">
          {displayTimer}s
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 pb-28 overflow-y-auto custom-scrollbar">
        {isLoading || !question ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={44} className="animate-spin text-primary" />
            <p className="text-xs font-black text-gray-400 tracking-widest uppercase animate-pulse">Đang nạp dữ liệu...</p>
          </div>
        ) : (
          <div className="w-full max-w-2xl animate-fade-in">
            
            <div className="relative mb-8 flex aspect-[16/10] w-full flex-col items-center justify-center rounded-[2.5rem] bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.06)] dark:bg-gray-900 border border-gray-100/70 dark:border-gray-800">
              <div className="absolute left-8 top-8 rounded-xl bg-gray-100 px-3.5 py-1.5 text-xs font-black uppercase tracking-widest text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                {isExtraMode ? '⚡ LUYỆN TẬP THÊM' : (question.itemType === 'KANJI' ? '🈴 KANJI' : '📚 TỪ VỰNG')}
              </div>
              <h1 className="text-7xl font-black text-gray-900 dark:text-white md:text-8xl tracking-tight">
                {question.questionText}
              </h1>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {question.options?.map((opt) => {
                const isSelected = Number(selectedId) === Number(opt.id);
                const isCorrect = Number(opt.id) === Number(question.targetItemId);
                
                let btnStyle = "border-2 border-gray-100 bg-white hover:border-primary/50 hover:bg-primary/5 dark:bg-gray-900 dark:border-gray-800 dark:hover:border-primary/50 cursor-pointer text-gray-800 dark:text-gray-200";
                
                if (isLocked) {
                  if (isCorrect) {
                    btnStyle = "bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/20 scale-[1.02] pointer-events-none";
                  } else if (isSelected && !isCorrect) {
                    btnStyle = "bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20 animate-shake pointer-events-none";
                  } else {
                    btnStyle = "opacity-30 border-gray-200 dark:opacity-10 pointer-events-none";
                  }
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(opt.id)}
                    disabled={isLocked}
                    className={`flex min-h-[5.5rem] items-center justify-between rounded-2xl px-6 py-4 text-base font-bold transition-all duration-300 ${btnStyle}`}
                  >
                    <span className="flex-1 pr-2">{opt.text}</span>
                    {isLocked && isCorrect && <CheckCircle2 size={22} className="shrink-0 text-white" />}
                    {isLocked && isSelected && !isCorrect && <XCircle size={22} className="shrink-0 text-white" />}
                  </button>
                );
              })}
            </div>

          </div>
        )}
      </main>

      <div className={`fixed bottom-0 left-0 right-0 flex justify-center bg-white p-6 dark:bg-gray-900 border-t dark:border-gray-800 transition-transform duration-500 ease-out shadow-[0_-15px_40px_rgba(0,0,0,0.04)] ${isLocked ? 'translate-y-0' : 'translate-y-full'}`}>
        <button
          onClick={handleNext}
          className={`flex w-full max-w-xl items-center justify-center gap-2 rounded-2xl py-4.5 text-lg font-black text-white transition-all hover:brightness-110 active:scale-98 shadow-xl cursor-pointer ${
            Number(selectedId) === Number(question?.targetItemId) ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          Câu tiếp theo
        </button>
      </div>

    </div>
  );
};