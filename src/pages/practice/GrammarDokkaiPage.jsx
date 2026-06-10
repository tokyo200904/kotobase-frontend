import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, Lightbulb, Loader2, RefreshCw, Check, HelpCircle, CornerDownLeft } from 'lucide-react';
import { practiceService } from '../../services/practiceService';


const QuestionItem = ({ question, index }) => {
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  

  const [slotStatuses, setSlotStatuses] = useState([]); 
  
  const [status, setStatus] = useState('idle'); 
  const [showHint, setShowHint] = useState(false);
  const [isAllCorrect, setIsAllCorrect] = useState(false); 

  const resetQuestion = () => {
    const shuffled = [...question.answers].sort(() => Math.random() - 0.5);
    setShuffledAnswers(shuffled);
    setSelectedWords([]);
    setSlotStatuses(new Array(question.answers.length).fill(null)); 
    setStatus('idle');
    setIsAllCorrect(false);
    setShowHint(false);
  };

  useEffect(() => {
    resetQuestion();
  }, [question]);

  const sentenceParts = question.content.split('___');

  const pickWord = (word, wordIdx) => {
    if (status === 'checked') return; 
    setSelectedWords([...selectedWords, word]);
    setShuffledAnswers(shuffledAnswers.filter((_, i) => i !== wordIdx));
  };

  const returnWord = (word, wordIdx) => {
    if (status === 'checked') return; 
    setShuffledAnswers([...shuffledAnswers, word]);
    setSelectedWords(selectedWords.filter((_, i) => i !== wordIdx));
  };

  const handleCheck = () => {
    const newSlotStatuses = selectedWords.map((word, idx) => {
      return word.correctOrder === idx + 1 ? 'correct' : 'incorrect';
    });
    
    setSlotStatuses(newSlotStatuses);
    setStatus('checked');

    const allCorrect = newSlotStatuses.length === question.answers.length && 
                      newSlotStatuses.every(s => s === 'correct');
    setIsAllCorrect(allCorrect);
  };

  return (
    <div className={`p-6 md:p-8 rounded-[2rem] border-2 transition-all duration-300 shadow-sm ${
      isAllCorrect ? 'border-green-200 bg-green-50/30 dark:border-green-900 dark:bg-green-900/10' : 
      (status === 'checked' && !isAllCorrect) ? 'border-orange-100 bg-white dark:border-gray-800' :
      'border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900'
    }`}>
      
      <div className="flex items-start gap-4 mb-8">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600 font-black text-sm dark:bg-purple-900/50 dark:text-purple-400 mt-1">
          {index + 1}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-y-3.5 text-xl font-bold text-gray-900 dark:text-white leading-loose">
            {sentenceParts.map((part, pIdx) => (
              <React.Fragment key={pIdx}>
                <span className="whitespace-pre-wrap">{part}</span>
                
                {pIdx < sentenceParts.length - 1 && (
                  <button
                    onClick={() => selectedWords[pIdx] && returnWord(selectedWords[pIdx], pIdx)}
                    disabled={status === 'checked'} // Đã check ko cho gỡ từ
                    className={`min-w-[88px] h-11 mx-1.5 px-4 flex items-center justify-center rounded-lg border-b-4 transition-all duration-300 active:translate-y-0.5 ease-out
                      ${selectedWords[pIdx] 
                        ? (status === 'checked' 
                            ? (slotStatuses[pIdx] === 'correct'
                                ? 'bg-green-500 border-green-700 text-white shadow-md' // Ô ĐÚNG: XANH LÁ
                                : 'bg-red-500 border-red-700 text-white shadow-md') // Ô SAI: ĐỎ
                            : 'bg-purple-50 border-purple-500 text-purple-700 hover:brightness-95 dark:bg-purple-900/40 dark:text-purple-300') // Ô đang làm: Tím
                        : 'bg-gray-50 border-gray-200 border-dashed dark:bg-gray-800 dark:border-gray-700'}`}
                  >
                    {selectedWords[pIdx] ? selectedWords[pIdx].content : ''}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3.5 mb-8 pl-12">
        {shuffledAnswers.map((word, wIdx) => (
          <button
            key={wIdx}
            onClick={() => pickWord(word, wIdx)}
            disabled={status === 'checked'}
            className="px-5 py-3 rounded-xl bg-white border-2 border-gray-100 shadow-[0_4px_0_rgb(241,245,249)] font-bold text-lg text-gray-700 hover:border-purple-300 hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all disabled:opacity-0 disabled:scale-95 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:shadow-[0_4px_0_rgb(30,41,59)] cursor-pointer disabled:cursor-not-allowed"
          >
            {word.content}
          </button>
        ))}
        {shuffledAnswers.length === 0 && status === 'idle' && (
          <div className="animate-fade-in flex items-center gap-2 text-sm font-medium text-gray-400 italic py-3 bg-gray-50 px-4 rounded-xl dark:bg-gray-800/50">
            <CornerDownLeft size={16} /> Bấm nút Kiểm tra để xem kết quả!
          </div>
        )}
      </div>

      {showHint && (
        <div className="mb-6 ml-12 animate-fade-in rounded-xl bg-yellow-50 border border-yellow-200 p-5 text-sm font-medium text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400">
          <span className="font-bold uppercase tracking-widest text-[10px] opacity-70 block mb-1.5">Gợi ý dịch nghĩa</span>
          {question.explanation}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pl-12 pt-6 border-t border-gray-100 dark:border-gray-800">
        
        <div className="flex-1">
          {status === 'checked' && (
            isAllCorrect ? (
              <div className="flex items-center gap-2.5 text-green-600 font-black animate-fade-in"><CheckCircle2 size={22} /> Chính xác! Quá xuất sắc!</div>
            ) : (
              <div className="flex items-center gap-2.5 text-orange-600 font-bold animate-fade-in"><XCircle size={22} /> Có ô chưa đúng. Hãy bấm Làm lại để sửa nhé!</div>
            )
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
          <button 
            onClick={() => setShowHint(!showHint)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-yellow-600 bg-yellow-50 hover:bg-yellow-100 transition-colors dark:bg-yellow-900/20 dark:text-yellow-500"
          >
            <HelpCircle size={18} /> Gợi ý
          </button>

          <button 
            onClick={resetQuestion}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors dark:bg-gray-800 dark:text-gray-300"
          >
            <RefreshCw size={18} /> Làm lại
          </button>

          <button 
            onClick={handleCheck}
            disabled={selectedWords.length !== question.answers.length || status === 'checked'}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black text-white bg-purple-600 hover:brightness-110 disabled:opacity-50 disabled:grayscale transition-all shadow-[0_4px_0_rgb(126,34,206)] active:translate-y-1 active:shadow-none"
          >
            <Check size={18} strokeWidth={3} /> Kiểm tra
          </button>
        </div>

      </div>
    </div>
  );
};


export const GrammarDokkaiPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const grammarId = searchParams.get('grammarId');

  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await practiceService.getGrammarDokkai(grammarId);
        setQuestions(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [grammarId]);

  if (isLoading) return <div className="flex h-screen items-center justify-center bg-[#f8fafc] dark:bg-gray-950"><Loader2 className="animate-spin text-purple-600" size={40} /></div>;
  if (!questions.length) return <div className="flex h-screen items-center justify-center font-bold text-gray-400 bg-[#f8fafc] dark:bg-gray-950">Không có bài tập nối câu.</div>;

  return (
    <div className="custom-scrollbar flex h-[calc(100vh-6rem)] w-full flex-col items-center overflow-y-auto bg-[#f8fafc] dark:bg-gray-950 p-4 md:p-8">
      

<div className="w-full max-w-4xl flex items-center justify-between mb-8 z-10 py-4 px-2">        <button 
          onClick={() => navigate(-1)} 
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-gray-200 shadow-sm text-gray-600 hover:bg-gray-50 active:scale-95 transition-all dark:bg-gray-900 dark:border-gray-800"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="text-center">
          <h1 className="font-black text-xl md:text-2xl uppercase tracking-widest text-purple-600 dark:text-purple-400">
            Bài tập Sắp xếp câu
          </h1>
          <p className="text-xs font-bold text-gray-400 mt-1">Hoàn thành {questions.length} câu bên dưới</p>
        </div>
        <div className="w-12"></div>
      </div>

      <div className="w-full max-w-4xl flex flex-col gap-8 pb-12 animate-fade-in">
        {questions.map((q, idx) => (
          <QuestionItem key={idx} question={q} index={idx} />
        ))}

        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate(-1)}
            className="px-8 py-4 rounded-2xl bg-gray-900 text-white font-black hover:bg-black shadow-[0_6px_0_rgb(0,0,0)] active:translate-y-1.5 active:shadow-none transition-all dark:bg-gray-800 dark:shadow-[0_6px_0_rgb(31,41,55)]"
          >
            Hoàn tất & Quay lại bài học
          </button>
        </div>
      </div>
      
    </div>
  );
};