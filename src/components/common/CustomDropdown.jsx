import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export const CustomDropdown = ({ value, options, onChange, placeholder, className = "", optionLabelKey = "name", optionValueKey = "id" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDirection, setOpenDirection] = useState('bottom'); 
  const dropdownRef = useRef(null);

  // 🌟 ĐẢM BẢO OPTIONS LUÔN LÀ MẢNG (TRÁNH CRASH TRẮNG TRANG)
  const safeOptions = Array.isArray(options) ? options : [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 250) {
        setOpenDirection('top');
      } else {
        setOpenDirection('bottom');
      }
    }
  }, [isOpen]);

  // Tìm option đang được chọn an toàn
  const selectedOption = safeOptions.find(opt => opt[optionValueKey] === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between rounded-2xl border bg-gray-100/50 px-5 py-4 font-bold cursor-pointer transition-all duration-300
          ${isOpen ? 'border-primary ring-4 ring-primary/10 bg-white dark:bg-gray-900' : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800/50'}
          dark:text-white`}
      >
        <span className={selectedOption ? 'text-gray-900 dark:text-white' : 'text-gray-400'}>
          {selectedOption ? selectedOption[optionLabelKey] : placeholder}
        </span>
        <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${isOpen && openDirection === 'bottom' ? 'rotate-180 text-primary' : isOpen && openDirection === 'top' ? 'rotate-0 text-primary' : ''}`} />
      </div>

      <div className={`absolute left-0 right-0 z-[9999] ${openDirection === 'bottom' ? 'top-full mt-2 origin-top' : 'bottom-full mb-2 origin-bottom'} rounded-2xl bg-white p-2 shadow-2xl border border-gray-100 transition-all duration-200 dark:bg-gray-800 dark:border-gray-700
        ${isOpen ? 'scale-y-100 opacity-100 visible' : 'scale-y-95 opacity-0 invisible'}
      `}>
        <div className="max-h-[240px] overflow-y-auto custom-scrollbar overscroll-contain">
          <div 
            onClick={() => { onChange(''); setIsOpen(false); }}
            className={`flex items-center justify-between rounded-xl px-4 py-3 cursor-pointer transition-colors ${!value ? 'bg-primary/10 text-primary font-black' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50'}`}
          >
            {placeholder}
            {!value && <Check size={18} strokeWidth={3} />}
          </div>
          
          {/* Lặp qua mảng an toàn */}
          {safeOptions.map((opt) => (
            <div 
              key={opt[optionValueKey]}
              onClick={() => { onChange(opt[optionValueKey]); setIsOpen(false); }}
              className={`flex items-center justify-between rounded-xl px-4 py-3 mt-1 cursor-pointer transition-colors ${value === opt[optionValueKey] ? 'bg-primary/10 text-primary font-black' : 'text-gray-600 font-bold hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50'}`}
            >
              {opt[optionLabelKey]}
              {value === opt[optionValueKey] && <Check size={18} strokeWidth={3} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};