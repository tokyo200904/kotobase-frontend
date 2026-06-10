import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, Trophy, Loader2, PlayCircle } from 'lucide-react';
import { practiceService } from '../../services/practiceService';

export const QuizPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const module = searchParams.get('module'); 
  const levelId = searchParams.get('levelId');
  const topicId = searchParams.get('topicId');

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadQuiz();
  }, [module, levelId, topicId]);

  const loadQuiz = async () => {
    setIsLoading(true);
    try {
      const data = module === 'KANJI' 
        ? await practiceService.getKanjiQuiz(levelId)
        : await practiceService.getVocabQuiz(topicId);
      setQuestions(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (answer) => {
    if (selectedAnswer) return; 
    setSelectedAnswer(answer);
    if (answer.isCorrect) setScore(prev => prev + 1);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setIsFinished(true);
      }
    }, 1200); 
  };

  const handleRetry = () => {
    setScore(0);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsFinished(false);
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950"><Loader2 size={40} className="animate-spin text-primary" /></div>;
  if (!questions.length) return <div className="flex h-screen items-center justify-center font-bold text-gray-400">Không có câu hỏi trắc nghiệm.</div>;

  // MÀN HÌNH HOÀN THÀNH
  if (isFinished) {
    const accuracy = Math.round((score / questions.length) * 100);
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#f8fafc] dark:bg-gray-950 p-6 text-center animate-fade-in">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-[3rem] p-10 shadow-2xl border border-gray-100 dark:border-gray-800">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-500 mb-6 shadow-inner">
            <Trophy size={48} className="animate-bounce-short" />
          </div>
          <h2 className="text-3xl font-black mb-2 text-gray-900 dark:text-white">Tuyệt Vời!</h2>
          <p className="text-gray-500 font-bold mb-8">Bạn đã hoàn thành bài Đố Vui.</p>
          
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 mb-8 border border-gray-100 dark:border-gray-800">
            <div className="text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">Độ chính xác</div>
            <div className="text-6xl font-black text-primary mb-2">{accuracy}%</div>
            <div className="text-sm font-bold text-gray-500">Đúng {score} / {questions.length} câu</div>
          </div>

          <div className="space-y-3">
            <button onClick={handleRetry} className="flex w-full items-center justify-center gap-2 bg-primary text-white font-black py-4 rounded-2xl shadow-[0_6px_0_rgb(37,99,235)] active:translate-y-1.5 active:shadow-none transition-all">
              <PlayCircle size={20} /> Chơi Lại Lần Nữa
            </button>
            <button onClick={() => navigate(-1)} className="flex w-full items-center justify-center text-gray-400 hover:text-gray-600 font-bold py-3 transition-colors">
              Thoát về danh sách
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  return (
    <div className="flex h-[calc(100vh-6rem)] w-full flex-col items-center bg-[#f8fafc] dark:bg-gray-950 p-4 md:p-8">
      
      <div className="w-full max-w-3xl flex items-center justify-between mb-8 z-10">
        <button onClick={() => navigate(-1)} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white border border-gray-200 text-gray-500 shadow-sm active:scale-95"><ArrowLeft size={20} /></button>
        <div className="flex-1 px-6 md:px-10">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-800 shadow-inner">
            <div className="h-full bg-green-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <div className="font-black text-gray-400 shrink-0 bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm">{currentIndex + 1}/{questions.length}</div>
      </div>

      <div className="w-full max-w-3xl flex flex-col flex-1 animate-fade-in">
        {/* CÂU HỎI */}
        <div className="bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-[2rem] p-8 md:p-10 mb-8 shadow-sm text-center">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-relaxed">
            {currentQ.content}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto mb-10">
          {currentQ.answers.map((ans, idx) => {
            const isSelected = selectedAnswer === ans;
            const showCorrect = selectedAnswer && ans.isCorrect; 
            const showWrong = isSelected && !ans.isCorrect; 

            let btnClass = "bg-white border-2 border-gray-100 text-gray-700 hover:border-blue-400 hover:bg-blue-50 shadow-[0_6px_0_rgb(241,245,249)] active:translate-y-1.5 active:shadow-none dark:bg-gray-900 dark:border-gray-800 dark:text-white";
            let icon = null;

            if (showCorrect) {
              btnClass = "bg-green-50 border-2 border-green-500 text-green-700 shadow-[0_0px_0_rgb(34,197,94)] transform translate-y-1.5 dark:bg-green-900/30 dark:text-green-400";
              icon = <CheckCircle2 size={24} className="text-green-500" />;
            } else if (showWrong) {
              btnClass = "bg-red-50 border-2 border-red-500 text-red-700 shadow-[0_0px_0_rgb(239,68,68)] transform translate-y-1.5 opacity-80 dark:bg-red-900/30 dark:text-red-400";
              icon = <XCircle size={24} className="text-red-500" />;
            } else if (selectedAnswer) {
              btnClass = "bg-white border-2 border-gray-100 text-gray-400 opacity-40 dark:bg-gray-900 dark:border-gray-800"; 
            }

            return (
              <button
                key={idx}
                disabled={!!selectedAnswer}
                onClick={() => handleSelect(ans)}
                className={`relative flex items-center justify-between p-6 rounded-2xl font-black text-lg transition-all duration-200 ${btnClass} cursor-pointer`}
              >
                <span>{ans.content}</span>
                {icon}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};