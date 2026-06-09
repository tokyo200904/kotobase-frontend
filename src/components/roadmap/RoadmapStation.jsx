import React from 'react';
import { Lock, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const RoadmapStation = ({ station, onClick }) => {
  const { user } = useAuth();
  
  const isFreeStation = station.level === 'N5';
  const isLocked = !isFreeStation && !user?.premium;

  return (
    <div 
      onClick={() => isLocked ? onClick('locked') : onClick('open')}
      className={`relative flex flex-col items-center justify-center cursor-pointer transition-all duration-300 
        ${isLocked ? 'opacity-70 grayscale hover:scale-95' : 'hover:scale-110 hover:shadow-2xl'}`}
    >
      {/* Icon Trạm */}
      <div className={`h-16 w-16 rounded-2xl flex items-center justify-center border-4 
        ${isLocked ? 'bg-gray-200 border-gray-300' : 'bg-primary border-white shadow-lg'}`}>
        {isLocked ? <Lock className="text-gray-500" /> : <Check className="text-white" />}
      </div>
      
      <span className="mt-2 font-black text-sm">{station.name}</span>
    </div>
  );
};