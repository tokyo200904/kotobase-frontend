import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Edit, Trash2, X, Plus, Loader2, BookA, BookOpen, Layers } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Pagination } from '../../components/common/Pagination';
import { CustomDropdown } from '../../components/common/CustomDropdown';

export const VocabAdmin = () => {
  // --- 1. State Quản lý Dữ liệu ---
  const [vocabs, setVocabs] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0); 

  // Danh mục cho Dropdown
  const [levels, setLevels] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [topics, setTopics] = useState([]);

  // --- 2. State Bộ lọc & Bảng ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterTopic, setFilterTopic] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // --- 3. State Modal -Detail ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [modalLessonId, setModalLessonId] = useState('');

  const initialForm = { word: '', reading: '', romaji: '', meaning: '', levelId: '', topicId: '', examples: [] };
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
    const loadVocabs = async () => {
      setIsLoading(true);
      try {
        const response = await adminService.getVocabs(searchTerm, filterLevel, filterTopic, currentPage, 10);
        setVocabs(response.data || []);
        setTotalPages(response.totalPages || 1);
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };

    const delayDebounce = setTimeout(() => { loadVocabs(); }, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, filterLevel, filterTopic, currentPage, refreshKey]);


 useEffect(() => {
    if (!formData.levelId) { setLessons([]); return; }
    const loadLessons = async () => {
      try {
        const res = await adminService.getCompactLessonsByLevel(formData.levelId, 'vocab');
        setLessons(res.data || res || []);
      } catch (err) { console.error("Lỗi tải Lessons", err); }
    };
    loadLessons();
  }, [formData.levelId]);

  useEffect(() => {
    if (!modalLessonId) { setTopics([]); return; }
    const loadTopics = async () => {
      try {
        const res = await adminService.getCompactTopicsByLesson(modalLessonId);
        setTopics(res.data || res || []);
      } catch (err) { console.error("Lỗi tải Topics", err); }
    };
    loadTopics();
  }, [modalLessonId]);


  const openAddModal = () => { 
    setEditId(null); 
    setFormData(initialForm); 
    setModalLessonId(''); 
    setLessons([]); 
    setTopics([]);
    setIsModalOpen(true); 
    setIsClosing(false); 
  };

  const closeWithAnimation = () => {
    setIsClosing(true);
    setTimeout(() => { setIsModalOpen(false); setIsClosing(false); }, 300);
  };

  const openEditModal = async (vocab) => {
    setEditId(vocab.id);
    setIsModalOpen(true);
    setIsClosing(false);
    try {
      const detailResponse = await adminService.getVocabById(vocab.id);
      const detail = detailResponse.data || detailResponse; 
      
      setFormData({
        word: detail.word, reading: detail.reading, romaji: detail.romaji, 
        meaning: detail.meaning, levelId: detail.levelId, topicId: detail.topic?.id || '',
        examples: detail.examples || []
      });

    } catch (err) { alert('Không thể tải chi tiết'); closeWithAnimation(); }
  };

  const handleInputChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  
  // Xử lý Thay đổi Dropdown Lồng nhau
  const handleLevelChange = (val) => { 
    setFormData(prev => ({ ...prev, levelId: val, topicId: '' })); 
    setModalLessonId(''); // Reset Lesson và Topic
  };
  const handleLessonChange = (val) => {
    setModalLessonId(val);
    setFormData(prev => ({ ...prev, topicId: '' }));
  };
  const handleTopicChange = (val) => {
    setFormData(prev => ({ ...prev, topicId: val }));
  };

  const handleArrayChange = (index, key, value) => { 
    const newExamples = [...formData.examples]; 
    newExamples[index][key] = value; 
    setFormData(prev => ({ ...prev, examples: newExamples })); 
  };
  const addExampleRow = () => { 
    setFormData(prev => ({ ...prev, examples: [...prev.examples, { content: '', meaning: '', displayOrder: prev.examples.length + 1 }] })); 
  };
  const removeExampleRow = (index) => { 
    const newExamples = [...formData.examples]; 
    newExamples.splice(index, 1); 
    setFormData(prev => ({ ...prev, examples: newExamples })); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.word || !formData.reading || !formData.meaning || !formData.levelId) {
      alert("⚠️ Vui lòng điền đầy đủ các thông tin chữ, cách đọc và ý nghĩa ở Khu vực 1!");
      return;
    }
    if (!formData.topicId) { 
      alert("⚠️ Vui lòng hoàn thành 3 bước Phân loại & Gắn kết chủ đề ở Khu vực 2!"); 
      return; 
    }
    
    setIsSubmitting(true);
    try {
      if (editId) { await adminService.updateVocab(editId, formData); } 
      else { await adminService.createVocab(formData); }
      closeWithAnimation();
      setRefreshKey(old => old + 1); 
    } catch (err) { alert(`Lỗi: ${err.message}`); } finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id, word) => {
    if (window.confirm(`Xóa từ vựng [${word}]? Dữ liệu không thể khôi phục!`)) {
      try { 
        await adminService.deleteVocab(id); 
        setRefreshKey(old => old + 1); 
      } catch (err) { alert(`Lỗi: ${err.message}`); }
    }
  };

  const inputClassName = "w-full rounded-2xl border border-gray-200 bg-gray-100/50 px-5 py-4 font-bold text-gray-900 outline-none transition-all placeholder:text-gray-400/70 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:focus:bg-gray-900";

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="relative z-10 flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
            <BookA size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Kho Từ Vựng</h1>
            <p className="text-sm font-bold text-gray-400 mt-1">Quản lý từ vựng tiếng Nhật, phiên âm và chủ đề bài học</p>
          </div>
        </div>
        <button onClick={openAddModal} className="relative z-10 flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 font-black text-white shadow-[0_6px_0_rgb(0,0,0,0.15)] hover:brightness-110 active:translate-y-1.5 active:shadow-none transition-all">
          <PlusCircle size={22} strokeWidth={2.5} /> Thêm Từ Vựng
        </button>
      </div>


      <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative group md:col-span-2">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors z-10" size={20} strokeWidth={2.5} />
            <input 
              type="text" placeholder="Tìm kiếm theo Từ, Hiragana, Nghĩa..." 
              value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }}
              className={`${inputClassName} pl-14`}
            />
          </div>
          <div className="relative z-20">
            <CustomDropdown 
              value={filterLevel} options={levels} 
              onChange={(val) => { setFilterLevel(val); setCurrentPage(0); }} 
              placeholder="Lọc theo Cấp độ" className="w-full" 
            />
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar min-h-[400px]">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center"><Loader2 size={40} className="animate-spin text-primary" /></div>
          ) : vocabs.length > 0 ? (
            <table className="w-full min-w-[800px] text-left">
              <thead>
                <tr className="border-b-2 border-gray-100 text-gray-400 dark:border-gray-800">
                  <th className="pb-4 pl-4 font-black uppercase tracking-widest text-xs">Từ Vựng</th>
                  <th className="pb-4 font-black uppercase tracking-widest text-xs">Cách đọc</th>
                  <th className="pb-4 font-black uppercase tracking-widest text-xs">Ý Nghĩa</th>
                  <th className="pb-4 font-black uppercase tracking-widest text-xs">Chủ đề (Topic)</th>
                  <th className="pb-4 text-center font-black uppercase tracking-widest text-xs pr-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {vocabs.map((v) => (
                  <tr key={v.id} className="group border-b border-gray-50 transition-colors hover:bg-gray-50/50 dark:border-gray-800/50 dark:hover:bg-gray-800/30">
                    <td className="py-4 pl-4">
                      <div className="font-black text-gray-900 dark:text-white text-xl">{v.word}</div>
                    </td>
                    <td className="py-4">
                      <div className="font-bold text-primary">{v.reading}</div>
                      <div className="text-xs font-bold text-gray-400 mt-1">{v.romaji}</div>
                    </td>
                    <td className="py-4 font-bold text-gray-700 dark:text-gray-200">{v.meaning}</td>
                    <td className="py-4">
                      {v.topic ? (
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex w-fit items-center rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-500 dark:bg-gray-800">{v.topic.lessonTitle}</span>
                          <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{v.topic.name}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-sm">Chưa phân loại</span>
                      )}
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-50 sm:group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditModal(v)} className="rounded-xl p-2.5 text-primary bg-primary/10 hover:bg-primary hover:text-white transition-all active:scale-95 shadow-sm">
                          <Edit size={18} strokeWidth={2.5} />
                        </button>
                        <button onClick={() => handleDelete(v.id, v.word)} className="rounded-xl p-2.5 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-sm">
                          <Trash2 size={18} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <BookOpen size={48} className="mb-4 opacity-50" />
              <p className="font-bold text-lg">Trống rỗng!</p>
              <p className="text-sm">Không tìm thấy từ vựng nào.</p>
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
          <div className={`bg-[#f8fafc] dark:bg-gray-950 w-full max-w-7xl h-[90vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-gray-200/50 dark:border-gray-800 transition-all duration-300 ${isClosing ? 'scale-95 opacity-0 translate-y-4' : 'scale-100 opacity-100 translate-y-0'}`}>
            
            <div className="px-10 py-6 border-b border-gray-200/50 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900 shadow-sm z-10">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <Edit size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                    {editId ? `Cập nhật Từ vựng` : 'Thêm Từ Vựng Mới'}
                  </h2>
                </div>
              </div>
              <button onClick={closeWithAnimation} className="h-12 w-12 flex items-center justify-center text-gray-400 bg-gray-50 hover:bg-gray-200 hover:text-gray-900 rounded-2xl transition-all">
                <X size={24} strokeWidth={2.5} />
              </button>
            </div>

            <div className="p-6 sm:p-10 overflow-y-auto custom-scrollbar flex-1 space-y-10">
              
              
              <section className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 relative z-30">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary font-black flex items-center justify-center">1</div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">Thông tin cơ bản</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">Từ Vựng (*)</label>
                    <input name="word" value={formData.word} onChange={handleInputChange} placeholder="Vd: 先生" required className={`${inputClassName} text-center text-3xl font-serif py-3`} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">Cách đọc (Hiragana) (*)</label>
                    <input name="reading" value={formData.reading} onChange={handleInputChange} placeholder="Vd: せんせい" required className={`${inputClassName} text-lg`} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">Romaji</label>
                    <input name="romaji" value={formData.romaji} onChange={handleInputChange} placeholder="Vd: sensei" className={`${inputClassName} text-lg`} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">Ý nghĩa (*)</label>
                    <input name="meaning" value={formData.meaning} onChange={handleInputChange} placeholder="Vd: Giáo viên" required className={`${inputClassName} text-lg`} />
                  </div>
                </div>
              </section>

              <section className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 relative z-20">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary font-black flex items-center justify-center">2</div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white">Phân loại & Gắn kết Chủ đề</h3>
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-lg">Cascading Filters</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  {/* B1. Chọn Level */}
                  <div className="relative z-30">
                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">1. Chọn Cấp độ JLPT (*)</label>
                    <CustomDropdown value={formData.levelId} options={levels} onChange={handleLevelChange} placeholder="--- Chọn Level ---" />
                  </div>

               
<div className={`relative z-20 transition-all duration-300 ${formData.levelId ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
  <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">2. Chọn Bài học</label>
  <CustomDropdown value={modalLessonId} options={lessons} onChange={handleLessonChange} placeholder="--- Chọn Bài học ---" optionLabelKey="title" />
</div>

                  <div className={`relative z-10 transition-all duration-300 ${modalLessonId ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">3. Chọn Chủ đề (*)</label>
                    <CustomDropdown value={formData.topicId} options={topics} onChange={handleTopicChange} placeholder="--- Chọn Chủ đề ---" optionLabelKey="name" />
                  </div>
                </div>
                {!formData.topicId && (
                  <p className="text-sm font-bold text-red-500 mt-4 text-right">⚠️ Vui lòng hoàn thành chọn 3 bước phân loại để tiếp tục.</p>
                )}
              </section>

              <section className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-8 w-8 rounded-xl bg-blue-100 text-blue-600 font-black flex items-center justify-center">3</div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">Câu ví dụ minh họa</h3>
                </div>

                <div className="space-y-4 mb-6">
                  {formData.examples.map((ex, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
                      <div className="sm:w-1/2">
                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">Câu tiếng Nhật</label>
                        <input placeholder="Vd: 先生は日本人です" value={ex.content} onChange={(e) => handleArrayChange(idx, 'content', e.target.value)} className={`${inputClassName} py-3 font-medium`} />
                      </div>
                      <div className="sm:flex-1">
                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">Nghĩa tiếng Việt</label>
                        <input placeholder="Vd: Thầy giáo là người Nhật" value={ex.meaning} onChange={(e) => handleArrayChange(idx, 'meaning', e.target.value)} className={`${inputClassName} py-3 font-medium`} />
                      </div>
                      <div className="sm:w-auto pt-5">
                        <button type="button" onClick={() => removeExampleRow(idx)} className="h-[52px] w-14 flex items-center justify-center rounded-2xl bg-white text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                          <Trash2 size={20} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addExampleRow} className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-500 font-black hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                  <Plus size={20} strokeWidth={3} /> Bổ sung Câu ví dụ
                </button>
              </section>

            </div>

            {/* Modal Footer */}
            <div className="px-10 py-6 border-t border-gray-200/50 dark:border-gray-800 bg-white dark:bg-gray-900 flex justify-end gap-4 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] z-10">
              <button onClick={closeWithAnimation} className="px-8 py-4 rounded-2xl font-black text-gray-500 bg-gray-50 hover:bg-gray-200 hover:text-gray-900 transition-all">
                Đóng lại
              </button>
              <button 
  onClick={handleSubmit} 
  disabled={isSubmitting || !formData.word || !formData.reading || !formData.meaning || !formData.levelId || !formData.topicId} 
  className="flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-white bg-primary shadow-[0_6px_0_rgb(0,0,0,0.15)] hover:brightness-110 active:translate-y-1.5 active:shadow-none transition-all disabled:opacity-50 disabled:grayscale"
>
  {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <PlusCircle size={20} strokeWidth={2.5} />} 
  {editId ? 'Lưu cập nhật' : 'Xuất bản Từ vựng'}
</button>
            </div>

          </div>
        </div>
      )}
      
    </div>
  );
};