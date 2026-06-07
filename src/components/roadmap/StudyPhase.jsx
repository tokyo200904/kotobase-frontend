import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Eye, CheckCircle2, PlayCircle, Quote, Sparkles } from 'lucide-react';
import { AudioButton } from '../common/AudioButton';
import { KanjiStrokeWriter } from '../kanji/KanjiStrokeWriter';
export const StudyPhase = ({ stationData, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false); 

  const { itemType, items } = stationData;
  const currentItem = items[currentIndex];
  const isLastCard = currentIndex === items.length - 1;

  const mainText = itemType === 'KANJI' ? currentItem.characters : currentItem.word;

  const handleNext = () => {
    if (isLastCard) {
      onComplete(); 
    } else {
      setIsRevealed(false); 
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsRevealed(false);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center py-8 animate-fade-in">
      
      <div className="mb-8 flex w-full items-center justify-between px-4">
        <span className="text-sm font-black uppercase tracking-widest text-gray-400">
          Thẻ {currentIndex + 1} / {items.length}
        </span>
        <div className="flex gap-1">
          {items.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2.5 w-8 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'bg-primary w-12' : idx < currentIndex ? 'bg-primary/40' : 'bg-gray-200 dark:bg-gray-800'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="relative w-full px-4 perspective-1000">
        <div 
          className={`relative flex min-h-[450px] w-full flex-col items-center overflow-hidden rounded-[2.5rem] border-2 border-gray-100 bg-white p-8 shadow-[0_12px_0_rgb(241,245,249)] transition-all duration-500 dark:border-gray-800 dark:bg-gray-900 dark:shadow-[0_12px_0_rgb(15,23,42)] ${
            isRevealed ? 'border-primary/30 shadow-[0_12px_0_rgb(37,99,235,0.2)]' : ''
          }`}
        >
          <div className="flex flex-1 flex-col items-center justify-center w-full">
            <span className="text-[6rem] font-black leading-none text-gray-900 dark:text-white drop-shadow-sm">
              {mainText}
            </span>
            
            {itemType === 'VOCAB' && (
              <div className="mt-4">
                <AudioButton text={mainText} size={28} />
              </div>
            )}
          </div>

          {isRevealed ? (
            <div className="w-full animate-fade-in mt-6 border-t-2 border-dashed border-gray-100 pt-6 dark:border-gray-800">
              
              {itemType === 'KANJI' && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-wrap items-end justify-center gap-3">
                    <span className="text-2xl font-black text-primary uppercase">[{currentItem.han}]</span>
                    <span className="text-xl font-bold text-gray-700 dark:text-gray-300 capitalize">- {currentItem.meaning}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-red-50 p-3 dark:bg-red-900/20 text-center">
                      <span className="text-xs font-bold uppercase text-red-500 block mb-1">On (Âm Hán)</span>
                      <p className="font-bold text-gray-900 dark:text-white">{currentItem.on?.map(o => o.reading).join('、') || '-'}</p>
                    </div>
                    <div className="rounded-xl bg-blue-50 p-3 dark:bg-blue-900/20 text-center">
                      <span className="text-xs font-bold uppercase text-blue-500 block mb-1">Kun (Âm Nhật)</span>
                      <p className="font-bold text-gray-900 dark:text-white">{currentItem.kun?.map(k => k.reading).join('、') || '-'}</p>
                    </div>
                  </div>

                  <div className="flex justify-center mt-2">
                    <div className="scale-75 origin-top"><KanjiStrokeWriter character={currentItem.characters} /></div>
                  </div>
                </div>
              )}

              {itemType === 'VOCAB' && (
                <div className="flex flex-col items-center text-center gap-4">
                  <div>
                    <span className="text-3xl font-black text-primary">{currentItem.reading}</span>
                    <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">{currentItem.romaji}</p>
                  </div>
                  <div className="rounded-2xl bg-primary/10 px-6 py-3 w-full border border-primary/20">
                    <span className="text-xl font-bold text-gray-800 dark:text-gray-200 capitalize">{currentItem.meaning}</span>
                  </div>
                </div>
              )}

              {currentItem.examples && currentItem.examples.length > 0 && (
                <div className="mt-6 rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/50 text-left w-full border border-gray-100 dark:border-gray-800">
                  <span className="flex items-center gap-1 text-xs font-bold uppercase text-gray-500 mb-2"><Quote size={14}/> Ví dụ ứng dụng:</span>
                  <p className="font-bold text-gray-900 dark:text-white text-lg">{currentItem.examples[0].content}</p>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">{currentItem.examples[0].meaning}</p>
                  <div className="mt-2"><AudioButton text={currentItem.examples[0].content} size={18} /></div>
                </div>
              )}

            </div>
          ) : (
            <button 
              onClick={() => setIsRevealed(true)}
              className="mt-8 flex items-center justify-center gap-2 rounded-2xl w-full bg-gray-100 py-4 text-sm font-black uppercase tracking-widest text-gray-500 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 active:scale-95"
            >
              <Eye size={20} /> Chạm để xem nghĩa
            </button>
          )}
        </div>
      </div>

      <div className="mt-10 flex w-full max-w-sm items-center justify-between px-4 gap-4">
        <button 
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm border-2 border-gray-100 text-gray-500 transition-all hover:bg-gray-50 active:translate-y-1 disabled:opacity-30 dark:bg-gray-900 dark:border-gray-800 dark:hover:bg-gray-800"
        >
          <ChevronLeft size={28} strokeWidth={3} />
        </button>

        {isRevealed && (
          <button 
            onClick={handleNext}
            className={`flex-1 flex h-14 items-center justify-center gap-2 rounded-2xl border-2 transition-all active:translate-y-1 ${
              isLastCard 
                ? 'bg-yellow-400 border-yellow-400 text-white shadow-[0_6px_0_#d97706] hover:brightness-110 active:shadow-[0_0px_0_#d97706]' 
                : 'bg-primary border-primary text-white shadow-[0_6px_0_rgb(37,99,235)] hover:brightness-110 active:shadow-[0_0px_0_rgb(37,99,235)]'
            }`}
          >
            {isLastCard ? (
              <><Sparkles size={22} fill="currentColor"/> <span>Chuyển sang Thi</span></>
            ) : (
              <><span className="text-lg font-black uppercase">Tiếp tục</span> <ChevronRight size={24} strokeWidth={3} /></>
            )}
          </button>
        )}
      </div>

    </div>
  );
};