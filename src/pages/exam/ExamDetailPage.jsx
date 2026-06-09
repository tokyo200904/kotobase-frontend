import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Target, FileText, AlertCircle, Loader2, PlayCircle, BookOpen, Crown, Sparkles, Milestone } from 'lucide-react';
import { examService } from '../../services/examService';
import { useAuth } from '../../context/AuthContext';
import { PremiumModal } from '../../components/common/PremiumModal';

export const ExamDetailPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  
  const [exam, setExam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const { user, isAuthenticated, setAuthModalOpen } = useAuth();

  useEffect(() => {
    const fetchExamDetails = async () => {
      setIsLoading(true);
      try {
        const data = await examService.getExamDetails(examId);
        setExam(data);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết bài thi:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExamDetails();
  }, [examId]);

  const handleStartExam = async () => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    if (!user?.premium) {
      setIsPremiumModalOpen(true);
      return;
    }

    if (isStarting) return;
    setIsStarting(true);
    try {
      const data = await examService.startExam(examId);
      const sectionId = data.activeSectionId || data.sessionId;
      navigate(`/exam/attempt/${data.attemptId}/section/${sectionId}`);
    } catch (error) {
      console.error("Lỗi khởi tạo phòng thi:", error);
      alert(error.message || "Không thể kết nối đến máy chủ thi.");
      setIsStarting(false);
    }
  };

  if (isLoading) return <div className="flex h-[80vh] items-center justify-center"><Loader2 size={40} className="animate-spin text-primary" /></div>;
  if (!exam) return <div className="text-center py-20 text-gray-400 font-bold">Không tìm thấy thông tin đề thi hợp lệ.</div>;

  return (
    <div className="custom-scrollbar h-[calc(100vh-6rem)] w-full overflow-y-auto bg-[#f8fafc] pr-2 dark:bg-gray-950 md:pr-4">
      <div className="mx-auto max-w-4xl space-y-6 pb-16 pt-4 animate-fade-in">
        
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-black text-gray-400 transition-colors hover:text-primary cursor-pointer uppercase tracking-widest"
        >
          <ArrowLeft size={16} strokeWidth={3} /> Quay lại danh sách
        </button>

        <div className="rounded-[2.5rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-[2rem] bg-gradient-to-br from-gray-900 to-black text-white dark:from-gray-800 shadow-md">
              <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Cấp Độ</span>
              <span className="text-3xl font-black leading-none mt-1">{exam.level}</span>
            </div>
            <div className="flex-1 space-y-1">
              <h1 className="text-2xl font-black text-gray-900 dark:text-white md:text-3xl tracking-tight leading-tight">{exam.title}</h1>
              <p className="text-sm font-medium text-gray-400 flex items-center gap-1">
                <Sparkles size={14} className="text-yellow-500 fill-yellow-500" /> Hệ thống thi thử chuẩn hóa, đo lường toàn diện 3 kỹ năng cốt lõi.
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/30">
              <Clock size={18} className="text-primary mb-2" />
              <div className="text-2xl font-black text-gray-900 dark:text-white">{exam.durationMinutes}<span className="text-sm font-bold text-gray-400 ml-0.5">p</span></div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider mt-1">THỜI GIAN LÀM BÀI</div>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/30">
              <FileText size={18} className="text-blue-500 mb-2" />
              <div className="text-2xl font-black text-gray-900 dark:text-white">{exam.totalQuestions}<span className="text-sm font-bold text-gray-400 ml-0.5">câu</span></div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider mt-1">TỔNG SỐ CÂU HỎI</div>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/30">
              <Target size={18} className="text-green-500 mb-2" />
              <div className="text-2xl font-black text-green-500">{exam.passingScore}<span className="text-xs font-bold text-gray-400 ml-1">/{exam.maxScore}đ</span></div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider mt-1">TIÊU CHUẨN ĐẠT</div>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/30">
              <BookOpen size={18} className="text-purple-500 mb-2" />
              <div className="text-2xl font-black text-gray-900 dark:text-white">{exam.sections?.length || 0}<span className="text-sm font-bold text-gray-400 ml-0.5">phần</span></div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider mt-1">PHÂN TÁCH ĐỀ THI</div>
            </div>
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
          <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2 mb-6">
            <Milestone size={20} className="text-primary" /> Cấu Trúc Các Phần Thi Hành Trình
          </h2>
          
          <div className="space-y-4">
            {exam.sections?.map((section, index) => (
              <div key={section.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-gray-50/30 p-5 transition-all hover:border-gray-200 hover:bg-white dark:border-gray-800 dark:hover:bg-gray-800/50">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-base font-black text-primary border border-primary/10">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 dark:text-white text-base">{section.name}</h3>
                    <div className="mt-1 flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1"><Clock size={14} /> {section.durationMinutes} phút</span>
                      <span className="flex items-center gap-1"><FileText size={14} /> {section.totalQuestions} câu hỏi</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col justify-between sm:text-right items-center sm:items-end border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 dark:border-gray-800">
                  <div className="text-sm font-black text-gray-800 dark:text-gray-200">Điểm tối đa: <b className="text-primary">{section.maxScore}đ</b></div>
                  <div className="text-[10px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded dark:bg-red-950/20 uppercase tracking-widest mt-0.5">Điểm liệt: &lt; {section.minPassingScore}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BANNER ĐIỀU KHOẢN VÀ NÚT BẤM KÍCH HOẠT ACTION CHÍNH */}
        <div className="rounded-[2.5rem] border border-amber-200/40 bg-gradient-to-br from-amber-50 to-orange-50/30 p-6 dark:from-amber-950/10 dark:to-transparent flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex gap-3 items-start">
            <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={22} />
            <div>
              <h3 className="font-black text-amber-900 dark:text-amber-400 text-base">Cơ chế Đồng bộ Phòng thi Thời gian thực</h3>
              <p className="mt-1 text-xs font-medium leading-relaxed text-amber-800/80 dark:text-amber-500/70 max-w-xl">
                Hệ thống đếm giờ chạy ngầm đồng bộ với máy chủ trung tâm. Thời gian làm bài sẽ liên tục trôi kể cả khi bạn đóng tab hoặc xảy ra sự cố mạng. Hãy đảm bảo sự tập trung cao độ trước khi nhấn nút.
              </p>
            </div>
          </div>
          
          <button
            onClick={handleStartExam}
            disabled={isStarting}
            className={`flex w-full md:w-auto items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-base font-black text-white shadow-[0_6px_0_rgb(37,99,235)] transition-all hover:brightness-110 active:translate-y-1 active:shadow-none disabled:opacity-70 shrink-0 cursor-pointer`}
          >
            {isStarting ? (
              <><Loader2 size={20} className="animate-spin" /> Đang thiết lập...</>
            ) : !user?.premium ? (
              <><Crown size={20} fill="currentColor" /> Mở Khóa Đề VIP</>
            ) : (
              <><PlayCircle size={20} /> Khai Hỏa Làm Bài</>
            )}
          </button>
        </div>

      </div>

      <PremiumModal isOpen={isPremiumModalOpen} onClose={() => setIsPremiumModalOpen(false)} />
    </div>
  );
};