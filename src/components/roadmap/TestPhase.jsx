import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, HelpCircle, ArrowRight, Loader2 } from 'lucide-react';

export const TestPhase = ({ stationData, onSubmitTest }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ==========================================================================
  // 1. TẠO BỘ ĐỀ THI NGẪU NHIÊN TỪ DỮ LIỆU CỦA TRẠM
  // ==========================================================================
  useEffect(() => {
    if (!stationData || !stationData.items || stationData.items.length === 0) return;

    const items = stationData.items;
    
    // Đảo lộn thứ tự các câu hỏi
    const shuffledItems = [...items].sort(() => Math.random() - 0.5);

    const generatedQuestions = shuffledItems.map(targetItem => {
      // Lấy 3 đáp án sai (distractors) ngẫu nhiên
      let distractors = items.filter(i => i.id !== targetItem.id);
      distractors = distractors.sort(() => Math.random() - 0.5).slice(0, 3);
      
      // Gộp đáp án đúng và sai, sau đó đảo lộn vị trí
      const options = [...distractors, targetItem].sort(() => Math.random() - 0.5);

      return {
        targetItem: targetItem, // Câu hỏi chính
        options: options        // 4 đáp án (gồm id, meaning,...)
      };
    });

    setQuestions(generatedQuestions);
    setStartTime(Date.now()); // Bắt đầu tính giờ
  }, [stationData]);

  // ==========================================================================
  // 2. XỬ LÝ CHỌN ĐÁP ÁN & NỘP BÀI
  // ==========================================================================
  const handleSelectOption = (option) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (!selectedOption) return;

    // Lưu lại đáp án của câu hiện tại
    const newAnswers = [
      ...userAnswers,
      {
        questionItemId: questions[currentIndex].targetItem.id,
        selectedItemId: selectedOption.id
      }
    ];
    setUserAnswers(newAnswers);
    setSelectedOption(null); // Reset lựa chọn cho câu sau

    // Nếu là câu cuối cùng -> NỘP BÀI
    if (currentIndex === questions.length - 1) {
      setIsSubmitting(true);
      const endTime = Date.now();
      const timeSpentSeconds = Math.floor((endTime - startTime) / 1000);
      
      // Gọi hàm của Nhạc Trưởng truyền xuống
      onSubmitTest(timeSpentSeconds, newAnswers);
    } else {
      // Sang câu tiếp theo
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (questions.length === 0 || isSubmitting) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center animate-fade-in">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-widest">
          {isSubmitting ? 'Đang chấm điểm...' : 'Đang tạo đề thi...'}
        </h2>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const progressPercentage = (currentIndex / questions.length) * 100;
  const mainText = stationData.itemType === 'KANJI' ? currentQuestion.targetItem.characters : currentQuestion.targetItem.word;

  // ==========================================================================
  // 3. RENDER GIAO DIỆN
  // ==========================================================================
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center py-6 px-4 animate-fade-in h-[calc(100vh-8rem)]">
      
      {/* THANH TIẾN ĐỘ THI */}
      <div className="w-full mb-8 flex items-center gap-4">
        <div className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-sm font-bold text-gray-500 dark:bg-gray-800">
          <HelpCircle size={16} /> {currentIndex + 1}/{questions.length}
        </div>
        <div className="h-3.5 flex-1 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
          <div 
            className="h-full bg-yellow-400 transition-all duration-500 ease-out" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* CÂU HỎI */}
      <div className="mb-10 text-center w-full">
        <h2 className="text-lg font-bold text-gray-500 dark:text-gray-400 mb-6 uppercase tracking-wider">
          Chọn nghĩa đúng của từ sau:
        </h2>
        <div className="inline-block rounded-[2rem] border-2 border-gray-100 bg-white px-16 py-10 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <span className="text-[5rem] font-black leading-none text-gray-900 dark:text-white">
            {mainText}
          </span>
        </div>
      </div>

      {/* CÁC LỰA CHỌN (Grid 2x2 Duolingo Style) */}
      <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {currentQuestion.options.map((opt, idx) => {
          const isSelected = selectedOption?.id === opt.id;
          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(opt)}
              className={`group flex items-center p-5 text-left rounded-2xl border-2 transition-all duration-200 ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50 shadow-[0_4px_0_rgb(59,130,246)] dark:bg-blue-900/20' 
                  : 'border-gray-200 bg-white shadow-[0_4px_0_rgb(229,231,235)] hover:bg-gray-50 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:shadow-[0_4px_0_rgb(55,65,81)]'
              }`}
            >
              <div className={`mr-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 text-sm font-bold ${
                isSelected ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-200 text-gray-400 dark:border-gray-600'
              }`}>
                {idx + 1}
              </div>
              <span className={`text-lg font-bold capitalize ${isSelected ? 'text-blue-700 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'}`}>
                {opt.meaning}
              </span>
            </button>
          );
        })}
      </div>

      {/* FOOTER (Bottom Action Bar) */}
      <div className="fixed bottom-0 left-0 right-0 border-t-2 border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 sm:px-8 flex justify-center">
        <div className="w-full max-w-3xl flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-2 text-gray-400 font-medium">
            <Clock size={20} />
            Đang ghi nhận thời gian làm bài...
          </div>
          
          <button
            onClick={handleNext}
            disabled={!selectedOption}
            className={`flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl px-10 py-4 text-lg font-black transition-all active:translate-y-1 ${
              !selectedOption 
                ? 'bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed shadow-none' 
                : 'bg-green-500 text-white shadow-[0_6px_0_rgb(34,197,94)] hover:brightness-110 active:shadow-none'
            }`}
          >
            {isLastQuestion ? (
              <>Hoàn thành <CheckCircle2 size={24} strokeWidth={3} /></>
            ) : (
              <>Kiểm tra <ArrowRight size={24} strokeWidth={3} /></>
            )}
          </button>
        </div>
      </div>

    </div>
  );
};