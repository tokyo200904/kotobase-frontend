import React, { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react'; 
import { AudioButton } from '../common/AudioButton'; 
import { progressService } from '../../services/progressService'; 
import { useToast } from '../../context/ToastContext';

export const VocabCard = ({ vocab }) => {
  if (!vocab) return null;

  const [isSaved, setIsSaved] = useState(vocab?.saved || false);

  const { addToast } = useToast();
  useEffect(() => {
    setIsSaved(vocab?.saved || false);
  }, [vocab]);

  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation(); 
    const previousState = isSaved;
    setIsSaved(!previousState); 
try {
      const res = await progressService.toggleSaveItem(vocab.id, 'VOCAB');
      
      addToast(res.message, 'success'); 
      
    } catch (error) {
      console.error("Lỗi khi lưu từ vựng:", error);
      setIsSaved(previousState);
      
      addToast('Mất kết nối! Vui lòng thử lại.', 'error'); 
    }
  };

  return (
    <div className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      
      <div className="mb-4 flex items-start justify-between border-b border-gray-50 pb-4 dark:border-gray-800">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {vocab.reading} <span className="ml-1 text-xs opacity-70">({vocab.romaji})</span>
          </p>
          <div className="mt-1 flex items-center gap-2">
            <h3 className="text-4xl font-black text-gray-900 transition-colors group-hover:text-primary dark:text-white">
              {vocab.word}
            </h3>
            <AudioButton text={vocab.word} size={24} />
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 px-3 py-1.5 text-right mt-1">
            <span className="text-sm font-bold text-primary capitalize">{vocab.meaning}</span>
          </div>
          
          <button 
            onClick={handleToggleSave}
            className="rounded-full p-1.5 transition-all hover:bg-gray-100 active:scale-90 dark:hover:bg-gray-800"
            title={isSaved ? "Xóa khỏi danh sách ôn tập" : "Lưu vào danh sách ôn tập"}
          >
            <Bookmark 
              size={24} 
              className={`transition-colors ${isSaved ? 'fill-primary text-primary' : 'text-gray-300 hover:text-gray-600 dark:border-gray-700 dark:text-gray-600 dark:hover:text-gray-300'}`} 
            />
          </button>
        </div>
      </div>

      <div className="flex-1">
        {vocab.examples && vocab.examples.length > 0 ? (
          <div className="space-y-3">
            {vocab.examples.map((ex) => (
              <div key={ex.id} className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-base font-medium text-gray-800 dark:text-gray-200">{ex.content}</p>
                  <AudioButton text={ex.content} size={18} className="shrink-0" />
                </div>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{ex.meaning}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm italic text-gray-400 dark:text-gray-600">Chưa có ví dụ cho từ này.</p>
        )}
      </div>
    </div>
  );
};