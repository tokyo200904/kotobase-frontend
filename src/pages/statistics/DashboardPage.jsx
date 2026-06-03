import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Clock, Target, Layers, PlayCircle, Loader2, Sparkles, BookOpen, CheckCircle2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { studyService } from '../../services/studyService';

const COLORS = { NEW: '#3b82f6', LEARNING: '#f59e0b', MASTERED: '#10b981' }; 

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await studyService.getDashboard();
        setData(result);
      } catch (error) {
        console.error("Lỗi tải dữ liệu thống kê:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-6rem)] items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!data) return null;

  const totalItems = (data.statusDistribution.NEW || 0) + (data.statusDistribution.LEARNING || 0) + (data.statusDistribution.MASTERED || 0);

  const pieData = [
    { name: 'Từ Mới', value: data.statusDistribution.NEW || 0, color: COLORS.NEW, label: 'NEW' },
    { name: 'Đang Học', value: data.statusDistribution.LEARNING || 0, color: COLORS.LEARNING, label: 'LEARNING' },
    { name: 'Đã Thuộc', value: data.statusDistribution.MASTERED || 0, color: COLORS.MASTERED, label: 'MASTERED' },
  ].filter(item => item.value > 0);

  return (
    <div className="custom-scrollbar h-[calc(100vh-6rem)] w-full overflow-y-auto pr-2 md:pr-4">
      <div className="mx-auto max-w-5xl space-y-8 pb-12 pt-4 animate-fade-in">
        
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              Không gian học tập <Sparkles className="text-yellow-500 animate-pulse" size={24} />
            </h1>
            <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
              Chào mừng bạn trở lại! Hãy hoàn thành mục tiêu hôm nay để giữ vững phong độ nhé.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          
          <div className="lg:col-span-3 flex flex-col justify-between rounded-[2rem] border border-gray-100 bg-white p-6 shadow-xl shadow-gray-100/40 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none">
            <div>
              <div className="flex items-center justify-between border-b border-gray-50 pb-4 dark:border-gray-800">
                <h2 className="text-lg font-black uppercase tracking-wider text-gray-900 dark:text-white">Nhiệm vụ hôm nay</h2>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary animate-pulse">Daily Goal</span>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="group flex items-center justify-between rounded-2xl border border-gray-50 bg-gray-50/50 p-4 transition-all hover:border-primary/30 hover:bg-white dark:border-gray-800 dark:bg-gray-800/40 dark:hover:bg-gray-800">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 font-bold text-lg">🈴</div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Luyện tập Kanji</h4>
                      <p className="text-xs font-medium text-gray-400">{data.kanjiDueToday} chữ cần ôn tập</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/quiz?type=KANJI&total=${data.kanjiDueToday}`)}
                    className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all group-hover:scale-105 active:scale-95"
                  >
                    Bắt đầu <PlayCircle size={14} />
                  </button>
                </div>

                <div className="group flex items-center justify-between rounded-2xl border border-gray-50 bg-gray-50/50 p-4 transition-all hover:border-primary/30 hover:bg-white dark:border-gray-500 dark:border-gray-800 dark:bg-gray-800/40 dark:hover:bg-gray-800">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 font-bold text-lg">📚</div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Luyện tập Từ vựng</h4>
                      <p className="text-xs font-medium text-gray-400">{data.vocabDueToday} từ cần ôn tập</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/quiz?type=VOCAB&total=${data.vocabDueToday}`)}
                    className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all group-hover:scale-105 active:scale-95"
                  >
                    Bắt đầu <PlayCircle size={14} />
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-6 text-xs font-medium text-gray-400 border-t border-gray-50 pt-4 dark:border-gray-800">
              💡 Thuật toán lặp lại ngắt quãng (Spaced Repetition) đã tự động tính toán lịch trình ôn tập tối ưu cho bạn.
            </p>
          </div>

          <div className="lg:col-span-2 flex flex-col items-center justify-center rounded-[2rem] border border-gray-100 bg-white p-6 shadow-xl shadow-gray-100/40 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none">
            <h2 className="w-full text-left text-sm font-black uppercase tracking-wider text-gray-400 mb-2">Kho tàng từ vựng</h2>
            
            <div className="relative h-44 w-full">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={pieData} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={55} 
                      outerRadius={75} 
                      paddingAngle={4} 
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} className="outline-none" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm font-medium text-gray-400">Chưa có dữ liệu học</div>
              )}
              
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-gray-900 dark:text-white">{totalItems}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tổng từ</span>
              </div>
            </div>

            <div className="mt-2 w-full grid grid-cols-3 gap-2 text-center border-t border-gray-50 pt-4 dark:border-gray-800">
              <div>
                <span className="inline-block h-2 w-2 rounded-full bg-[#10b981] mr-1.5"></span>
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Đã thuộc</span>
                <div className="text-sm font-black text-gray-800 dark:text-white mt-0.5">{data.statusDistribution.MASTERED || 0}</div>
              </div>
              <div>
                <span className="inline-block h-2 w-2 rounded-full bg-[#f59e0b] mr-1.5"></span>
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Đang học</span>
                <div className="text-sm font-black text-gray-800 dark:text-white mt-0.5">{data.statusDistribution.LEARNING || 0}</div>
              </div>
              <div>
                <span className="inline-block h-2 w-2 rounded-full bg-[#3b82f6] mr-1.5"></span>
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Từ mới</span>
                <div className="text-sm font-black text-gray-800 dark:text-white mt-0.5">{data.statusDistribution.NEW || 0}</div>
              </div>
            </div>
          </div>

        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">Chỉ số trong ngày</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            
       
            <div className="group rounded-3xl border border-gray-100 bg-white p-5 shadow-md shadow-gray-100/30 transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:shadow-none">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-950/30 dark:text-orange-400">
                <Flame size={22} className="group-hover:animate-bounce" />
              </div>
              <div className="mt-4 text-2xl font-black text-gray-900 dark:text-white">
                {data.currentStreak} <span className="text-xs font-bold text-gray-400">ngày</span>
              </div>
              <div className="mt-0.5 text-xs font-bold text-gray-400 uppercase tracking-wide">Streak liên tiếp</div>
            </div>

            <div className="group rounded-3xl border border-gray-100 bg-white p-5 shadow-md shadow-gray-100/30 transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:shadow-none">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-500 dark:bg-blue-950/30 dark:text-blue-400">
                <Clock size={22} />
              </div>
              <div className="mt-4 text-2xl font-black text-gray-900 dark:text-white">
                {data.minutesSpentToday} <span className="text-xs font-bold text-gray-400">phút</span>
              </div>
              <div className="mt-0.5 text-xs font-bold text-gray-400 uppercase tracking-wide">Thời gian học</div>
            </div>

            <div className="group rounded-3xl border border-gray-100 bg-white p-5 shadow-md shadow-gray-100/30 transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:shadow-none">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-500 dark:bg-green-950/30 dark:text-green-400">
                <Target size={22} />
              </div>
              <div className="mt-4 text-2xl font-black text-gray-900 dark:text-white">
                {data.accuracyPercentage}<span className="text-xs font-bold text-gray-400">%</span>
              </div>
              <div className="mt-0.5 text-xs font-bold text-gray-400 uppercase tracking-wide">Độ chính xác</div>
            </div>

            <div className="group rounded-3xl border border-gray-100 bg-white p-5 shadow-md shadow-gray-100/30 transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:shadow-none">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-500 dark:bg-purple-950/30 dark:text-purple-400">
                <Layers size={22} />
              </div>
              <div className="mt-4 text-2xl font-black text-gray-900 dark:text-white">
                {data.totalReviewedToday} <span className="text-xs font-bold text-gray-400">mục</span>
              </div>
              <div className="mt-0.5 text-xs font-bold text-gray-400 uppercase tracking-wide">Đã ôn hôm nay</div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};