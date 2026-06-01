import React, { createContext, useContext, useState, useEffect } from 'react';

const ExamContext = createContext(null);

export const ExamProvider = ({ children }) => {
  const [attemptId, setAttemptId] = useState(null);
  const [currentSectionId, setCurrentSectionId] = useState(null);
  const [sectionData, setSectionData] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [savedAnswers, setSavedAnswers] = useState({});
  
  const [wsStatus, setWsStatus] = useState('DISCONNECTED');
  
  const [isOverlayLoading, setIsOverlayLoading] = useState(false);
  const [overlayMessage, setOverlayMessage] = useState('');
  const [examFinished, setExamFinished] = useState(false);

  useEffect(() => {
    if (remainingTime <= 0 || wsStatus === 'RECONNECTING' || isOverlayLoading || examFinished) return;

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsOverlayLoading(true);
          setOverlayMessage('Đang đợi hệ thống thu bài...');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime, wsStatus, isOverlayLoading, examFinished]);

  const updateSavedAnswer = (questionId, answerId) => {
    setSavedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const resetExamContext = () => {
    setAttemptId(null);
    setCurrentSectionId(null);
    setSectionData(null);
    setRemainingTime(0);
    setSavedAnswers({});
    setWsStatus('DISCONNECTED');
    setIsOverlayLoading(false);
    setOverlayMessage('');
    setExamFinished(false);
  };

  return (
    <ExamContext.Provider value={{
      attemptId, setAttemptId,
      currentSectionId, setCurrentSectionId,
      sectionData, setSectionData,
      remainingTime, setRemainingTime,
      savedAnswers, setSavedAnswers, updateSavedAnswer,
      wsStatus, setWsStatus,
      isOverlayLoading, setIsOverlayLoading,
      overlayMessage, setOverlayMessage,
      examFinished, setExamFinished,
      resetExamContext
    }}>
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) throw new Error('useExam phải được đặt trong ExamProvider');
  return context;
};