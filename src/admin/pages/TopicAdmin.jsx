import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Edit, Trash2, X, Loader2, Bookmark, Layers } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Pagination } from '../../components/common/Pagination';
import { CustomDropdown } from '../../components/common/CustomDropdown';

export const TopicAdmin = () => {
  const [topics, setTopics] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Dữ liệu danh mục gốc
  const [levels, setLevels] = useState([]);
  
  // State Bộ lọc Bảng
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterLessons, setFilterLessons] = useState([]); // Chứa list lesson cho Dropdown Filter
  const [filterLessonId, setFilterLessonId] = useState('');
  
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // States Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State phụ trợ cho Modal (Dùng để chọn Level -> load Lesson)
  const [modalLevelId, setModalLevelId] = useState('');
  const [modalLessons, setModalLessons] = useState([]);

  const initialForm = { name: '', lessonId: '' };
  const [formData, setFormData] = useState(initialForm);

  // ================= 1. HOOKS KHỞI TẠO =================
  useEffect(() => {
    const loadLevels = async () => {
      try {
        const res = await adminService.getCompactLevels();
        setLevels(res.data || res || []);
      } catch (err) { console.error(err); }
    };
    loadLevels();
  }, []);

  // Lấy dữ liệu Bảng
  useEffect(() => {
    setIsLoading(true);
    const loadTopics = async () => {
      try {
        // API Backend chỉ filter theo lessonId
        const response = await adminService.getTopics(searchTerm, filterLessonId, currentPage, 15);
        setTopics(response.data || []);
        setTotalPages(response.totalPages || 1);
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };
    const delayDebounce = setTimeout(() => { loadTopics(); }, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, filterLessonId, currentPage, refreshKey]);

  // ================= 2. LOGIC CASCADING DROPDOWN =================
  // Load Lesson cho Bộ lọc ngoài bảng
  // Load Lesson cho Bộ lọc ngoài bảng
  useEffect(() => {
    // 💡 Đảm bảo ép kiểu về chuỗi hoặc số chuẩn, loại bỏ khoảng trắng
    if (!filterLevel) { 
      setFilterLessons([]); 
      setFilterLessonId(''); 
      return; 
    }
    
    const fetchFilterLessons = async () => {
      try { 
        // Ép kiểu filterLevel sang số nguyên chuẩn trước khi gửi đi để tránh lỗi truyền chuỗi
        const cleanLevelId = parseInt(filterLevel, 10);
        
        // Gọi API và truyền đúng loại bài học (ở trang Topic/Vocab thì truyền 'vocab', trang Grammar thì truyền 'grammar')
        const res = await adminService.getCompactLessonsByLevel(cleanLevelId, 'vocab'); 
        
        setFilterLessons(res.data || res || []); 
      } catch (err) { 
        console.error("Lỗi tải bài học ở bộ lọc:", err); 
        setFilterLessons([]); // Nếu lỗi thì trả về mảng rỗng chứ không để crash
      }
    };
    
    fetchFilterLessons();
  }, [filterLevel]); // Luôn lắng nghe chính xác khi filterLevel thay đổi

  // Load Lesson cho Dropdown bên trong Modal
  useEffect(() => {
    if (!modalLevelId) { setModalLessons([]); return; }
    const fetchModalLessons = async () => {
      try { 
        const res = await adminService.getCompactLessonsByLevel(modalLevelId, 'vocab'); 
        setModalLessons(res.data || res || []); 
      } catch (err) { console.error(err); }
    };
    fetchModalLessons();
  }, [modalLevelId]);


  // ================= 3. XỬ LÝ SỰ KIỆN FORM =================
  const openAddModal = () => { 
    setEditId(null); 
    setFormData(initialForm); 
    setModalLevelId(''); 
    setIsModalOpen(true); 
    setIsClosing(false); 
  };

  const closeWithAnimation = () => {
    setIsClosing(true);
    setTimeout(() => { setIsModalOpen(false); setIsClosing(false); }, 300);
  };

  const openEditModal = async (topic) => {
    setEditId(topic.id); setIsModalOpen(true); setIsClosing(false);
    try {
      const detailResponse = await adminService.getTopicById(topic.id);
      const detail = detailResponse.data || detailResponse; 
      
      setFormData({ name: detail.name, lessonId: detail.lessonId });

      // Logic "Dò tìm ngược" LevelId từ LevelName do Backend trả về
      if (detail.levelName) {
        const foundLevel = levels.find(l => l.levelName === detail.levelName);
        if (foundLevel) setModalLevelId(foundLevel.id);
      }
    } catch (err) { alert('Không thể tải chi tiết'); closeWithAnimation(); }
  };

  const handleInputChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.lessonId) {
      alert("⚠️ Vui lòng nhập Tên chủ đề và chọn Bài học trực thuộc!"); return;
    }
    
    setIsSubmitting(true);
    try {
      if (editId) { await adminService.updateTopic(editId, formData); } 
      else { await adminService.createTopic(formData); }
      closeWithAnimation();
      setRefreshKey(old => old + 1); 
    } catch (err) { alert(`Lỗi: ${err.message}`); } finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`⚠️ Bạn có chắc muốn xóa chủ đề [${name}]?\nToàn bộ từ vựng thuộc chủ đề này sẽ bị chuyển về trạng thái Chưa phân loại!`)) {
      try { await adminService.deleteTopic(id); setRefreshKey(old => old + 1); } 
      catch (err) { alert(`Lỗi: ${err.message}`); }
    }
  };

  const inputClass = "w-full rounded-2xl border border-gray-200 bg-gray-100/50 px-5 py-4 font-bold text-gray-900 outline-none transition-all placeholder:text-gray-400/70 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:focus:bg-gray-900";

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* HEADER PAGE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="relative z-10 flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
            <Bookmark size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Quản lý Chủ đề</h1>
            <p className="text-sm font-bold text-gray-400 mt-1">Phân vùng từ vựng chi tiết bên trong các bài học</p>
          </div>
        </div>
        <button onClick={openAddModal} className="relative z-10 flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 font-black text-white shadow-[0_6px_0_rgb(0,0,0,0.15)] hover:brightness-110 active:translate-y-1.5 active:shadow-none transition-all">
          <PlusCircle size={22} strokeWidth={2.5} /> Thêm Chủ đề
        </button>
      </div>

      {/* BỘ LỌC CASCADING */}
      <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative group md:col-span-2">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors z-10" size={20} strokeWidth={2.5} />
            <input type="text" placeholder="Tìm kiếm tên chủ đề..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }} className={`${inputClass} pl-14`} />
          </div>
          <div className="relative z-30">
            <CustomDropdown 
              value={filterLevel} options={levels} 
              onChange={(val) => { setFilterLevel(val); setFilterLessonId(''); setCurrentPage(0); }} 
              placeholder="1. Chọn Cấp độ" optionLabelKey="levelName" optionLabelKey="levelName" className="w-full" 
            />
          </div>
          <div className={`relative z-20 transition-all duration-300 ${filterLevel ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
            <CustomDropdown 
              value={filterLessonId} options={filterLessons} 
              onChange={(val) => { setFilterLessonId(val); setCurrentPage(0); }} 
              placeholder="2. Chọn Bài học" optionLabelKey="title" className="w-full" 
            />
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar min-h-[400px]">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center"><Loader2 size={40} className="animate-spin text-primary" /></div>
          ) : topics.length > 0 ? (
            <table className="w-full min-w-[800px] text-left">
              <thead>
                <tr className="border-b-2 border-gray-100 text-gray-400 dark:border-gray-800">
                  <th className="pb-4 pl-4 font-black uppercase tracking-widest text-xs">Tên Chủ Đề</th>
                  <th className="pb-4 font-black uppercase tracking-widest text-xs">Thuộc Bài Học</th>
                  <th className="pb-4 font-black uppercase tracking-widest text-xs">Cấp độ</th>
                  <th className="pb-4 text-center font-black uppercase tracking-widest text-xs pr-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {topics.map((tp) => (
                  <tr key={tp.id} className="group border-b border-gray-50 transition-colors hover:bg-gray-50/50 dark:border-gray-800/50 dark:hover:bg-gray-800/30">
                    <td className="py-4 pl-4">
                      <div className="font-black text-gray-900 dark:text-white text-lg">{tp.name}</div>
                      <div className="text-xs font-bold text-gray-400 mt-0.5">ID: #{tp.id}</div>
                    </td>
                    <td className="py-4">
                      <span className="font-bold text-gray-600 dark:text-gray-300">{tp.lessonTitle}</span>
                    </td>
                    <td className="py-4">
                      <span className="inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-black uppercase tracking-widest shadow-sm bg-primary/10 text-primary">
                        {tp.levelName}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-50 sm:group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditModal(tp)} className="rounded-xl p-2.5 text-primary bg-primary/10 hover:bg-primary hover:text-white transition-all active:scale-95 shadow-sm"><Edit size={18} strokeWidth={2.5} /></button>
                        <button onClick={() => handleDelete(tp.id, tp.name)} className="rounded-xl p-2.5 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-sm"><Trash2 size={18} strokeWidth={2.5} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Layers size={48} className="mb-4 opacity-50" />
              <p className="font-bold text-lg">Trống rỗng!</p>
              <p className="text-sm mt-1 text-center">Không tìm thấy chủ đề nào.<br/>Hãy thử chọn một bài học khác ở bộ lọc phía trên.</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </div>

      {/* --- MODAL THÊM/SỬA CHỦ ĐỀ --- */}
      {isModalOpen && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-md p-4 sm:p-6 transition-all duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
          <div className={`bg-[#f8fafc] dark:bg-gray-950 w-full max-w-2xl rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-gray-200/50 dark:border-gray-800 transition-all duration-300 ${isClosing ? 'scale-95 opacity-0 translate-y-4' : 'scale-100 opacity-100 translate-y-0'}`}>
            
            <div className="px-10 py-6 border-b border-gray-200/50 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm z-20 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0"><Edit size={24} strokeWidth={2.5} /></div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">{editId ? `Cập nhật Chủ đề` : 'Tạo Chủ Đề Mới'}</h2>
              </div>
              <button onClick={closeWithAnimation} className="h-12 w-12 flex items-center justify-center text-gray-400 bg-gray-50 hover:bg-gray-200 hover:text-gray-900 rounded-2xl transition-all dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white shrink-0"><X size={24} strokeWidth={2.5} /></button>
            </div>

            <div className="p-6 sm:p-10 space-y-6 overflow-y-auto custom-scrollbar flex-1 pb-40">
              
              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">Tên chủ đề (*)</label>
                <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Vd: Phương tiện giao thông" className={`${inputClass} text-xl`} />
              </div>

              <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6 relative z-10">
                <div className="flex items-center gap-2 mb-2">
                   <Layers size={18} className="text-primary"/>
                   <h4 className="font-black text-gray-900 dark:text-white">Gắn kết Bài học (Cascading)</h4>
                </div>

                <div className="relative z-30">
                  <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">Bước 1: Chọn Cấp độ JLPT</label>
                  <CustomDropdown 
                    value={modalLevelId} options={levels} 
                    onChange={(val) => { setModalLevelId(val); setFormData(prev => ({...prev, lessonId: ''}))}} 
                    placeholder="--- Chọn Level ---" 
                    optionLabelKey="levelName"
                  />
                </div>
                
                <div className={`relative z-20 transition-all duration-300 ${modalLevelId ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">Bước 2: Chọn Bài học (*)</label>
                  <CustomDropdown 
                    value={formData.lessonId} options={modalLessons} 
                    onChange={(val) => setFormData(prev => ({...prev, lessonId: val}))} 
                    placeholder="--- Chọn Bài học ---" optionLabelKey="title" 
                  />
                </div>
              </div>

            </div>

            <div className="px-10 py-6 border-t border-gray-200/50 dark:border-gray-800 bg-white dark:bg-gray-900 flex justify-end gap-4 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] z-20">
              <button onClick={closeWithAnimation} className="px-8 py-4 rounded-2xl font-black text-gray-500 bg-gray-50 hover:bg-gray-200 hover:text-gray-900 transition-all dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">Hủy</button>
              <button onClick={handleSubmit} disabled={isSubmitting || !formData.name || !formData.lessonId} className="flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-white bg-primary shadow-[0_6px_0_rgb(0,0,0,0.15)] hover:brightness-110 active:translate-y-1.5 active:shadow-none transition-all disabled:opacity-50 disabled:grayscale">
                {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <PlusCircle size={20} strokeWidth={2.5} />} 
                {editId ? 'Lưu cập nhật' : 'Tạo Chủ đề'}
              </button>
            </div>

          </div>
        </div>
      )}
      
    </div>
  );
};