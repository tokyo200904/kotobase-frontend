import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Quote } from "lucide-react";
import { KanjiStrokeWriter } from "./KanjiStrokeWriter";
import { AudioButton } from "../common/AudioButton";

// ============================================================================
// 1. SUB-COMPONENT: KHU VỰC ÂM ĐỌC
// ============================================================================
const ReadingSection = ({ title, items, type }) => {
  if (!items || items.length === 0) return null;
  
  const isOnyomi = type === 'ON';
  const wrapperClass = isOnyomi 
    ? "rounded-xl border border-red-100 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-950/20"
    : "rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-950/20";
  const titleClass = isOnyomi
    ? "mb-2 block text-xs font-bold uppercase text-red-600 dark:text-red-400"
    : "mb-2 block text-xs font-bold uppercase text-blue-600 dark:text-blue-400";

  return (
    <div className={wrapperClass}>
      <span className={titleClass}>{title}</span>
      <div className="flex flex-wrap gap-2">
        {items.map((item, idx) => (
          <span
            key={idx}
            className="flex items-center gap-1 rounded-md border border-gray-200 bg-white pl-3 pr-1 py-1 text-sm font-bold text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            {item.reading}
            <span className="ml-1 text-xs font-medium text-gray-500 dark:text-gray-400">
              ({item.romaji})
            </span>
            <AudioButton text={item.reading} size={16} />
          </span>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 2. SUB-COMPONENT: DANH SÁCH VÍ DỤ MINH HỌA
// ============================================================================
const ExamplesList = ({ examples }) => {
  if (!examples || examples.length === 0) return null;

  return (
    <div className="mt-8 border-t border-gray-100 pt-6 dark:border-gray-800 animate-fade-in">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-400">
        <Quote size={18} className="text-primary" /> Ví dụ ứng dụng
      </h3>
      <div className="flex flex-col gap-3">
        {examples.map((ex) => (
          <div 
            key={ex.id} 
            className="flex items-start justify-between gap-4 rounded-2xl border border-gray-100 bg-gray-50/70 p-4 transition-colors hover:border-primary/30 hover:bg-white dark:border-gray-800 dark:bg-gray-800/40 dark:hover:bg-gray-800"
          >
            <div>
              <p className="text-base font-bold text-gray-900 dark:text-gray-100">
                {ex.content}
              </p>
              <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                {ex.meaning}
              </p>
            </div>
            <div className="mt-0.5 shrink-0">
              <AudioButton text={ex.content} size={20} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 3. MAIN COMPONENT: MODAL CHI TIẾT KANJI (Đã loại bỏ chức năng Lưu)
// ============================================================================
export const KanjiDetailModal = ({ isOpen, onClose, kanji, isLoading }) => {

  // Khóa cuộn màn hình ở dưới khi bật Modal
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>

      <div className="custom-scrollbar relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-y-auto rounded-[2rem] bg-white shadow-2xl dark:border dark:border-gray-800 dark:bg-gray-900 animate-fade-in">
        
        {/* THANH CÔNG CỤ (Chỉ còn lại nút Đóng) */}
        <div className="sticky top-0 z-10 flex items-center justify-end bg-white/80 p-4 backdrop-blur-md dark:bg-gray-900/80">
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500 dark:bg-gray-800 dark:hover:bg-red-900/30"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <div className="p-6 md:px-8 md:pb-8 md:pt-0">
          {isLoading || !kanji ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 animate-pulse py-4">
              <div className="flex flex-col items-center space-y-4 border-r-0 md:border-r border-gray-100 dark:border-gray-800">
                <div className="h-40 w-40 rounded-2xl bg-gray-200 dark:bg-gray-800"></div>
              </div>
              <div className="space-y-4">
                <div className="h-8 w-32 rounded bg-gray-200 dark:bg-gray-800 mb-6"></div>
                <div className="h-24 w-full rounded-xl bg-gray-200 dark:bg-gray-800"></div>
                <div className="h-24 w-full rounded-xl bg-gray-200 dark:bg-gray-800"></div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                
                {/* Cột trái: Vẽ nét */}
                <div className="flex flex-col items-center justify-start border-b border-gray-100 pb-6 md:border-b-0 md:border-r md:pb-0 dark:border-gray-800">
                  <div className="mb-4 rounded-lg bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    Cấp độ {kanji.level}
                  </div>
                  <KanjiStrokeWriter character={kanji.characters} />
                </div>

                {/* Cột phải: Thông số, Âm đọc */}
                <div className="flex flex-col justify-start">
                  <div className="mb-6 flex flex-wrap items-baseline gap-3 border-b border-gray-100 pb-4 dark:border-gray-800">
                    <h2 className="text-5xl font-black text-gray-900 dark:text-white leading-none">
                      {kanji.characters}
                    </h2>

                    {kanji.han && (
                      <span className="text-2xl font-black text-primary uppercase tracking-wide">
                        [{kanji.han}]
                      </span>
                    )}

                    <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300 capitalize">
                      - {kanji.meaning}
                    </h3>
                  </div>

                  <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                    Số nét:{" "}
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {kanji.strokeCount}
                    </span>
                  </p>

                  <div className="space-y-4">
                    <ReadingSection title="Onyomi (Âm Hán)" items={kanji.on} type="ON" />
                    <ReadingSection title="Kunyomi (Âm Nhật)" items={kanji.kun} type="KUN" />
                  </div>
                </div>
              </div>

              {/* KHU VỰC VÍ DỤ MINH HỌA */}
              <ExamplesList examples={kanji.examples} />
            </>
          )}
        </div>
      </div>
    </div>
  );

  let portalRoot = document.getElementById('portal-root');
  if (!portalRoot) portalRoot = document.body;
  
  return createPortal(modalContent, portalRoot);
};