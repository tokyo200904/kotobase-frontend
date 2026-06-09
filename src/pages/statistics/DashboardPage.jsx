import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map as MapIcon, Sparkles, Compass, Loader2 } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useDashboard } from '../../hooks/useDashboard';
import { LEVEL_CONFIGS } from '../../constants/roadmapConfig';

import { DashboardStats } from '../../components/dashboard/DashboardStats';
import { RoadmapStation } from '../../components/dashboard/RoadmapStation';
import { PremiumModal } from '../../components/common/PremiumModal';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user, setAuthModalOpen } = useAuth();
  
  const isAuthenticated = !!localStorage.getItem('token');

  const [activeType, setActiveType] = useState('KANJI');
  const [activeLevel, setActiveLevel] = useState(1);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  const currentLvlStyle = LEVEL_CONFIGS[activeLevel];


  const isPremiumLocked = activeLevel !== 1 && !user?.premium;

  const { statsData, isStatsLoading, stations, isRoadmapLoading } = useDashboard(isAuthenticated, activeLevel, activeType);

  const handleStationClick = (station, isPremiumLockedLocal) => {
    if (isPremiumLockedLocal) {
      setIsPremiumModalOpen(true);
      return;
    }

    if (station.status === 'LOCKED') {
      addToast('Hãy hoàn thành các trạm trước đó để mở khóa!', 'error');
      return;
    }
    
    navigate(`/roadmap/station/${station.id}`);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex h-[calc(100vh-6rem)] w-full items-center justify-center bg-gray-50/50 px-4 text-center dark:bg-gray-950/50">
        <div className="flex flex-col items-center rounded-[2.5rem] border border-gray-100 bg-white p-10 shadow-2xl max-w-lg dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary opacity-20"></div>
            <MapIcon size={40} className="relative z-10" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Lộ Trình KotoBase</h1>
          <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">
            Khám phá lộ trình học tiếng Nhật thông minh chia trạm kiểm tra. Theo dõi sát sao chuỗi liên tục (Streak) và mức độ chính xác của bạn.
          </p>
          <button 
            onClick={() => setAuthModalOpen(true)} 
            className="mt-8 w-full rounded-2xl bg-primary py-4 font-black text-white shadow-[0_6px_0_rgb(37,99,235)] transition-all hover:brightness-110 active:translate-y-1.5 active:shadow-none"
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
            
            <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-900">
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
                <button 
                  onClick={() => setActiveType('KANJI')} 
                  className={`rounded-xl px-5 py-2 text-xs font-black uppercase transition-all ${activeType === 'KANJI' ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                >
                  🈴 Kanji
                </button>
                <button 
                  onClick={() => setActiveType('VOCAB')} 
                  className={`rounded-xl px-5 py-2 text-xs font-black uppercase transition-all ${activeType === 'VOCAB' ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                >
                  📚 Từ vựng
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="grid grid-cols-5 gap-2">
                
                {[1, 2, 3, 4, 5].map(dbId => {
                  
                  const cfg = LEVEL_CONFIGS[dbId];
                  const isCurrent = activeLevel === dbId;
                  return (
                    <button 
                      key={dbId} 
                      onClick={() => setActiveLevel(dbId)} 
                      className={`group flex flex-col items-center justify-center rounded-2xl py-3 border-2 transition-all duration-300 ${isCurrent ? `border-transparent bg-gradient-to-br ${cfg.from} text-white shadow-lg ${cfg.shadow} scale-100 font-black` : 'border-gray-100 bg-gray-50/50 text-gray-400 hover:bg-white hover:border-gray-200 dark:border-gray-800 dark:bg-gray-800/50 dark:hover:bg-gray-800'}`}
                    >
                      <span className="text-lg font-black">{cfg.badge}</span>
                      <span className={`text-[9px] font-bold uppercase tracking-wider hidden sm:block ${isCurrent ? 'text-white/80' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`}>
                        {dbId === 1 || dbId === 5 ? 'JLPT' : 'Level'}
                      </span>
                    </button>
                  );
                })}
                
              </div>
            </div>

            <div className={`relative h-[530px] w-full overflow-y-auto overflow-x-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 p-8 scroll-smooth custom-scrollbar border-t-4 ${currentLvlStyle.border} ${currentLvlStyle.glow}`}>
              <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#94a3b8 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}></div>
              
              {isRoadmapLoading ? (
                <div className="flex h-full items-center justify-center relative z-10">
                  <Loader2 className="animate-spin text-primary" size={40} />
                </div>
              ) : stations.length === 0 ? (
                <div className="flex h-full items-center justify-center text-gray-400 font-bold relative z-10">
                  Chưa có trạm học nào cho cấp độ này.
                </div>
              ) : (
                <div className="relative mx-auto flex w-full max-w-sm flex-col items-center py-6">
                  <div className={`absolute top-16 bottom-16 left-1/2 w-0 -translate-x-1/2 border-l-[6px] border-dashed ${currentLvlStyle.track} z-0`}></div>
                  
                  {stations.map((station, index) => (
                    <RoadmapStation 
                      key={station.id} 
                      station={station} 
                      index={index} 
                      currentLvlStyle={currentLvlStyle} 
                      isPremiumLocked={isPremiumLocked} 
                      onClick={handleStationClick} 
                    />
                  ))}
                </div>
              )}
            </div>

          </div>

          <DashboardStats statsData={statsData} isLoading={isStatsLoading} />

        </div>
      </div>

      <PremiumModal isOpen={isPremiumModalOpen} onClose={() => setIsPremiumModalOpen(false)} />

    </div>
  );
};