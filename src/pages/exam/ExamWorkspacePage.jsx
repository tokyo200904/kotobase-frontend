import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExam } from '../../context/ExamContext';
import { examService } from '../../services/examService';
import { useExamWebSocket } from '../../hooks/useExamWebSocket';
import { QuestionList } from '../../components/exam/QuestionList';
import { AnswerSheet } from '../../components/exam/AnswerSheet';
import { Loader2, WifiOff } from 'lucide-react';

export const ExamWorkspacePage = () => {
  const { attemptId: paramAttemptId, sectionId: paramSectionId } = useParams();
  const navigate = useNavigate();

  const {
    setAttemptId, setCurrentSectionId, setSectionData, setRemainingTime,
    setSavedAnswers, wsStatus, isOverlayLoading, setIsOverlayLoading,
    overlayMessage, setOverlayMessage, examFinished, setExamFinished, resetExamContext
  } = useExam();

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '' });

  useEffect(() => {
    resetExamContext(); 
    setAttemptId(paramAttemptId);
    setCurrentSectionId(paramSectionId);

    const initializeWorkspace = async () => {
      setIsInitialLoading(true);
      try {
        const resumeData = await examService.resumeAttempt(paramAttemptId);
        setRemainingTime(resumeData.remainingTime);
        setSavedAnswers(resumeData.savedAnswers || {});

        const activeSectionId = resumeData.sessionId || paramSectionId;

        const detailData = await examService.getSectionDetails(paramAttemptId, activeSectionId);
        setSectionData(detailData);
      } catch (error) {
        console.error(error);
        alert("Lỗi bảo mật hoặc phòng thi đã đóng!");
        navigate('/exam', { replace: true });
      } finally {
        setIsInitialLoading(false);
      }
    };

    initializeWorkspace();
  }, [paramAttemptId, paramSectionId]);

const handleWebSocketCommand = (payload) => {
    const command = payload.command || payload.action; 
    const { nextSectionId, message } = payload;

    if (command === 'TIME_UP' || command === 'FORCE_SUBMIT') {
      setIsOverlayLoading(true);
      setOverlayMessage('Hết thời gian! Hệ thống đang thu bài...');
    } 
    else if (command === 'MOVE_NEXT') {
      setIsOverlayLoading(false);
      setModalConfig({ isOpen: true, title: 'Hết thời gian phần thi', message: message || 'Tự động chuyển sang phần thi tiếp theo.' });
      setTimeout(() => {
        setModalConfig({ isOpen: false, title: '', message: '' });
        navigate(`/exam/attempt/${paramAttemptId}/section/${nextSectionId}`);
      }, 3000);
    } 
    else if (command === 'FINISHED' || command === 'SESSION_EXPIRED' || command === 'SCORE_READY') {
      setIsOverlayLoading(false);
      setExamFinished(true);
      setModalConfig({ isOpen: true, title: 'Trận đấu kết thúc', message: message || 'Đang chuyển đến bảng điểm...' });
      
      setTimeout(() => {
        setModalConfig({ isOpen: false, title: '', message: '' });
        navigate(`/exam/result/${paramAttemptId}`, { replace: true });
      }, 2000);
    }
  };

  const { sendAutosave } = useExamWebSocket(handleWebSocketCommand);

const handleManualSubmit = async () => {
    if (isOverlayLoading) return;
    setIsOverlayLoading(true);
    setOverlayMessage('Hệ thống đang xử lý bài làm của bạn...');
    try {
      const res = await examService.submitSection(paramAttemptId, paramSectionId);
      if (res.examFinished) {
        setOverlayMessage('Đang đợi hệ thống chấm điểm...');
        setTimeout(() => navigate(`/exam/result/${paramAttemptId}`, { replace: true }), 2000);
      } else {
        navigate(`/exam/attempt/${paramAttemptId}/section/${res.nextSectionId}`);
      }
    } catch (error) {
      alert(error.message || "Lỗi xử lý nộp bài từ máy chủ!");
      setIsOverlayLoading(false);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 size={40} className="animate-spin text-primary" />
        <p className="mt-4 text-sm font-bold text-gray-500 uppercase tracking-widest">Đang thiết lập phòng thi bảo mật...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-gray-50 font-sans text-gray-900 dark:bg-gray-950 dark:text-gray-100 select-none">
      
      <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-gray-900 px-2.5 py-1 text-xs font-black text-white dark:bg-black">KOTOBASE EXAM</span>
          <h1 className="text-base font-bold text-gray-800 dark:text-gray-200">Đấu trường Khảo thí JLPT Real-time</h1>
        </div>
        
        {wsStatus === 'RECONNECTING' && (
          <div className="flex items-center gap-2 text-amber-600 animate-pulse">
            <WifiOff size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Mất mạng! Đang kết nối lại...</span>
          </div>
        )}
      </header>

      <main className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
          <QuestionList sendAutosave={sendAutosave} />
        </div>

        <div className="w-80 border-l border-gray-200 bg-gray-50/50 p-6 dark:border-gray-800 h-full">
          <AnswerSheet onManualSubmit={handleManualSubmit} />
        </div>
      </main>

      {(isOverlayLoading || wsStatus === 'RECONNECTING' || wsStatus === 'CONNECTING') && (
        <div className="fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="rounded-2xl bg-white p-8 text-center shadow-2xl dark:bg-gray-900 max-w-xs w-full border border-gray-100 dark:border-gray-800">
            <Loader2 size={36} className="animate-spin text-primary mx-auto" />
            <h3 className="mt-4 text-base font-black text-gray-900 dark:text-white">
              {wsStatus === 'RECONNECTING' ? 'Đứt kết nối!' : 'Vui lòng đợi'}
            </h3>
            <p className="mt-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
              {wsStatus === 'RECONNECTING' ? 'Đang kích hoạt mạch cứu hộ kết nối lại ngầm...' : overlayMessage}
            </p>
          </div>
        </div>
      )}

      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md scale-100 rounded-3xl bg-white p-6 text-center shadow-2xl transition-all dark:bg-gray-900 border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-black text-red-500">{modalConfig.title}</h2>
            <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-300">{modalConfig.message}</p>
            <div className="mt-5 flex items-center justify-center gap-2 text-xs font-bold text-gray-400">
              <Loader2 size={14} className="animate-spin text-primary" />
              <span>Hệ thống chuyển trang sau vài giây...</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};