import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

/**
 * @param {number} currentPage 
 * @param {number} totalPages 
 * @param {function} onPageChange 
 */
export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null; 

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(1)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
        aria-label="Trang đầu"
      >
        <ChevronsLeft size={18} />
      </button>

      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
        aria-label="Trang trước"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="flex h-10 items-center justify-center rounded-xl bg-gray-50 px-4 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
        Trang <span className="mx-1 text-primary">{currentPage}</span> / {totalPages}
      </div>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
        aria-label="Trang tiếp"
      >
        <ChevronRight size={18} />
      </button>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(totalPages)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
        aria-label="Trang cuối"
      >
        <ChevronsRight size={18} />
      </button>
    </div>
  );
};