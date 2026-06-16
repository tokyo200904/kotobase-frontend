import React, { useState, useEffect } from 'react';
import { X, Plus, Loader2, Edit, PlusCircle, Layers, AlignLeft, Gamepad2, Trash2 } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { CustomDropdown } from '../../../components/common/CustomDropdown';

export const GrammarModal = ({ isOpen, onClose, editId, onSuccess, levels }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [lessons, setLessons] = useState([]);

  const initialForm = { title: '', structure: '', meaning: '', usages: '', note: '', levelId: '', lessonId: '', examples: [], exercises: [] };
  const [formData, setFormData] = useState(initialForm);

  // Load chi tiết nếu đang Edit
  useEffect(() => {
    if (editId && isOpen) {
      const fetchDetail = async () => {
        try {
          const detailRes = await adminService.getGrammarById(editId);
          const detail = detailRes.data || detailRes;
          setFormData({
            title: detail.title, structure: detail.structure, meaning: detail.meaning, 
            usages: detail.usages || '', note: detail.note || '', 
            levelId: detail.levelId, lessonId: detail.lessonId, 
            examples: detail.examples || [], exercises: detail.exercises || []
          });
        } catch (err) { alert('Lỗi tải chi tiết!'); triggerClose(); }
      };
      fetchDetail();
    } else {
      setFormData(initialForm);
      setActiveTab(1);
    }
  }, [editId, isOpen]);

  // Tải danh sách Lesson khi LevelId thay đổi
  useEffect(() => {
    if (!formData.levelId) { setLessons([]); return; }
    const fetchLessons = async () => {
      try {
        const res = await adminService.getCompactLessonsByLevel(formData.levelId, 'GRAMMAR');
        setLessons(res.data || res || []);
      } catch (err) { console.error(err); }
    };
    fetchLessons();
  }, [formData.levelId]);

  // Handlers
  const triggerClose = () => {
    setIsClosing(true);
    setTimeout(() => { onClose(); setIsClosing(false); }, 300);
  };

  const handleInputChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  const handleDropdownChange = (name, value) => { 
    setFormData(prev => ({ ...prev, [name]: value })); 
    if (name === 'levelId') setFormData(prev => ({...prev, lessonId: ''})); 
  };
  const handleArrayChange = (field, index, key, value) => { 
    const newArray = [...formData[field]]; newArray[index][key] = value; setFormData(prev => ({ ...prev, [field]: newArray })); 
  };
  const addArrayRow = (field, emptyObj) => { setFormData(prev => ({ ...prev, [field]: [...prev[field], emptyObj] })); };
  const removeArrayRow = (field, index) => { const newArray = [...formData[field]]; newArray.splice(index, 1); setFormData(prev => ({ ...prev, [field]: newArray })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.structure || !formData.meaning || !formData.levelId || !formData.lessonId) {
      alert("⚠️ Vui lòng điền các trường bắt buộc (*) ở Tab 1!");
      setActiveTab(1); return;
    }
    
    setIsSubmitting(true);
    try {
      if (editId) await adminService.updateGrammar(editId, formData);
      else await adminService.createGrammar(formData);
      onSuccess(); // Gọi hàm tải lại bảng ở Component Cha
      triggerClose();
    } catch (err) { alert(`Lỗi: ${err.message}`); } finally { setIsSubmitting(false); }
  };

  if (!isOpen && !isClosing) return null;

  const inputClass = "w-full rounded-2xl border border-gray-200 bg-gray-100/50 px-5 py-4 font-bold text-gray-900 outline-none transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:focus:bg-gray-900";

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-md p-4 sm:p-6 transition-all duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      <div className={`bg-[#f8fafc] dark:bg-gray-950 w-full max-w-6xl h-[95vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-gray-200/50 dark:border-gray-800 transition-all duration-300 ${isClosing ? 'scale-95 opacity-0 translate-y-4' : 'scale-100 opacity-100 translate-y-0'}`}>
        
        {/* Header Modal */}
        <div className="px-10 py-6 border-b border-gray-200/50 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0"><Edit size={24} strokeWidth={2.5} /></div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white line-clamp-1">{editId ? `Cập nhật: ${formData.title}` : 'Biên soạn Ngữ pháp Mới'}</h2>
          </div>

          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl">
            <button onClick={() => setActiveTab(1)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 1 ? 'bg-white text-primary shadow-sm dark:bg-gray-900' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}><Layers size={16} strokeWidth={2.5}/> 1. Kiến thức</button>
            <button onClick={() => setActiveTab(2)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 2 ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-900' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}><AlignLeft size={16} strokeWidth={2.5}/> 2. Ví dụ</button>
            <button onClick={() => setActiveTab(3)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 3 ? 'bg-white text-orange-600 shadow-sm dark:bg-gray-900' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}><Gamepad2 size={16} strokeWidth={2.5}/> 3. Bài tập</button>
          </div>

          <button onClick={triggerClose} className="hidden sm:flex h-12 w-12 items-center justify-center text-gray-400 bg-gray-50 hover:bg-gray-200 hover:text-gray-900 rounded-2xl transition-all dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white shrink-0"><X size={24} strokeWidth={2.5} /></button>
        </div>

        {/* Body Modal */}
        <div className="p-6 sm:p-10 overflow-y-auto custom-scrollbar flex-1 relative">
          
          {/* TAB 1 */}
          {activeTab === 1 && (
            <div className="space-y-8 animate-fade-in">
              <section className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <div className="flex flex-col gap-6 md:col-span-2 lg:col-span-1 lg:border-r lg:border-gray-100 lg:dark:border-gray-800 lg:pr-8">
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">1. Cấp độ JLPT (*)</label>
                      <CustomDropdown value={formData.levelId} options={levels} onChange={(val) => handleDropdownChange('levelId', val)} placeholder="Chọn Cấp độ" optionLabelKey="levelName" className="z-30" />
                    </div>
                    <div className={`transition-all duration-300 ${formData.levelId ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
                      <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">2. Thuộc Bài Học (*)</label>
                      <CustomDropdown value={formData.lessonId} options={lessons} onChange={(val) => handleDropdownChange('lessonId', val)} placeholder="Chọn Bài học" optionLabelKey="title" className="z-20" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-6 md:col-span-2 lg:col-span-1">
                     <div><label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">Tên cấu trúc (*)</label><input name="title" value={formData.title} onChange={handleInputChange} className={`${inputClass} text-xl`} /></div>
                    <div><label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">Công thức (Structure) (*)</label><input name="structure" value={formData.structure} onChange={handleInputChange} className={`${inputClass}`} /></div>
                    <div><label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">Ý nghĩa TV (*)</label><input name="meaning" value={formData.meaning} onChange={handleInputChange} className={`${inputClass}`} /></div>
                  </div>
                </div>
              </section>
              <section className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div><label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">Cách dùng chi tiết</label><textarea name="usages" value={formData.usages} onChange={handleInputChange} rows="4" className={`${inputClass} resize-none font-medium leading-relaxed`} /></div>
                  <div><label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">Chú ý (Note)</label><textarea name="note" value={formData.note} onChange={handleInputChange} rows="4" className={`${inputClass} resize-none font-medium leading-relaxed`} /></div>
                </div>
              </section>
            </div>
          )}

          {/* TAB 2 */}
          {activeTab === 2 && (
            <div className="animate-fade-in bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="space-y-4 mb-6">
                {formData.examples.map((ex, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-4 bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <div className="sm:w-1/2"><label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">Câu tiếng Nhật</label><input value={ex.content} onChange={(e) => handleArrayChange('examples', idx, 'content', e.target.value)} className={`${inputClass} py-3`} /></div>
                    <div className="sm:flex-1"><label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">Nghĩa tiếng Việt</label><input value={ex.meaning} onChange={(e) => handleArrayChange('examples', idx, 'meaning', e.target.value)} className={`${inputClass} py-3`} /></div>
                    <div className="sm:w-auto pt-5"><button type="button" onClick={() => removeArrayRow('examples', idx)} className="h-[52px] w-14 flex items-center justify-center rounded-2xl bg-white text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={20} strokeWidth={2.5} /></button></div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => addArrayRow('examples', { content: '', meaning: '', displayOrder: formData.examples.length + 1 })} className="w-full py-5 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-500 font-black hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center justify-center gap-2"><Plus size={20} strokeWidth={3} /> Thêm Câu Ví Dụ</button>
            </div>
          )}

          {/* TAB 3 */}
          {activeTab === 3 && (
            <div className="animate-fade-in bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="space-y-6 mb-6">
                {formData.exercises.map((exe, idx) => (
                  <div key={idx} className="bg-orange-50/50 dark:bg-orange-900/10 p-6 rounded-3xl border-2 border-orange-100 dark:border-orange-900/30 relative group">
                    <button type="button" onClick={() => removeArrayRow('exercises', idx)} className="absolute -right-3 -top-3 h-8 w-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-md opacity-0 group-hover:opacity-100"><X size={16} strokeWidth={3}/></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2"><label className="block text-[11px] font-black uppercase tracking-widest text-orange-600 mb-2">1. Câu hỏi gốc chứa ô trống</label><input value={exe.questionText} onChange={(e) => handleArrayChange('exercises', idx, 'questionText', e.target.value)} className={`${inputClass} border-orange-200 focus:border-orange-500 focus:ring-orange-500/10 text-lg`} /></div>
                      <div><label className="block text-[11px] font-black uppercase tracking-widest text-orange-600 mb-2">2. Mảnh ghép đúng (Dùng dấu phẩy , )</label><input value={exe.brokenChunks} onChange={(e) => handleArrayChange('exercises', idx, 'brokenChunks', e.target.value)} className={`${inputClass} border-orange-200 focus:border-orange-500 focus:ring-orange-500/10`} /></div>
                      <div><label className="block text-[11px] font-black uppercase tracking-widest text-orange-600 mb-2">3. Giải thích đáp án</label><input value={exe.explanation} onChange={(e) => handleArrayChange('exercises', idx, 'explanation', e.target.value)} className={`${inputClass} border-orange-200 focus:border-orange-500 focus:ring-orange-500/10`} /></div>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => addArrayRow('exercises', { questionText: '', brokenChunks: '', explanation: '' })} className="w-full py-5 rounded-2xl border-2 border-dashed border-orange-300 text-orange-600 font-black hover:bg-orange-50 hover:border-orange-400 transition-all flex items-center justify-center gap-2"><Plus size={20} strokeWidth={3} /> Thêm Bài Tập Dokkai</button>
            </div>
          )}

        </div>

        {/* Footer Modal */}
        <div className="px-10 py-6 border-t border-gray-200/50 dark:border-gray-800 bg-white dark:bg-gray-900 flex justify-end gap-4 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] z-20">
          <button onClick={triggerClose} className="px-8 py-4 rounded-2xl font-black text-gray-500 bg-gray-50 hover:bg-gray-200 hover:text-gray-900 transition-all">Hủy</button>
          <button onClick={handleSubmit} disabled={isSubmitting || !formData.title || !formData.structure || !formData.meaning || !formData.levelId || !formData.lessonId} className="flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-white bg-primary shadow-[0_6px_0_rgb(0,0,0,0.15)] hover:brightness-110 active:translate-y-1.5 active:shadow-none transition-all disabled:opacity-50 disabled:grayscale">
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <PlusCircle size={20} strokeWidth={2.5} />} {editId ? 'Lưu cập nhật' : 'Xuất bản'}
          </button>
        </div>
      </div>
    </div>
  );
};