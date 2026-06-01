import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Target, CheckCircle2, FileText, AlertCircle, Loader2, PlayCircle, BookOpen } from 'lucide-react';
import { examService } from '../../services/examService';

export const ExamDetailPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  
  const [exam, setExam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

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
    if (isStarting) return;
    setIsStarting(true);
    try {
      const data = await examService.startExam(examId);
      const sectionId = data.activeSectionId || data.sessionId;
      navigate(`/exam/attempt/${data.attemptId}/section/${sectionId}`);
    } catch (error) {
      console.error("Lỗi khởi tạo phòng thi:", error);
      alert("Không thể kết nối đến máy chủ thi. Vui lòng thử lại!");
      setIsStarting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-6rem)] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!exam) return <div className="text-center py-20 text-gray-500">Không tìm thấy bài thi.</div>;

  return (
    <div className="custom-scrollbar h-[calc(100vh-6rem)] w-full overflow-y-auto bg-gray-50/50 pr-2 dark:bg-gray-950 md:pr-4">
      <div className="mx-auto max-w-4xl space-y-6 pb-16 pt-6">
        
        <Link 
          to={`/exam/level/${exam.level?.replace('N', '') || 3}`} 
          onClick={(e) => { e.preventDefault(); navigate(-1); }}
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft size={16} /> Quay lại danh sách
        </Link>

        <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-10">
          <div className="flex items-start gap-6">
            <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl bg-gray-900 text-white dark:bg-black">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Level</span>
              <span className="text-3xl font-black">{exam.level}</span>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">{exam.title}</h1>
              <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                Bài thi thử nghiệm chuẩn JLPT. Hãy đảm bảo bạn có đủ thời gian không bị gián đoạn.
              </p>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-2xl bg-gray-50 p-5 dark:bg-gray-800/50">
              <Clock size={20} className="text-primary mb-3" />
              <div className="text-2xl font-black text-gray-900 dark:text-white">{exam.durationMinutes}<span className="text-sm font-bold text-gray-500">p</span></div>
              <div className="mt-1 text-xs font-bold text-gray-500">TỔNG THỜI GIAN</div>
            </div>
            <div className="rounded-2xl bg-gray-50 p-5 dark:bg-gray-800/50">
              <FileText size={20} className="text-blue-500 mb-3" />
              <div className="text-2xl font-black text-gray-900 dark:text-white">{exam.totalQuestions}</div>
              <div className="mt-1 text-xs font-bold text-gray-500">TỔNG CÂU HỎI</div>
            </div>
            <div className="rounded-2xl bg-gray-50 p-5 dark:bg-gray-800/50">
              <Target size={20} className="text-green-500 mb-3" />
              <div className="text-2xl font-black text-gray-900 dark:text-white">{exam.passingScore}<span className="text-sm font-bold text-gray-500">/{exam.maxScore}</span></div>
              <div className="mt-1 text-xs font-bold text-gray-500">ĐIỂM ĐẠT</div>
            </div>
            <div className="rounded-2xl bg-gray-50 p-5 dark:bg-gray-800/50">
              <BookOpen size={20} className="text-purple-500 mb-3" />
              <div className="text-2xl font-black text-gray-900 dark:text-white">{exam.sections?.length || 0}</div>
              <div className="mt-1 text-xs font-bold text-gray-500">PHẦN THI</div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Cấu trúc đề thi</h2>
          
          <div className="mt-6 space-y-4">
            {exam.sections?.map((section, index) => (
              <div key={section.id} className="flex items-center gap-6 rounded-2xl border border-gray-100 p-5 transition-colors hover:border-gray-200 dark:border-gray-800 dark:hover:border-gray-700">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-black text-primary">
                  {index + 1}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 dark:text-white">{section.name}</h3>
                  <div className="mt-1 flex items-center gap-4 text-xs font-medium text-gray-500">
                    <span className="flex items-center gap-1"><Clock size={14} /> {section.durationMinutes} phút</span>
                    <span className="flex items-center gap-1"><FileText size={14} /> {section.totalQuestions} câu</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900 dark:text-white">{section.maxScore} điểm</div>
                  <div className="text-xs font-medium text-red-500">Điểm liệt: &lt;{section.minPassingScore}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-amber-50 p-6 dark:bg-amber-950/30">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 text-amber-600 dark:text-amber-500" size={20} />
            <div>
              <h3 className="font-bold text-amber-800 dark:text-amber-400">Lưu ý quan trọng</h3>
              <p className="mt-1 text-sm font-medium text-amber-700/80 dark:text-amber-500/80">
                Bài thi sử dụng hệ thống tính giờ theo thời gian thực từ máy chủ. Ngay cả khi bạn tắt trình duyệt hoặc mất mạng, thời gian vẫn tiếp tục trôi. Hãy đảm bảo đường truyền ổn định trước khi bắt đầu.
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleStartExam}
              disabled={isStarting}
              className="flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-xl active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isStarting ? (
                <><Loader2 size={20} className="animate-spin" /> Đang thiết lập phòng thi...</>
              ) : (
                <><PlayCircle size={20} /> Bắt đầu làm bài</>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};