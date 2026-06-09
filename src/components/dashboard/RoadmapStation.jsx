import React from 'react';
import { Lock, CheckCircle2, Star, Crown } from 'lucide-react';
import { getZigZagTransform } from '../../constants/roadmapConfig';

export const RoadmapStation = ({ station, index, currentLvlStyle, isPremiumLocked, onClick }) => {
  const displayStatus = isPremiumLocked ? 'PREMIUM_LOCKED' : station.status;

  const isCompleted = displayStatus === 'COMPLETED';
  const isUnlocked = displayStatus === 'UNLOCKED';
  const isProgressionLocked = displayStatus === 'LOCKED';
  const isVipLocked = displayStatus === 'PREMIUM_LOCKED'; 

  let btnColor = "bg-[#e5e5e5] shadow-[0_8px_0_#cecece] text-gray-400"; 
  let icon = <Lock size={24} strokeWidth={3} />;

  if (isCompleted) {
    btnColor = "bg-yellow-400 shadow-[0_8px_0_#d97706] text-white hover:brightness-110 active:translate-y-2 active:shadow-none";
    icon = <CheckCircle2 size={30} strokeWidth={3} />;
  } else if (isUnlocked) {
    btnColor = `bg-gradient-to-br ${currentLvlStyle.from} ${currentLvlStyle.btnShadow} text-white hover:brightness-110 ${currentLvlStyle.activeBtnShadow} active:translate-y-2`;
    icon = <Star size={30} strokeWidth={2.5} className="fill-white" />;
  } else if (isVipLocked) {
    btnColor = "bg-yellow-50 shadow-[0_8px_0_#fef08a] text-yellow-500 hover:bg-yellow-100 hover:text-yellow-600 border-2 border-yellow-200 active:translate-y-2 active:shadow-none";
    icon = <Crown size={24} strokeWidth={3} />;
  }

  return (
    <div 
      className="relative z-10 flex flex-col items-center mb-14 w-full animate-fade-in"
      style={{ transform: getZigZagTransform(index) }}
    >
      <div className={`mb-3 flex flex-col items-center justify-center rounded-2xl border px-4 py-2 shadow-sm transition-all duration-300 ${(isProgressionLocked || isVipLocked) ? 'border-gray-200 bg-white/70 opacity-60 dark:border-gray-800 dark:bg-gray-900/80' : 'border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800'}`}>
        <span className="text-sm font-black text-gray-900 dark:text-white">{station.title}</span>
        <span className="text-[10px] font-bold text-gray-400">
          {isVipLocked ? 'Yêu cầu tài khoản PRO' : station.description}
        </span>
      </div>

      <button
        onClick={() => onClick(station, isPremiumLocked)}
        className={`flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/20 transition-all duration-150 ${btnColor} cursor-pointer relative`}
      >
        {icon}
        {isCompleted && (
          <div className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md border-2 border-yellow-400">
            <Crown size={12} className="text-yellow-500 fill-yellow-500" />
          </div>
        )}
      </button>

      {isUnlocked && (
        <div className={`absolute top-[4.2rem] -z-10 h-20 w-20 animate-ping rounded-full ${currentLvlStyle.bg} opacity-25`}></div>
      )}
    </div>
  );
};