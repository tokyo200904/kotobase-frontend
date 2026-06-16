import React, { useState, useEffect } from 'react';
import { Search, Filter, PlusCircle, Edit, Trash2, X, Plus, Loader2, BookOpen } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Pagination } from '../../components/common/Pagination';

export const GrammarAdmin = () => {
  const [grammars, setGrammars] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLesson, setFilterLesson] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialForm = { title: '', structure: '', meaning: '', usages: '', note: '', lessonId: '', examples: [] };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => { loadLessons(); }, []);
  useEffect(() => { loadGrammars(); }, [currentPage, filterLesson]);
  useEffect(() => {
    const delayDebounce = setTimeout(() => { setCurrentPage(0); loadGrammars(); }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const loadLessons = async () => {
    try { const data = await adminService.getCompactLessons(); setLessons(data || []); } catch (err) { console.error(err); }
  };

  const loadGrammars = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getGrammars(searchTerm, filterLesson, currentPage, 10);
      setGrammars(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) { console.error(err); } darkness: { setIsLoading(false); }
  };

  const openAddModal = () => { setEditId(null); setFormData(initialForm); setIsModalOpen(true); };

  const openEditModal = async (grammar) => {
    setEditId(grammar.id);
    setIsModalOpen(true);
    try {
      const detail = await adminService.getGrammarById(grammar.id);
      setFormData({
        title: detail.title, structure: detail.structure, meaning: detail.meaning,
        usages: detail.usages || '', note: detail.note || '', lessonId: detail.lessonId, examples: detail.examples || []
      });
    } catch (err) { setIsModalOpen(false); }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleExampleChange = (index, key, value) => {
    const newExamples = [...formData.examples];
    newExamples[index][key] = value;
    setFormData(prev => ({ ...prev, examples: newExamples }));
  };

  const addExampleRow = () => {
    setFormData(prev => ({
      ...prev,
      examples: [...prev.examples, { content: '', meaning: '', displayOrder: prev.examples.length + 1 }]
    }));
  };

  const removeExampleRow = (index) => {
    const newExamples = [...formData.examples];
    newExamples.splice(index, 1);
    setFormData(prev => ({ ...prev, examples: newExamples }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editId) await adminService.updateGrammar(editId, formData);
      else await adminService.createGrammar(formData);
      setIsModalOpen(false);
      loadGrammars();
    } catch (err) { alert(err.message); } finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa cấu trúc [${title}] không?`)) {
      try { await adminService.deleteGrammar(id); loadGrammars(); } catch (err) { alert(err.message); }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Kho Ngữ Pháp</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Quản lý cấu trúc ngữ pháp hệ thống, phân loại theo bài học và ví dụ đính kèm</p>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-bold text-white shadow-[0_4px_0_rgb(37,99,235)] hover:-translate-y-0.5 active:translate-y-1 transition-all">
          <PlusCircle size={20} /> Thêm Cấu Trúc
        </button>
      </div>

      <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Tìm kiếm tiêu đề, cấu trúc, ý nghĩa..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 font-medium outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select value={filterLesson} onChange={(e) => setFilterLesson(e.target.value)} className="appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-10 font-bold text-gray-700 outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 cursor-pointer">
              <option value="">Tất cả Bài học</option>
              {lessons.map(l => <option key={l.id} value={l.id}>Bài {l.id} ({l.levelName})</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-4 min-h-[400px]">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center"><Loader2 size={40} className="animate-spin text-primary" /></div>
          ) : grammars.length > 0 ? (
            grammars.map((g) => (
              <div key={g.id} className="flex flex-col md:flex-row gap-5 rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm hover:border-primary/20 transition-all">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-primary/10 px-2 py-0.5 text-xs font-black text-primary">Bài {g.lessonId}</span>
                    <span className="text-xs font-bold text-gray-400">ID: #{g.id}</span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">{g.title}</h3>
                  <div className="text-sm font-bold text-primary bg-primary/5 px-3 py-1.5 rounded-lg inline-block">Cấu trúc: {g.structure}</div>
                  <p className="text-sm font-bold text-gray-600 dark:text-gray-400">Ý nghĩa: {g.meaning}</p>
                </div>
                
                <div className="flex-1 rounded-xl bg-gray-50/50 p-4 border border-gray-100 dark:bg-gray-800/30 dark:border-gray-800">
                  <span className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2">Ví dụ đại diện ({g.examples?.length || 0})</span>
                  {g.examples && g.examples.length > 0 ? (
                    <div>
                      <p className="text-sm font-black text-gray-800 dark:text-gray-200">{g.examples[0].content}</p>
                      <p className="text-xs font-bold text-gray-500 mt-0.5">{g.examples[0].meaning}</p>
                    </div>
                  ) : <span className="text-xs text-gray-400 italic">Chưa có câu ví dụ</span>}
                </div>

                <div className="flex md:flex-col justify-center gap-2 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-5 dark:border-gray-800">
                  <button onClick={() => openEditModal(g)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors dark:bg-blue-900/20 dark:text-blue-400"><Edit size={16} /> Sửa</button>
                  <button onClick={() => handleDelete(g.id, g.title)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-red-500 bg-red-50 hover:bg-red-100 transition-colors dark:bg-red-900/20 dark:text-red-400"><Trash2 size={16} /> Xóa</button>
                </div>
              </div>
            ))
          ) : <div className="text-center py-20 text-gray-400 font-bold">Không tìm thấy cấu trúc ngữ pháp nào phù hợp.</div>}
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </div>

      {/* MASTER-DETAIL MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-900 w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800">
            <div className="px-8 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
              <h2 className="text-xl font-black text-gray-900 dark:text-white">{editId ? `Chỉnh sửa: ${formData.title}` : 'Thêm cấu trúc ngữ pháp mới'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-200 rounded-full dark:hover:bg-gray-700"><X size={20} /></button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-primary"></span> Thông tin chung</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="col-span-1 sm:col-span-2 md:col-span-1">
                    <label className="block text-xs font-bold text-gray-500 mb-1">Tiêu đề cấu trúc (*)</label>
                    <input name="title" value={formData.title} onChange={handleInputChange} required placeholder="Vd: Thể từ điển + と" className="w-full font-bold bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Công thức cấu trúc (*)</label>
                    <input name="structure" value={formData.structure} onChange={handleInputChange} required placeholder="Vd: V-る + と" className="w-full font-bold bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Thuộc Bài học (Lesson) (*)</label>
                    <select name="lessonId" value={formData.lessonId} onChange={handleInputChange} required className="w-full font-bold bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:border-primary outline-none cursor-pointer">
                      <option value="" disabled>-- Chọn --</option>
                      {lessons.map(l => <option key={l.id} value={l.id}>Bài {l.id} ({l.levelName})</option>)}
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-bold text-gray-500 mb-1">Ý nghĩa tiếng Việt (*)</label>
                  <input name="meaning" value={formData.meaning} onChange={handleInputChange} required placeholder="Vd: Hễ mà... thì..." className="w-full font-bold bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:border-primary outline-none" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Cách dùng chi tiết</label>
                    <textarea name="usages" value={formData.usages} onChange={handleInputChange} rows="3" placeholder="Diễn tả một hệ quả tất yếu, tự nhiên hoặc thói quen..." className="w-full font-medium bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:border-primary outline-none resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Chú ý (Note)</label>
                    <textarea name="note" value={formData.note} onChange={handleInputChange} rows="3" placeholder="Không dùng để thể hiện ý chí, nguyện vọng, mệnh lệnh của người nói..." className="w-full font-medium bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:border-primary outline-none resize-none" />
                  </div>
                </div>
              </div>

              <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-5 dark:bg-purple-900/10 dark:border-purple-900/30">
                <h3 className="text-sm font-black uppercase tracking-widest text-purple-600 mb-4 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-purple-600"></span> Danh sách câu ví dụ</h3>
                {formData.examples.map((ex, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-3 mb-3 bg-white dark:bg-gray-800 p-4 rounded-xl border border-purple-100 dark:border-purple-800/50 shadow-sm">
                    <input placeholder="Câu tiếng Nhật (vd: 冬になると, 雪が降ります)" value={ex.content} onChange={(e) => handleExampleChange(idx, 'content', e.target.value)} className="w-full sm:w-1/2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-bold outline-none focus:border-purple-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white" />
                    <input placeholder="Nghĩa TV (vd: Hễ đến mùa đông thì tuyết rơi)" value={ex.meaning} onChange={(e) => handleExampleChange(idx, 'meaning', e.target.value)} className="w-full sm:flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-bold outline-none focus:border-purple-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white" />
                    <button type="button" onClick={() => removeExampleRow(idx)} className="rounded-lg bg-red-50 px-3 py-2 text-red-500 hover:bg-red-100 dark:bg-red-900/20"><X size={18} /></button>
                  </div>
                ))}
                <button type="button" onClick={addExampleRow} className="w-full py-3 mt-2 rounded-xl border-2 border-dashed border-purple-300 text-purple-600 font-bold hover:bg-purple-50 flex items-center justify-center gap-2 dark:hover:bg-purple-900/20"><Plus size={18} /> Thêm câu ví dụ ngữ pháp</button>
              </div>
            </div>

            <div className="px-8 py-5 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 dark:text-gray-300">Hủy</button>
              <button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 px-8 py-3 rounded-xl font-black text-white bg-primary shadow-[0_4px_0_rgb(37,99,235)] hover:brightness-110 active:translate-y-1 transition-all disabled:opacity-50">
                {isSubmitting && <Loader2 size={18} className="animate-spin" />} Lưu cấu trúc ngữ pháp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};