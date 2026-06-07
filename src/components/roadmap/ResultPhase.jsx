import React from 'react';
import { Award, Frown, MoveRight, RotateCcw } from 'lucide-react';

/**
 * @component ResultPhase
 * @description Component hiển thị kết quả sau khi nộp bài Test.
 * Tuân thủ SoC: Chỉ nhận Props (testResult) từ Nhạc Trưởng, không chứa logic gọi API.
 */
export const ResultPhase = ({ testResult, onRetry, onBackToMap }) => {
  const { 
    isPassed = false, 
    message = "Đã có lỗi xảy ra.", 
    score = 0, 
    correctCount = 0, 
    totalQuestions = 0 
  } = testResult || {};

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center justify-center py-12 px-4 animate-fade-in">
      
      {isPassed ? (
        <div className="flex flex-col items-center text-center w-full animate-fade-in">
          <div className="relative mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-yellow-100 text-yellow-500 shadow-xl shadow-yellow-500/20 dark:bg-yellow-500/20">
            <div className="absolute inset-0 animate-ping rounded-full bg-yellow-400 opacity-20"></div>
            <Award size={64} strokeWidth={2} className="relative z-10" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-wide">
            Qua ải thành công!
          </h1>
          <p className="text-gray-500 font-medium mb-8">
            {message}
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center w-full animate-fade-in">
          <div className="relative mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-red-100 text-red-500 shadow-xl shadow-red-500/20 dark:bg-red-500/20">
            <Frown size={64} strokeWidth={2} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-wide">
            Cố gắng thêm chút nhé!
          </h1>
          <p className="text-gray-500 font-medium mb-8">
            {message}
          </p>
        </div>
      )}

      <div className="w-full rounded-3xl border-2 border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 mb-8 flex justify-around">
        <div className="text-center">
          <span className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Điểm số</span>
          <span className={`text-3xl font-black ${isPassed ? 'text-green-500' : 'text-red-500'}`}>
            {score}
          </span>
        </div>
        
        <div className="w-px bg-gray-100 dark:bg-gray-800"></div>
        
        <div className="text-center">
          <span className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Số câu đúng</span>
          <span className="text-3xl font-black text-blue-500">
            {correctCount}
            <span className="text-lg text-gray-400">/{totalQuestions}</span>
          </span>
        </div>
      </div>

      {isPassed ? (
        <button 
          onClick={onBackToMap} 
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-lg font-black text-white shadow-[0_6px_0_rgb(37,99,235)] transition-all active:translate-y-1.5 active:shadow-none"
        >
          Trở về Bản đồ <MoveRight size={20} strokeWidth={3} />
        </button>
      ) : (
        <div className="flex w-full flex-col gap-4">
          <button 
            onClick={onRetry} 
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-8 py-4 text-lg font-black text-white shadow-[0_6px_0_#000] transition-all active:translate-y-1.5 active:shadow-none dark:bg-gray-700 dark:shadow-[0_6px_0_#374151]"
          >
            <RotateCcw size={20} strokeWidth={3} /> Học lại từ đầu
          </button>
          <button 
            onClick={onBackToMap} 
            className="text-sm font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            Thoát ra bản đồ
          </button>
        </div>
      )}

    </div>
  );
};