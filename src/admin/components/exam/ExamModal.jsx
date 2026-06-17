import React, { useState, useEffect } from 'react';
import { X, Loader2, PlusCircle, Settings, Trash2, Plus } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { CustomDropdown } from '../../../components/common/CustomDropdown';

const SECTION_TYPES = [
  { id: 'vocabulary', name: 'Từ vựng (Vocabulary)' },
  { id: 'grammar_reading', name: 'Ngữ pháp & Đọc hiểu (Grammar & Reading)' },
  { id: 'listening', name: 'Nghe hiểu (Listening)' },
  { id: 'vocabulary_grammar_reading', name: 'Từ vựng, Ngữ pháp & Đọc hiểu (All-in-one)' }
];

export const ExamModal = ({ isOpen, onClose, editId, onSuccess, levels }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialForm = {
    title: '', totalQuestions: 0, maxScore: 0, durationMinutes: 0, passingScore: 0, isPublished: false, levelId: '', sections: []
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (editId && isOpen) {
      const fetchDetail = async () => {
        try {
          const res = await adminService.getExamById(editId);
          const d = res.data || res;
          setFormData({
            title: d.title || '',
            totalQuestions: d.totalQuestions || 0,
            maxScore: d.maxScore || 0,
            durationMinutes: d.durationMinutes || 0,
            passingScore: d.passingScore || 0,
            isPublished: d.isPublished ?? false,
            levelId: d.levelId || '',
            sections: d.sections || []
          });
        } catch (err) { alert('Lỗi tải thông tin đề thi!'); triggerClose(); }
      };
      fetchDetail();
    } else if (isOpen) { 
      setFormData(initialForm); 
    }
  }, [editId, isOpen]);

  const triggerClose = () => { setIsClosing(true); setTimeout(() => { onClose(); setIsClosing(false); }, 300); };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              ['totalQuestions', 'durationMinutes', 'passingScore'].includes(name) ? (value ? parseInt(value, 10) : 0) :
              name === 'maxScore' ? (value ? parseFloat(value) : 0) : value
    }));
  };

  const handleSectionChange = (idx, key, value) => {
    const newSec = [...formData.sections];
    newSec[idx][key] = ['durationMinutes', 'minPassingScore', 'totalQuestions', 'displayOrder'].includes(key) ? (value ? parseInt(value, 10) : 0) :
                       key === 'maxScore' ? (value ? parseFloat(value) : 0) : value;
    setFormData(prev => ({ ...prev, sections: newSec }));
  };

  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, { sectionName: '', sectionType: 'vocabulary', durationMinutes: 0, minPassingScore: 0, totalQuestions: 0, maxScore: 0, displayOrder: prev.sections.length + 1 }]
    }));
  };

  const removeSection = (idx) => {
    const newSec = [...formData.sections]; newSec.splice(idx, 1); setFormData(prev => ({ ...prev, sections: newSec }));
  };

  const currentSumDuration = formData.sections.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
  const currentSumScore = formData.sections.reduce((sum, s) => sum + (s.maxScore || 0), 0);
  const currentSumQuestions = formData.sections.reduce((sum, s) => sum + (s.totalQuestions || 0), 0); // 🌟 MỚI CẬP NHẬT

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    if (!formData.title.trim()) { alert("⚠️ Vui lòng nhập Tên Đề Thi!"); return; }
    if (!formData.levelId) { alert("⚠️ Vui lòng chọn Cấp độ JLPT!"); return; }
    if (formData.sections.length === 0) { alert("⚠️ Đề thi bắt buộc phải có ít nhất 1 Phần thi con (Section)!"); return; }

    for (let i = 0; i < formData.sections.length; i++) {
      const sec = formData.sections[i];
      if (!sec.sectionName.trim()) { alert(`⚠️ Vui lòng nhập tên cho phần thi thứ ${i + 1}!`); return; }
      if (!sec.sectionType) { alert(`⚠️ Phần thi '${sec.sectionName}' chưa chọn Loại kỹ năng!`); return; }
    }

    if (formData.durationMinutes !== currentSumDuration) {
      alert(`⛔ Lỗi Logic Thời gian: Tổng khai báo (${formData.durationMinutes}p) khác Tổng các phần (${currentSumDuration}p)!`);
      return;
    }

    if (formData.maxScore !== currentSumScore) {
      alert(`⛔ Lỗi Logic Điểm số: Tổng khai báo (${formData.maxScore}đ) khác Tổng các phần (${currentSumScore}đ)!`);
      return;
    }

    if (formData.totalQuestions !== currentSumQuestions) {
      alert(`⛔ Lỗi Logic Số lượng câu: Tổng khai báo (${formData.totalQuestions} câu) KHÔNG KHỚP với tổng các phần thi cộng lại (${currentSumQuestions} câu)!`);
      return;
    }

    setIsSubmitting(true);
    try {
      if (editId) {
        await adminService.updateExam(editId, formData);
        alert("✅ Cập nhật cấu trúc đề thi thành công!");
      } else {
        await adminService.createExam(formData);
        alert("🎉 Tạo đề thi mới thành công!");
      }
      onSuccess(); 
      triggerClose();
    } catch (err) { alert(`Lỗi API: ${err.message}`); } 
    finally { setIsSubmitting(false); }
  };

  if (!isOpen && !isClosing) return null;
  const inputClass = "w-full rounded-2xl border border-gray-200 bg-gray-100/50 px-5 py-4 font-bold text-gray-900 outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white";

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-md p-4 transition-all duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      <form onSubmit={handleSubmit} className={`bg-[#f8fafc] dark:bg-gray-950 w-full max-w-5xl h-[95vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-gray-200/50 dark:border-gray-800 transition-all duration-300 ${isClosing ? 'scale-95 opacity-0 translate-y-4' : 'scale-100 opacity-100 translate-y-0'}`}>
        
        <div className="px-10 py-6 border-b border-gray-200/50 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between z-30">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center"><Settings size={24} strokeWidth={2.5}/></div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">{editId ? 'Cấu hình Khung Đề thi' : 'Tạo Đề thi Mới'}</h2>
          </div>
          <button type="button" onClick={triggerClose} className="p-3 bg-gray-50 hover:bg-gray-200 text-gray-400 rounded-2xl dark:bg-gray-800 dark:hover:bg-gray-700"><X size={24}/></button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8 bg-gray-50/50 dark:bg-gray-950/50 pb-40">
          
          <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative">
             <h3 className="font-black text-lg text-gray-900 dark:text-white mb-6">1. Thông tin tổng quan</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="md:col-span-2">
                 <label className="block text-[11px] font-black uppercase text-gray-400 mb-2">Tên Đề Thi (*)</label>
                 <input name="title" value={formData.title} onChange={handleInputChange} required placeholder="Vd: Đề thi thử JLPT N3 - Số 1" className={`${inputClass} text-xl`} />
               </div>
               <div className="relative z-30">
                 <label className="block text-[11px] font-black uppercase text-gray-400 mb-2">Cấp độ (*)</label>
                 <CustomDropdown value={formData.levelId} options={levels} onChange={(val)=>setFormData(p=>({...p, levelId:val}))} placeholder="Chọn Level" optionLabelKey="levelName" />
               </div>

               <div>
                  <label className="block text-[11px] font-black uppercase text-gray-400 mb-2">Tổng số câu hỏi</label>
                  <input 
                    type="number" name="totalQuestions" value={formData.totalQuestions} onChange={handleInputChange} 
                    className={`${inputClass} ${formData.totalQuestions !== currentSumQuestions ? 'border-red-400 bg-red-50 text-red-600' : 'border-green-400 bg-green-50 text-green-700'}`} 
                  />
                  <p className={`text-[10px] font-black mt-1.5 uppercase ${formData.totalQuestions !== currentSumQuestions ? 'text-red-500' : 'text-green-600'}`}>
                    {formData.totalQuestions !== currentSumQuestions ? `⚠️ Phải bằng ${currentSumQuestions} câu` : '✅ Đã khớp số lượng'}
                  </p>
               </div>

               <div>
                  <label className="block text-[11px] font-black uppercase text-gray-400 mb-2">Thời gian tổng (Phút)</label>
                  <input type="number" name="durationMinutes" value={formData.durationMinutes} onChange={handleInputChange} className={`${inputClass} ${formData.durationMinutes !== currentSumDuration ? 'border-red-400 bg-red-50 text-red-600' : 'border-green-400 bg-green-50 text-green-700'}`} />
                  <p className={`text-[10px] font-black mt-1.5 uppercase ${formData.durationMinutes !== currentSumDuration ? 'text-red-500' : 'text-green-600'}`}>
                    {formData.durationMinutes !== currentSumDuration ? `⚠️ Phải bằng ${currentSumDuration}p` : '✅ Đã khớp thời gian'}
                  </p>
               </div>

               <div>
                  <label className="block text-[11px] font-black uppercase text-gray-400 mb-2">Điểm tối đa tổng</label>
                  <input type="number" name="maxScore" value={formData.maxScore} onChange={handleInputChange} className={`${inputClass} ${formData.maxScore !== currentSumScore ? 'border-red-400 bg-red-50 text-red-600' : 'border-green-400 bg-green-50 text-green-700'}`} />
                  <p className={`text-[10px] font-black mt-1.5 uppercase ${formData.maxScore !== currentSumScore ? 'text-red-500' : 'text-green-600'}`}>
                    {formData.maxScore !== currentSumScore ? `⚠️ Phải bằng ${currentSumScore}đ` : '✅ Đã khớp điểm số'}
                  </p>
               </div>
               <div><label className="block text-[11px] font-black uppercase text-gray-400 mb-2">Điểm đỗ tổng (Passing)</label><input type="number" name="passingScore" value={formData.passingScore} onChange={handleInputChange} className={inputClass} /></div>
             </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative z-20">
             <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-lg text-gray-900 dark:text-white">2. Các phần thi cấu thành (Sections)</h3>
             </div>
             
             <div className="space-y-6 mb-6">
               {formData.sections.map((sec, idx) => (
                 <div key={idx} className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 relative">
                   <button type="button" onClick={() => removeSection(idx)} className="absolute -right-3 -top-3 h-8 w-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-md z-30"><X size={16}/></button>
                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                     <div className="sm:col-span-2"><label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Tên phần thi con</label><input value={sec.sectionName} onChange={(e) => handleSectionChange(idx, 'sectionName', e.target.value)} placeholder="Vd: Chữ hán & Từ vựng" className={`${inputClass} py-3`} /></div>
                     <div className="relative z-[25]"><label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Loại kỹ năng (*)</label><CustomDropdown value={sec.sectionType} options={SECTION_TYPES} onChange={(val)=>handleSectionChange(idx, 'sectionType', val)} placeholder="Chọn loại" optionLabelKey="name" className="w-full" /></div>
                     <div><label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Thứ tự thi</label><input type="number" value={sec.displayOrder} onChange={(e) => handleSectionChange(idx, 'displayOrder', e.target.value)} className={`${inputClass} py-3`} /></div>
                     <div><label className="block text-[10px] font-black uppercase text-gray-400 mb-1">TG làm (Phút)</label><input type="number" value={sec.durationMinutes} onChange={(e) => handleSectionChange(idx, 'durationMinutes', e.target.value)} className={`${inputClass} py-3`} /></div>
                     <div><label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Số lượng câu</label><input type="number" value={sec.totalQuestions} onChange={(e) => handleSectionChange(idx, 'totalQuestions', e.target.value)} className={`${inputClass} py-3`} /></div>
                     <div><label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Điểm tối đa</label><input type="number" value={sec.maxScore} onChange={(e) => handleSectionChange(idx, 'maxScore', e.target.value)} className={`${inputClass} py-3`} /></div>
                     <div><label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Điểm liệt phần này</label><input type="number" value={sec.minPassingScore} onChange={(e) => handleSectionChange(idx, 'minPassingScore', e.target.value)} className={`${inputClass} py-3 text-red-500 font-bold`} /></div>
                   </div>
                 </div>
               ))}
             </div>
             <button type="button" onClick={addSection} className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-500 font-black hover:bg-primary/5 hover:text-primary transition-all flex items-center justify-center gap-2"><Plus size={20}/> Thêm Phần Thi (Section)</button>
          </div>

        </div>

        <div className="px-10 py-6 border-t border-gray-200/50 dark:border-gray-800 bg-white dark:bg-gray-900 flex justify-end gap-4 z-20 shadow-lg">
          <button type="button" onClick={triggerClose} className="px-8 py-4 rounded-2xl font-black text-gray-500 bg-gray-50 hover:bg-gray-200">Hủy</button>
          <button type="submit" disabled={isSubmitting} className="flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-white bg-primary shadow-[0_6px_0_rgb(0,0,0,0.15)] hover:brightness-110 active:translate-y-1.5 transition-all disabled:opacity-50 disabled:grayscale">
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <PlusCircle size={20}/>} {editId ? 'Lưu cấu trúc đề' : 'Tạo Đề Thi'}
          </button>
        </div>
      </form>
    </div>
  );
};