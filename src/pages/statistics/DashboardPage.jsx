import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Flame, Clock, Target, Layers, Loader2, Sparkles, Star, 
  Lock, CheckCircle2, Crown, Map as MapIcon, PlayCircle, Trophy, Compass
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

import { studyService } from '../../services/studyService';
import { roadmapService } from '../../services/roadmapService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const COLORS = { NEW: '#3b82f6', LEARNING: '#f59e0b', MASTERED: '#10b981' };

// CẤU HÌNH STYLE ĐỒNG BỘ CHO TỪNG LEVEL
const LEVEL_CONFIGS = {
  5: { name: 'Sơ Cấp N5', badge: 'N5', bg: 'bg-emerald-500', from: 'from-emerald-400 to-green-600', text: 'text-emerald-500', border: 'border-emerald-500/20', glow: 'shadow-emerald-500/10', track: 'border-emerald-200 dark:border-emerald-950/40', btnShadow: 'shadow-[0_8px_0_#059669]', activeBtnShadow: 'active:shadow-[0_0px_0_#059669]' },
  4: { name: 'Sơ Trung N4', badge: 'N4', bg: 'bg-blue-500', from: 'from-blue-400 to-blue-600', text: 'text-blue-500', border: 'border-blue-500/20', glow: 'shadow-blue-500/10', track: 'border-blue-200 dark:border-blue-950/40', btnShadow: 'shadow-[0_8px_0_#2563eb]', activeBtnShadow: 'active:shadow-[0_0px_0_#2563eb]' },
  3: { name: 'Trung Cấp N3', badge: 'N3', bg: 'bg-orange-500', from: 'from-orange-400 to-amber-600', text: 'text-orange-500', border: 'border-orange-500/20', glow: 'shadow-orange-500/10', track: 'border-orange-200 dark:border-orange-950/40', btnShadow: 'shadow-[0_8px_0_#ea580c]', activeBtnShadow: 'active:shadow-[0_0px_0_#ea580c]' },
  2: { name: 'Cao Trung N2', badge: 'N2', bg: 'bg-pink-500', from: 'from-pink-400 to-rose-600', text: 'text-pink-500', border: 'border-pink-500/20', glow: 'shadow-pink-500/10', track: 'border-pink-200 dark:border-pink-950/40', btnShadow: 'shadow-[0_8px_0_#db2777]', activeBtnShadow: 'active:shadow-[0_0px_0_#db2777]' },
  1: { name: 'Thượng Cấp N1', badge: 'N1', bg: 'bg-purple-500', from: 'from-purple-400 to-violet-600', text: 'text-purple-500', border: 'border-purple-500/20', glow: 'shadow-purple-500/10', track: 'border-purple-200 dark:border-purple-950/40', btnShadow: 'shadow-[0_8px_0_#7c3aed]', activeBtnShadow: 'active:shadow-[0_0px_0_#7c3aed]' }
};

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { setAuthModalOpen } = useAuth();
  
  const token = localStorage.getItem('token'); 
  const isAuthenticated = !!token; 

  const [statsData, setStatsData] = useState(null);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  const [activeType, setActiveType] = useState('KANJI');
  const [activeLevel, setActiveLevel] = useState(5);
  const [stations, setStations] = useState([]);
  const [isRoadmapLoading, setIsRoadmapLoading] = useState(false);

  const currentLvlStyle = LEVEL_CONFIGS[activeLevel];

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchStats = async () => {
      try {
        const result = await studyService.getDashboard();
        setStatsData(result);
      } catch (error) {
        console.error("Lỗi tải thống kê:", error);
      } finally {
        setIsStatsLoading(false);
      }
    };
    fetchStats();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchRoadmap = async () => {
      setIsRoadmapLoading(true);
      try {
        const data = await roadmapService.getRoadmapStations(activeLevel, activeType);
        setStations(data);
      } catch (error) {
        console.error("Lỗi tải roadmap:", error);
      } finally {
        setIsRoadmapLoading(false);
      }
    };
    fetchRoadmap();
  }, [activeLevel, activeType, isAuthenticated]);

  const handleStationClick = (station) => {
    if (station.status === 'LOCKED') {
      addToast('Hãy hoàn thành các trạm trước đó để mở khóa!', 'error');
      return;
    }
    navigate(`/roadmap/station/${station.id}`);
  };

  const getZigZagTransform = (index) => {
    const offsets = [0, -60, -95, -60, 0, 60, 95, 60]; 
    return `translateX(${offsets[index % 8]}px)`;
  };

  if (!isAuthenticated) {
    return (
      <div className="flex h-[calc(100vh-6rem)] w-full flex-col items-center justify-center bg-gray-50/50 px-4 text-center dark:bg-gray-950/50">
        <div className="animate-fade-in flex flex-col items-center rounded-[2.5rem] border border-gray-100 bg-white p-10 shadow-2xl max-w-lg dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary opacity-20"></div>
            <MapIcon size={40} strokeWidth={2.5} className="relative z-10" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Lộ Trình KotoBase</h1>
          <p className="mt-4 text-sm font-medium leading-relaxed text-gray-500 dark:text-gray-400">
            Khám phá lộ trình học tiếng Nhật thông minh chia trạm kiểm tra, theo dõi sát sao chuỗi liên tục (Streak) và mức độ chính xác của bạn.
          </p>
          <button 
            onClick={() => setAuthModalOpen(true)} 
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-lg font-black text-white shadow-[0_6px_0_rgb(37,99,235)] transition-all hover:brightness-110 active:translate-y-1.5 active:shadow-none"
          >
            Đăng nhập để bắt đầu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="custom-scrollbar h-[calc(100vh-6rem)] w-full overflow-y-auto pr-2 md:pr-4 bg-[#f8fafc] dark:bg-gray-950">
      <div className="mx-auto max-w-6xl space-y-6 pb-12 pt-4 animate-fade-in">
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-start">
          
          <div className="lg:col-span-2 space-y-6">
            
            <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className={`rounded-xl ${currentLvlStyle.bg} p-2 text-white shadow-md`}>
                  <Compass size={24} className="animate-spin-slow" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                    Lộ trình {currentLvlStyle.name} <Sparkles size={16} className="text-yellow-500 animate-pulse" />
                  </h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Học bài mới & vượt ải mở đường</p>
                </div>
              </div>

              <div className="flex rounded-2xl bg-gray-100 p-1 dark:bg-gray-800 border dark:border-gray-700 shrink-0">
                <button onClick={() => setActiveType('KANJI')} className={`rounded-xl px-5 py-2 text-xs font-black uppercase tracking-wider transition-all ${activeType === 'KANJI' ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}>🈴 Kanji</button>
                <button onClick={() => setActiveType('VOCAB')} className={`rounded-xl px-5 py-2 text-xs font-black uppercase tracking-wider transition-all ${activeType === 'VOCAB' ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}>📚 Từ vựng</button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="grid grid-cols-5 gap-2">
                {[5, 4, 3, 2, 1].map(lvlId => {
                  const cfg = LEVEL_CONFIGS[lvlId];
                  const isCurrent = activeLevel === lvlId;
                  return (
                    <button
                      key={lvlId} onClick={() => setActiveLevel(lvlId)}
                      className={`group relative flex flex-col items-center justify-center rounded-2xl py-3 border-2 transition-all duration-300 ${
                        isCurrent 
                          ? `border-transparent bg-gradient-to-br ${cfg.from} text-white shadow-lg ${cfg.shadow} scale-100 font-black` 
                          : 'border-gray-100 bg-gray-50/50 text-gray-400 hover:bg-white hover:border-gray-200 dark:border-gray-800 dark:bg-gray-800/50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span className="text-lg font-black">{cfg.badge}</span>
                      <span className={`text-[9px] font-bold uppercase tracking-wider hidden sm:block ${isCurrent ? 'text-white/80' : 'text-gray-400 group-hover:text-gray-600'}`}>
                        {lvlId === 5 || lvlId === 1 ? 'JLPT' : 'Level'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={`relative h-[530px] w-full overflow-y-auto overflow-x-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 p-8 scroll-smooth custom-scrollbar border-t-4 ${currentLvlStyle.border} ${currentLvlStyle.glow}`}>
              
              <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#94a3b8 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}></div>

              {isRoadmapLoading ? (
                <div className="flex h-full items-center justify-center relative z-10"><Loader2 className="animate-spin text-primary" size={40} /></div>
              ) : stations.length === 0 ? (
                <div className="flex h-full items-center justify-center text-gray-400 font-bold relative z-10">Chưa có trạm học nào cho cấp độ này.</div>
              ) : (
                <div className="relative mx-auto flex w-full max-w-sm flex-col items-center py-6">
                  
                  <div className={`absolute top-16 bottom-16 left-1/2 w-0 -translate-x-1/2 border-l-[6px] border-dashed ${currentLvlStyle.track} z-0`}></div>

                  {stations.map((station, index) => {
                    const isCompleted = station.status === 'COMPLETED';
                    const isUnlocked = station.status === 'UNLOCKED';
                    const isLocked = station.status === 'LOCKED';

                    let btnColor = "bg-[#e5e5e5] shadow-[0_8px_0_#cecece] text-gray-400"; 
                    let icon = <Lock size={24} strokeWidth={3} />;

                    if (isCompleted) {
                      btnColor = "bg-yellow-400 shadow-[0_8px_0_#d97706] text-white hover:brightness-110 active:translate-y-2 active:shadow-none";
                      icon = <CheckCircle2 size={30} strokeWidth={3} />;
                    } else if (isUnlocked) {
                      // Trạm đang học bùng nổ theo đúng tone màu của Level đó
                      btnColor = `bg-gradient-to-br ${currentLvlStyle.from} ${currentLvlStyle.btnShadow} text-white hover:brightness-110 ${currentLvlStyle.activeBtnShadow} active:translate-y-2`;
                      icon = <Star size={30} strokeWidth={2.5} className="fill-white" />;
                    }

                    return (
                      <div 
                        key={station.id} 
                        className="relative z-10 flex flex-col items-center mb-14 w-full animate-fade-in"
                        style={{ transform: getZigZagTransform(index) }}
                      >
                        {/* Biển hiệu tên trạm (Signpost) */}
                        <div className={`mb-3 flex flex-col items-center justify-center rounded-2xl border px-4 py-2 shadow-sm transition-all duration-300 ${isLocked ? 'border-gray-200 bg-white/70 dark:border-gray-800 dark:bg-gray-900/80 opacity-50' : 'border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800'}`}>
                          <span className="text-sm font-black text-gray-900 dark:text-white tracking-wide">{station.title}</span>
                          <span className="text-[10px] font-bold text-gray-400">{station.description}</span>
                        </div>

                        {/* Nút Trạm Tròn 3D */}
                        <button
                          onClick={() => handleStationClick(station)}
                          className={`flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/20 transition-all duration-150 ${btnColor} cursor-pointer relative`}
                        >
                          {icon}
                          {isCompleted && (
                            <div className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md border-2 border-yellow-400">
                              <Crown size={12} className="text-yellow-500 fill-yellow-500" />
                            </div>
                          )}
                        </button>

                        {/* Hào quang nhấp nháy cho trạm hiện tại (Đồng bộ màu Level) */}
                        {isUnlocked && (
                          <div className={`absolute top-[4.2rem] -z-10 h-20 w-20尊 animate-ping rounded-full ${currentLvlStyle.bg} opacity-25`}></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            
            {isStatsLoading || !statsData ? (
              <div className="flex h-48 items-center justify-center bg-white rounded-[2rem] border"><Loader2 className="animate-spin text-primary" size={24} /></div>
            ) : (
              <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 flex flex-col items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 text-center w-full">Kho Từ Vựng Thu Thập</h3>
                
                {/* BIỂU ĐỒ TRÒN MINI CHUẨN */}
                <div className="relative h-32 w-full mt-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={[
                          { name: 'Mới', value: statsData.statusDistribution.NEW || 0, color: COLORS.NEW },
                          { name: 'Đang học', value: statsData.statusDistribution.LEARNING || 0, color: COLORS.LEARNING },
                          { name: 'Đã thuộc', value: statsData.statusDistribution.MASTERED || 0, color: COLORS.MASTERED }
                        ].filter(d => d.value > 0)} 
                        cx="50%" cy="50%" innerRadius={42} outerRadius={58} paddingAngle={4} dataKey="value" stroke="none"
                      >
                        {([
                          { name: 'Mới', value: statsData.statusDistribution.NEW || 0, color: COLORS.NEW },
                          { name: 'Đang học', value: statsData.statusDistribution.LEARNING || 0, color: COLORS.LEARNING },
                          { name: 'Đã thuộc', value: statsData.statusDistribution.MASTERED || 0, color: COLORS.MASTERED }
                        ].filter(d => d.value > 0)).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-black text-gray-900 dark:text-white">
                      {(statsData.statusDistribution.NEW || 0) + (statsData.statusDistribution.LEARNING || 0) + (statsData.statusDistribution.MASTERED || 0)}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/collection')}
                  className="mt-5 w-full rounded-2xl border-2 border-gray-100 bg-gray-50/50 py-3 text-xs font-black uppercase tracking-widest text-gray-500 transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary active:scale-95 cursor-pointer"
                >
                  Mở Kho Tàng Chi Tiết
                </button>
              </div>
            )}

            {/* BOX CHỈ SỐ NHANH (STREAK, CHÍNH XÁC, THỜI GIAN) */}
            {!isStatsLoading && statsData && (
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-950/30"><Flame size={18} className="animate-pulse" /></div>
                  <div>
                    <span className="block text-[10px] font-black uppercase text-gray-400">Streak</span>
                    <span className="text-base font-black text-gray-900 dark:text-white">{statsData.currentStreak} ngày</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-500 dark:bg-green-950/30"><Target size={18} /></div>
                  <div>
                    <span className="block text-[10px] font-black uppercase text-gray-400">Chính xác</span>
                    <span className="text-base font-black text-gray-900 dark:text-white">{statsData.accuracyPercentage}%</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-500 dark:bg-blue-950/30"><Clock size={18} /></div>
                  <div>
                    <span className="block text-[10px] font-black uppercase text-gray-400">Thời gian</span>
                    <span className="text-base font-black text-gray-900 dark:text-white">{statsData.minutesSpentToday} p</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-500 dark:bg-purple-950/30"><Layers size={18} /></div>
                  <div>
                    <span className="block text-[10px] font-black uppercase text-gray-400">Hôm nay</span>
                    <span className="text-base font-black text-gray-900 dark:text-white">{statsData.totalReviewedToday} mục</span>
                  </div>
                </div>
              </div>
            )}

            {/* KHU VỰC NHIỆM VỤ ÔN TẬP HÀNG NGÀY (THẺ ĐEN PREMUIUM) */}
            {!isStatsLoading && statsData && (
              <div className="space-y-4">
                <span className="block text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Nhiệm Vụ Đến Hạn</span>
                
                {/* Thẻ Ôn Kanji */}
                <div className="group relative flex items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-black p-5 shadow-md border border-gray-800 dark:from-gray-950 dark:to-gray-900">
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-xl font-black text-orange-500 border border-orange-500/20">🈴</div>
                    <div>
                      <h4 className="text-sm font-black text-white">Ôn Tập Kanji</h4>
                      <p className="text-[11px] font-bold text-gray-400 mt-0.5"><b className="text-orange-400">{statsData.kanjiDueToday}</b> chữ cần ôn</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/quiz?type=KANJI&total=${statsData.kanjiDueToday}`)}
                    disabled={statsData.kanjiDueToday === 0}
                    className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-[0_3px_0_#c2410c] transition-all hover:brightness-110 active:translate-y-0.5 active:shadow-none disabled:opacity-30 disabled:shadow-none cursor-pointer"
                  >
                    <PlayCircle size={18} />
                  </button>
                </div>

                {/* Thẻ Ôn Từ Vựng */}
                <div className="group relative flex items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-black p-5 shadow-md border border-gray-800 dark:from-gray-950 dark:to-gray-900">
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-xl font-black text-blue-500 border border-blue-500/20">📚</div>
                    <div>
                      <h4 className="text-sm font-black text-white">Ôn Tập Từ Vựng</h4>
                      <p className="text-[11px] font-bold text-gray-400 mt-0.5"><b className="text-blue-400">{statsData.vocabDueToday}</b> từ cần ôn</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/quiz?type=VOCAB&total=${statsData.vocabDueToday}`)}
                    disabled={statsData.vocabDueToday === 0}
                    className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-white shadow-[0_3px_0_#1d4ed8] bg-blue-500 transition-all hover:brightness-110 active:translate-y-0.5 active:shadow-none disabled:opacity-30 disabled:shadow-none cursor-pointer"
                  >
                    <PlayCircle size={18} />
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};