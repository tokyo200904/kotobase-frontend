import React, { useEffect, useRef } from 'react';
import HanziWriter from 'hanzi-writer';
import { Play } from 'lucide-react';

export const KanjiStrokeWriter = ({ character }) => {
  const containerRef = useRef(null);
  const writerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !character) return;
    containerRef.current.innerHTML = '';

    try {
      writerRef.current = HanziWriter.create(containerRef.current, character, {
        width: 150,
        height: 150,
        padding: 10,
        strokeAnimationSpeed: 1.5,
        delayBetweenStrokes: 200,
        strokeColor: '#2563eb',   
        radicalColor: '#ea580c',  
        outlineColor: 'rgba(156, 163, 175, 0.2)', 
        showCharacter: false,     
        showOutline: true         
      });
    } catch (error) {
      console.error("Lỗi khi tạo hình chữ Hán:", error);
      containerRef.current.innerHTML = `<span class="text-7xl font-bold text-gray-800 dark:text-gray-200">${character}</span>`;
    }

    return () => {
      if (writerRef.current) {
        try { writerRef.current.cancelAnimation(); } catch(e) {}
      }
    };
  }, [character]);

  const handlePlayAnimation = () => {
    if (writerRef.current) {
      writerRef.current.animateCharacter();
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-4 px-4">
      <div 
        ref={containerRef} 
        className="flex h-[180px] w-[180px] items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 shadow-inner transition-colors dark:border-gray-700 dark:bg-gray-800/50"
      />
      
      <button 
        onClick={handlePlayAnimation}
        className="flex w-full max-w-[180px] items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-hover active:scale-95"
      >
        <Play size={18} className="fill-current" />
        <span>Vẽ nét chữ</span>
      </button>
    </div>
  );
};