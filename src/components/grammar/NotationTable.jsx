import React from 'react';
import { Link } from 'react-router-dom';
import { Info, ExternalLink } from 'lucide-react';
import { GRAMMAR_NOTATIONS } from '../../constants/grammar';

export const NotationTable = () => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="flex items-center gap-2 text-lg font-bold text-primary">
          <Info size={20} />
          Bảng ký hiệu & Viết tắt
        </h3>
        
        <Link 
          to="/grammar/conjugation" 
          className="group flex w-fit items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-hover active:scale-95"
        >
          <span>Bảng chia Động/Tính từ</span>
          <ExternalLink size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {GRAMMAR_NOTATIONS.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
            <span className="flex h-8 min-w-[2.5rem] shrink-0 items-center justify-center rounded-lg bg-primary/10 px-2 text-sm font-black text-primary dark:bg-primary/20">
              {item.symbol}
            </span>
            <span className="mt-1.5 text-sm font-medium leading-snug text-gray-600 dark:text-gray-400">
              {item.meaning}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};