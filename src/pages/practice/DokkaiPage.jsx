import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, Lightbulb, Loader2 } from 'lucide-react';
import { practiceService } from '../../services/practiceService';

export const DokkaiPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const topicId = searchParams.get('topicId');

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDokkai = async () => {
      try {
        const data = await practiceService.getVocabDokkai(topicId);
        setQuestions(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDokkai();
  }, [topicId]);

  const handleSelect = (answer) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      navigate(-1); 
    }
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 size={40} className="animate-spin text-purple-500" /></div>;
  if (!questions.length) return <div className="flex h-screen items-center justify-center font-bold text-gray-400">Không có bài đọc hiểu.</div>;

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="flex h-[calc(100vh-6rem)] w-full flex-col items-center bg-[#f8fafc] dark:bg-gray-950 p-4 md:p-8">
      <div className="w-full max-w-3xl flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-gray-200 text-gray-500 shadow-sm"><ArrowLeft size={20} /></button>
        <div className="flex-1 px-8">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-800">
            <div className="h-full bg-purple-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <div className="font-black text-gray-400">{currentIndex + 1}/{questions.length}</div>
      </div>

      <div className="w-full max-w-3xl flex flex-col flex-1">
        <div className="bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-[2rem] p-8 mb-8 shadow-sm">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-relaxed">
            {currentQ.content}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {currentQ.answers.map((ans, idx) => {
            const isSelected = selectedAnswer === ans;
            const showCorrect = selectedAnswer && ans.isCorrect; 
            const showWrong = isSelected && !ans.isCorrect;

            let btnClass = "bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-400 hover:bg-purple-50 shadow-[0_6px_0_rgb(229,231,235)] active:translate-y-1 active:shadow-none dark:bg-gray-900 dark:border-gray-700";
            let icon = null;

            if (showCorrect) {
              btnClass = "bg-green-50 border-2 border-green-500 text-green-700 shadow-[0_6px_0_rgb(34,197,94)] transform translate-y-1 !shadow-none";
              icon = <CheckCircle2 size={24} className="text-green-500" />;
            } else if (showWrong) {
              btnClass = "bg-red-50 border-2 border-red-500 text-red-700 shadow-[0_6px_0_rgb(239,68,68)] transform translate-y-1 !shadow-none opacity-70";
              icon = <XCircle size={24} className="text-red-500" />;
            }

            return (
              <button
                key={idx}
                disabled={!!selectedAnswer}
                onClick={() => handleSelect(ans)}
                className={`relative flex items-center justify-between p-5 rounded-2xl font-black text-lg transition-all duration-200 ${btnClass}`}
              >
                <span>{ans.content}</span>
                {icon}
              </button>
            );
          })}
        </div>

        {selectedAnswer && (
          <div className="animate-fade-in mt-auto bg-purple-50 border-2 border-purple-200 rounded-[2rem] p-6 dark:bg-purple-900/20 dark:border-purple-800">
            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-black mb-2 uppercase tracking-widest text-sm">
              <Lightbulb size={20} /> Giải thích
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              {currentQ.explanation}
            </p>
            
            <button 
              onClick={handleNext}
              className="mt-6 w-full bg-purple-600 text-white font-black py-4 rounded-2xl shadow-[0_6px_0_rgb(147,51,234)] active:translate-y-1.5 active:shadow-none transition-all"
            >
              {currentIndex < questions.length - 1 ? 'Câu tiếp theo' : 'Hoàn thành'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};