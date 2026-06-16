import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Edit, Trash2, X, Loader2, Book, Hash } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Pagination } from '../../components/common/Pagination';
import { CustomDropdown } from '../../components/common/CustomDropdown';

const TARGET_TYPES = [
  { id: 'vocab', name: 'Từ vựng (Vocab)' },
  { id: 'grammar', name: 'Ngữ pháp (Grammar)' }
];

export const LessonAdmin = () => {
  const [lessons, setLessons] = useState([]);
  const [levels, setLevels] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterType, setFilterType] = useState(''); 
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialForm = { title: '', lessonType: '', lessonOrder: '', levelId: '' };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    const loadLevels = async () => {
      try {
        const res = await adminService.getCompactLevels();
        setLevels(res.data || res || []);
      } catch (err) { console.error(err); }
    };
    loadLevels();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const loadLessons = async () => {
      try {
        const response = await adminService.getLessons(searchTerm, filterLevel, filterType, currentPage, 15);
        setLessons(response.data || []);
        setTotalPages(response.totalPages || 1);
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };

    const delayDebounce = setTimeout(() => { loadLessons(); }, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, filterLevel, filterType, currentPage, refreshKey]);

  const openAddModal = () => { setEditId(null); setFormData(initialForm); setIsModalOpen(true); setIsClosing(false); };

  const closeWithAnimation = () => {
    setIsClosing(true);
    setTimeout(() => { setIsModalOpen(false); setIsClosing(false); }, 300);
  };

  const openEditModal = async (lesson) => {
    setEditId(lesson.id); setIsModalOpen(true); setIsClosing(false);
    try {
      const detailResponse = await adminService.getLessonById(lesson.id);
      const detail = detailResponse.data || detailResponse; 
      setFormData({
        title: detail.title, 
        lessonType: detail.lessonType, 
        lessonOrder: detail.lessonOrder, 
        levelId: detail.levelId
      });
    } catch (err) { alert('Không thể tải chi tiết'); closeWithAnimation(); }
  };

  const handleInputChange = (e) => { 
    const { name, value } = e.target; 
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'lessonOrder' ? (value ? parseInt(value, 10) : '') : value 
    })); 
  };
  
  const handleDropdownChange = (name, value) => { setFormData(prev => ({ ...prev, [name]: value })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.lessonType || !formData.lessonOrder || !formData.levelId) {
      alert("⚠️ Vui lòng điền đầy đủ các trường bắt buộc (*)!"); return;
    }
    
    setIsSubmitting(true);
    try {
      if (editId) { await adminService.updateLesson(editId, formData); } 
      else { await adminService.createLesson(formData); }
      closeWithAnimation();
      setRefreshKey(old => old + 1); 
    } catch (err) { alert(`Lỗi: ${err.message}`); } finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`⚠️ BẠN CÓ CHẮC MUỐN XÓA [${title}]?\nChỉ cho phép xóa khi bài học này CHƯA chứa bất kỳ Chủ đề hay Ngữ pháp nào!`)) {
      try { await adminService.deleteLesson(id); setRefreshKey(old => old + 1); } 
      catch (err) { alert(`Lỗi: ${err.message}`); }
    }
  };

  const renderTypeBadge = (type) => {
    switch(type?.toLowerCase()) {
      case 'vocab': return <span className="inline-flex items-center rounded-lg bg-blue-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-blue-600 dark:bg-blue-900/30">Từ vựng</span>;
      case 'grammar': return <span className="inline-flex items-center rounded-lg bg-orange-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-orange-600 dark:bg-orange-900/30">Ngữ pháp</span>;
      default: return <span className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-gray-600 dark:bg-gray-800">Khác</span>;
    }
  };

  const inputClass = "w-full rounded-2xl border border-gray-200 bg-gray-100/50 px-5 py-4 font-bold text-gray-900 outline-none transition-all placeholder:text-gray-400/70 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:focus:bg-gray-900";

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="relative z-10 flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
            <Book size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Quản lý Bài học</h1>
            <p className="text-sm font-bold text-gray-400 mt-1">Phân chia lộ trình học tập, gắn cấp độ và sắp xếp thứ tự</p>
          </div>
        </div>
        <button onClick={openAddModal} className="relative z-10 flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 font-black text-white shadow-[0_6px_0_rgb(0,0,0,0.15)] hover:brightness-110 active:translate-y-1.5 active:shadow-none transition-all">
          <PlusCircle size={22} strokeWidth={2.5} /> Thêm Bài học
        </button>
      </div>

      <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative group md:col-span-2">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors z-10" size={20} strokeWidth={2.5} />
            <input type="text" placeholder="Tìm kiếm tên bài học..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }} className={`${inputClass} pl-14`} />
          </div>
          <div className="relative z-30">
            <CustomDropdown value={filterLevel} options={levels} onChange={(val) => { setFilterLevel(val); setCurrentPage(0); }} placeholder="Lọc theo Cấp độ" optionLabelKey="levelName" className="w-full" />
          </div>
          <div className="relative z-20">
            <CustomDropdown value={filterType} options={TARGET_TYPES} onChange={(val) => { setFilterType(val); setCurrentPage(0); }} placeholder="Lọc theo Phân loại" optionLabelKey="name" className="w-full" />
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar min-h-[400px]">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center"><Loader2 size={40} className="animate-spin text-primary" /></div>
          ) : lessons.length > 0 ? (
            <table className="w-full min-w-[800px] text-left">
              <thead>
                <tr className="border-b-2 border-gray-100 text-gray-400 dark:border-gray-800">
                  <th className="pb-4 pl-4 font-black uppercase tracking-widest text-xs w-16">Thứ tự</th>
                  <th className="pb-4 font-black uppercase tracking-widest text-xs">Tên Bài Học</th>
                  <th className="pb-4 font-black uppercase tracking-widest text-xs">Cấp độ</th>
                  <th className="pb-4 font-black uppercase tracking-widest text-xs">Phân loại</th>
                  <th className="pb-4 text-center font-black uppercase tracking-widest text-xs pr-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((ls) => (
                  <tr key={ls.id} className="group border-b border-gray-50 transition-colors hover:bg-gray-50/50 dark:border-gray-800/50 dark:hover:bg-gray-800/30">
                    <td className="py-4 pl-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-500 font-black dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                        {ls.lessonOrder}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="font-black text-gray-900 dark:text-white text-lg">{ls.title}</div>
                      <div className="text-xs font-bold text-gray-400 mt-0.5">ID: #{ls.id}</div>
                    </td>
                    <td className="py-4">
                      <span className="inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-black uppercase tracking-widest shadow-sm bg-primary/10 text-primary">
                        {ls.levelName}
                      </span>
                    </td>
                    <td className="py-4">
                      {renderTypeBadge(ls.lessonType)}
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-50 sm:group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditModal(ls)} className="rounded-xl p-2.5 text-primary bg-primary/10 hover:bg-primary hover:text-white transition-all active:scale-95 shadow-sm"><Edit size={18} strokeWidth={2.5} /></button>
                        <button onClick={() => handleDelete(ls.id, ls.title)} className="rounded-xl p-2.5 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-sm"><Trash2 size={18} strokeWidth={2.5} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Book size={48} className="mb-4 opacity-50" />
              <p className="font-bold text-lg">Trống rỗng!</p>
              <p className="text-sm">Không tìm thấy bài học nào phù hợp.</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-md p-4 sm:p-6 transition-all duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
          <div className={`bg-[#f8fafc] dark:bg-gray-950 w-full max-w-3xl rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-gray-200/50 dark:border-gray-800 transition-all duration-300 ${isClosing ? 'scale-95 opacity-0 translate-y-4' : 'scale-100 opacity-100 translate-y-0'}`}>
            
            <div className="px-10 py-6 border-b border-gray-200/50 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm z-20 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0"><Edit size={24} strokeWidth={2.5} /></div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">{editId ? `Cập nhật: ${formData.title}` : 'Tạo Bài Học Mới'}</h2>
              </div>
              <button onClick={closeWithAnimation} className="h-12 w-12 flex items-center justify-center text-gray-400 bg-gray-50 hover:bg-gray-200 hover:text-gray-900 rounded-2xl transition-all dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white shrink-0"><X size={24} strokeWidth={2.5} /></button>
            </div>

            <div className="p-6 sm:p-10 space-y-6 overflow-y-auto custom-scrollbar flex-1 pb-40">
              
              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">Tên bài học (*)</label>
                <input name="title" value={formData.title} onChange={handleInputChange} placeholder="Vd: Bài 1 - Chào hỏi" className={`${inputClass} text-xl`} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative z-30">
                  <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">Cấp độ JLPT (*)</label>
                  <CustomDropdown value={formData.levelId} options={levels} onChange={(val) => handleDropdownChange('levelId', val)} placeholder="Chọn Cấp độ" optionLabelKey="levelName" />
                </div>
                
                <div className="relative z-20">
                  <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">Phân loại (Loại kiến thức) (*)</label>
                  <CustomDropdown value={formData.lessonType} options={TARGET_TYPES} onChange={(val) => handleDropdownChange('lessonType', val)} placeholder="Chọn Phân loại" optionLabelKey="name" />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">
                  <Hash size={14} /> Thứ tự hiển thị (Order) (*)
                </label>
                <input type="number" min="1" name="lessonOrder" value={formData.lessonOrder} onChange={handleInputChange} placeholder="Vd: 1" className={inputClass} />
                <p className="text-xs font-bold text-gray-400 mt-2">Nhập số nguyên. Hệ thống sẽ sắp xếp tăng dần 1, 2, 3...</p>
              </div>

            </div>

            <div className="px-10 py-6 border-t border-gray-200/50 dark:border-gray-800 bg-white dark:bg-gray-900 flex justify-end gap-4 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] z-20">
              <button onClick={closeWithAnimation} className="px-8 py-4 rounded-2xl font-black text-gray-500 bg-gray-50 hover:bg-gray-200 hover:text-gray-900 transition-all dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">Hủy</button>
              <button onClick={handleSubmit} disabled={isSubmitting || !formData.title || !formData.lessonType || !formData.lessonOrder || !formData.levelId} className="flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-white bg-primary shadow-[0_6px_0_rgb(0,0,0,0.15)] hover:brightness-110 active:translate-y-1.5 active:shadow-none transition-all disabled:opacity-50 disabled:grayscale">
                {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <PlusCircle size={20} strokeWidth={2.5} />} 
                {editId ? 'Lưu cập nhật' : 'Tạo Bài Học'}
              </button>
            </div>

          </div>
        </div>
      )}
      
    </div>
  );
};