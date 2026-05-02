import React from 'react';
import { Link } from 'react-router-dom';
import { Info, ExternalLink } from 'lucide-react';
import { GRAMMAR_NOTATIONS } from '../../constants/grammar';

export const NotationTable = () => {
  return (
    <div className="mb-8 rounded-2xl border border-blue-100 bg-blue-50/50 p-5 dark:border-blue-900/30 dark:bg-blue-950/20">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-bold text-blue-800 dark:text-blue-300">
          <Info size={20} />
          Bảng ký hiệu & Viết tắt
        </h3>
        
        <Link 
          to="/grammar/conjugation" 
          className="group flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-blue-600 shadow-sm transition-all hover:bg-blue-600 hover:text-white dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-blue-500 dark:hover:text-white"
        >
          <span>Bảng chia Động/Tính từ</span>
          <ExternalLink size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {GRAMMAR_NOTATIONS.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 rounded-xl bg-white p-2.5 shadow-sm dark:bg-gray-900">
            <span className="flex h-8 min-w-[2rem] items-center justify-center rounded-lg bg-blue-100 px-2 text-sm font-black text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
              {item.symbol}
            </span>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {item.meaning}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};