import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Loader2, X, Check, Trophy, RefreshCw, BookX } from 'lucide-react';
import { practiceService } from '../../services/practiceService';

export const FlashcardPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const module = searchParams.get('module'); 
  const level = searchParams.get('level');
  const topicId = searchParams.get('topicId');

  const storageKey = `flashcard_progress_${module}_${level || topicId}`;

  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const [knownCards, setKnownCards] = useState([]);
  const [unknownCards, setUnknownCards] = useState([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [slideDirection, setSlideDirection] = useState(null);

  useEffect(() => {
    const loadInitialCards = async () => {
      setIsLoading(true);
      try {
        const data = module === 'KANJI' 
          ? await practiceService.getKanjiFlashcards(level)
          : await practiceService.getVocabFlashcards(topicId);
        
        setCards(data || []);

        const savedProgress = localStorage.getItem(storageKey);
        if (savedProgress && data && data.length > 0) {
          const { savedIndex, savedKnown, savedUnknown } = JSON.parse(savedProgress);
          // Chỉ phục hồi nếu index chưa vượt quá tổng số từ
          if (savedIndex < data.length) {
            setCurrentIndex(savedIndex);
            setKnownCards(savedKnown || []);
            setUnknownCards(savedUnknown || []);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialCards();
  }, [module, level, topicId, storageKey]);

  useEffect(() => {
    if (cards.length > 0 && !isFinished) {
      const progress = {
        savedIndex: currentIndex,
        savedKnown: knownCards,
        savedUnknown: unknownCards
      };
      localStorage.setItem(storageKey, JSON.stringify(progress));
    }
  }, [currentIndex, knownCards, unknownCards, cards.length, isFinished, storageKey]);

  const handleMark = (isKnown) => {
    const currentCard = cards[currentIndex];
    
    setSlideDirection(isKnown ? 'translate-x-full opacity-0 rotate-12' : '-translate-x-full opacity-0 -rotate-12');

    setTimeout(() => {
      if (isKnown) {
        setKnownCards(prev => [...prev, currentCard]);
      } else {
        setUnknownCards(prev => [...prev, currentCard]);
      }

      if (currentIndex < cards.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setIsFlipped(false);
        setSlideDirection(null); 
      } else {
        setIsFinished(true);
        localStorage.removeItem(storageKey);
      }
    }, 300); 
  };

  const handleRetry = (onlyUnknown = false) => {
    if (onlyUnknown && unknownCards.length > 0) {
      setCards(unknownCards);
    } else {

    }
    
 
    setKnownCards([]);
    setUnknownCards([]);
    setCurrentIndex(0);
    setIsFinished(false);
    setIsFlipped(false);
    setSlideDirection(null);
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950"><Loader2 size={40} className="animate-spin text-primary" /></div>;
  if (!cards.length) return <div className="flex h-screen items-center justify-center font-bold text-gray-400 bg-gray-50 dark:bg-gray-950">Không có dữ liệu thẻ học.</div>;


  if (isFinished) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#f8fafc] dark:bg-gray-950 p-6 text-center animate-fade-in">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-[3rem] p-10 shadow-2xl border border-gray-100 dark:border-gray-800">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100 text-yellow-500 mb-6 shadow-inner">
            <Trophy size={48} className="animate-bounce-short" />
          </div>
          
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Chúc Mừng!</h2>
          <p className="text-gray-500 font-medium mb-8">Bạn đã hoàn thành bộ thẻ {module === 'KANJI' ? `Kanji ${level}` : 'Từ vựng'}.</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-100 dark:border-green-800 rounded-2xl p-4">
              <div className="text-3xl font-black text-green-600 dark:text-green-400">{knownCards.length}</div>
              <div className="text-xs font-bold uppercase tracking-wider text-green-600/70 mt-1">Đã Thuộc</div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-100 dark:border-red-800 rounded-2xl p-4">
              <div className="text-3xl font-black text-red-600 dark:text-red-400">{unknownCards.length}</div>
              <div className="text-xs font-bold uppercase tracking-wider text-red-600/70 mt-1">Chưa Thuộc</div>
            </div>
          </div>

          <div className="space-y-3">
            {unknownCards.length > 0 && (
              <button 
                onClick={() => handleRetry(true)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary text-white font-black py-4 shadow-[0_6px_0_rgb(37,99,235)] active:translate-y-1.5 active:shadow-none transition-all"
              >
                <BookX size={20} /> Ôn Lại Từ Chưa Thuộc
              </button>
            )}
            <button 
              onClick={() => handleRetry(false)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white font-black py-4 border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-200 active:scale-95 transition-all"
            >
              <RefreshCw size={20} /> Học Lại Từ Đầu
            </button>
            <button 
              onClick={() => navigate(-1)}
              className="flex w-full items-center justify-center text-gray-400 hover:text-gray-600 font-bold py-3 mt-2 transition-colors"
            >
              Thoát về danh sách
            </button>
          </div>
        </div>
      </div>
    );
  }


  const currentCard = cards[currentIndex];
  const progress = ((currentIndex) / cards.length) * 100;

  return (
    <div className="flex h-[calc(100vh-6rem)] w-full flex-col items-center bg-[#f8fafc] dark:bg-gray-950 p-6 overflow-hidden">
      
      <div className="w-full max-w-md mb-8 space-y-6 z-10">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-gray-200 text-gray-500 shadow-sm hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-800 active:scale-95">
            <ArrowLeft size={20} />
          </button>
          <div className="text-center">
            <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-wider">
              {module === 'KANJI' ? `Kanji ${level}` : 'Từ Vựng'}
            </h1>
            <p className="text-xs font-bold text-gray-400">{currentIndex + 1} / {cards.length}</p>
          </div>
          <div className="w-12"></div>
        </div>

        <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden dark:bg-gray-800 shadow-inner">
          <div className="h-full bg-blue-500 transition-all duration-500 ease-out rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="relative w-full max-w-md h-[400px] [perspective:1000px] mb-10 z-10">
        <div className={`w-full h-full transition-all duration-300 ease-in-out ${slideDirection || ''}`}>
          
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className={`w-full h-full transition-transform duration-500 [transform-style:preserve-3d] cursor-pointer ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
          >
            <div className="absolute inset-0 [backface-visibility:hidden] flex flex-col items-center justify-center rounded-[2.5rem] bg-white border-2 border-gray-100 shadow-xl dark:bg-gray-900 dark:border-gray-800 p-8 text-center select-none">
              <span className="text-[5rem] md:text-8xl font-black text-gray-900 dark:text-white">
                {module === 'KANJI' ? currentCard.character : currentCard.reading}
              </span>
              <div className="absolute bottom-8 flex flex-col items-center text-gray-300 font-bold text-xs uppercase tracking-widest animate-pulse">
                <RotateCcw size={20} className="mb-2" /> Chạm để xem nghĩa
              </div>
            </div>

            <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col items-center justify-center rounded-[2.5rem] bg-blue-50 border-2 border-blue-200 shadow-xl dark:bg-blue-950/40 dark:border-blue-900 p-8 text-center select-none">
              <span className="text-4xl font-black text-blue-600 dark:text-blue-400 capitalize mb-4 leading-tight">
                {currentCard.meaning}
              </span>
              {module === 'KANJI' && currentCard.han && (
                <span className="inline-block px-4 py-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-sm font-black text-blue-600/70 uppercase tracking-widest">
                  Âm Hán: {currentCard.han}
                </span>
              )}
              
              {module === 'VOCAB' && currentCard.examples?.length > 0 && (
                <div className="mt-8 p-5 bg-white/80 dark:bg-black/20 rounded-2xl w-full border border-blue-100 dark:border-blue-800/50">
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{currentCard.examples[0].content}</p>
                  <p className="text-sm font-medium text-gray-500 mt-2">{currentCard.examples[0].meaning}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md flex justify-center items-center gap-8 z-10">
        <button 
          onClick={() => handleMark(false)}
          disabled={!!slideDirection}
          className="group flex h-20 w-20 flex-col items-center justify-center rounded-full bg-white border-2 border-red-100 text-red-500 shadow-[0_8px_0_rgb(254,226,226)] active:translate-y-2 active:shadow-none transition-all hover:bg-red-50 dark:bg-gray-900 dark:border-red-900/30 dark:shadow-[0_8px_0_rgb(127,29,29)]"
        >
          <X size={32} strokeWidth={3} className="transition-transform group-hover:scale-110" />
        </button>

        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Phân loại</span>

        <button 
          onClick={() => handleMark(true)}
          disabled={!!slideDirection}
          className="group flex h-20 w-20 flex-col items-center justify-center rounded-full bg-white border-2 border-green-100 text-green-500 shadow-[0_8px_0_rgb(220,252,231)] active:translate-y-2 active:shadow-none transition-all hover:bg-green-50 dark:bg-gray-900 dark:border-green-900/30 dark:shadow-[0_8px_0_rgb(20,83,45)]"
        >
          <Check size={32} strokeWidth={4} className="transition-transform group-hover:scale-110" />
        </button>
      </div>

    </div>
  );
};