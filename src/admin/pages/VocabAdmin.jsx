import React, { useState, useEffect } from 'react';
import { Search, Filter, PlusCircle, Edit, Trash2, X, Plus, Loader2, Volume2 } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Pagination } from '../../components/common/Pagination';

export const VocabAdmin = () => {
  const [vocabs, setVocabs] = useState([]);
  const [topics, setTopics] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTopic, setFilterTopic] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialForm = { word: '', hiragana: '', meaning: '', audioUrl: '', topicId: '', examples: [] };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => { loadTopics(); }, []);
  useEffect(() => { loadVocabs(); }, [currentPage, filterTopic]);
  useEffect(() => {
    const delayDebounce = setTimeout(() => { setCurrentPage(0); loadVocabs(); }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const loadTopics = async () => {
    try { const data = await adminService.getCompactTopics(); setTopics(data || []); } catch (err) { console.error(err); }
  };

  const loadVocabs = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getVocabs(searchTerm, filterTopic, currentPage, 10);
      setVocabs(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) { console.error(err); } finally { setIsLoading(false); }
  };

  const openAddModal = () => { setEditId(null); setFormData(initialForm); setIsModalOpen(true); };
  
  const openEditModal = async (vocab) => {
    setEditId(vocab.id);
    setIsModalOpen(true);
    try {
      const detail = await adminService.getVocabById(vocab.id);
      setFormData({
        word: detail.word, hiragana: detail.hiragana, meaning: detail.meaning,
        audioUrl: detail.audioUrl || '', topicId: detail.topicId, examples: detail.examples || []
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
      if (editId) await adminService.updateVocab(editId, formData);
      else await adminService.createVocab(formData);
      setIsModalOpen(false);
      loadVocabs();
    } catch (err) { alert(err.message); } finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id, word) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa từ vựng [${word}] không?`)) {
      try { await adminService.deleteVocab(id); loadVocabs(); } catch (err) { alert(err.message); }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Kho Từ Vựng</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Quản lý hệ thống từ vựng, âm thanh phát âm và ngữ cảnh câu ví dụ</p>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-bold text-white shadow-[0_4px_0_rgb(37,99,235)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none transition-all">
          <PlusCircle size={20} /> Thêm từ vựng
        </button>
      </div>

      <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Tìm kiếm từ vựng, cách đọc, ý nghĩa..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 font-medium outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select value={filterTopic} onChange={(e) => setFilterTopic(e.target.value)} className="appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-10 font-bold text-gray-700 outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 cursor-pointer">
              <option value="">Tất cả Chủ đề</option>
              {topics.map(t => <option key={t.id} value={t.id}>{t.topicName || `Chủ đề #${t.id}`}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar min-h-[400px]">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center"><Loader2 size={40} className="animate-spin text-primary" /></div>
          ) : (
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 dark:border-gray-800">
                  <th className="pb-4 pl-4 font-bold uppercase tracking-wider">Từ vựng</th>
                  <th className="pb-4 font-bold uppercase tracking-wider">Cách đọc (Hiragana)</th>
                  <th className="pb-4 font-bold uppercase tracking-wider">Ý nghĩa tiếng Việt</th>
                  <th className="pb-4 font-bold uppercase tracking-wider">Âm thanh</th>
                  <th className="pb-4 text-center font-bold uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {vocabs.map((v) => (
                  <tr key={v.id} className="border-b border-gray-50 transition-colors hover:bg-gray-50/50 dark:border-gray-800/50 dark:hover:bg-gray-800/20">
                    <td className="py-4 pl-4 text-lg font-black text-gray-900 dark:text-white">{v.word}</td>
                    <td className="py-4 font-bold text-primary">{v.hiragana}</td>
                    <td className="py-4 font-bold text-gray-600 dark:text-gray-300">{v.meaning}</td>
                    <td className="py-4">
                      {v.audioUrl ? <div className="inline-flex p-2 rounded-lg bg-green-50 text-green-600 dark:bg-green-900/20"><Volume2 size={18} /></div> : <span className="text-gray-300 font-medium italic">Trống</span>}
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEditModal(v)} className="rounded-lg p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"><Edit size={18} /></button>
                        <button onClick={() => handleDelete(v.id, v.word)} className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
              <h2 className="text-xl font-black text-gray-900 dark:text-white">{editId ? `Chỉnh sửa: ${formData.word}` : 'Thêm từ vựng mới'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-200 rounded-full dark:hover:bg-gray-700"><X size={20} /></button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-primary"></span> Thông tin cốt lõi</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Từ vựng Kanji (*)</label>
                    <input name="word" value={formData.word} onChange={handleInputChange} required placeholder="Vd: 先生" className="w-full font-bold bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Cách đọc Hiragana (*)</label>
                    <input name="hiragana" value={formData.hiragana} onChange={handleInputChange} required placeholder="Vd: せんせい" className="w-full font-bold bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Ý nghĩa tiếng Việt (*)</label>
                    <input name="meaning" value={formData.meaning} onChange={handleInputChange} required placeholder="Vd: Giáo viên" className="w-full font-bold bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Thuộc Chủ đề (Topic) (*)</label>
                    <select name="topicId" value={formData.topicId} onChange={handleInputChange} required className="w-full font-bold bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:border-primary outline-none cursor-pointer">
                      <option value="" disabled>-- Chọn --</option>
                      {topics.map(t => <option key={t.id} value={t.id}>{t.topicName || `Chủ đề #${t.id}`}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-bold text-gray-500 mb-1">Đường dẫn tệp âm thanh (Audio URL)</label>
                  <input name="audioUrl" value={formData.audioUrl} onChange={handleInputChange} placeholder="http://example.com/audio.mp3" className="w-full font-medium bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:border-primary outline-none" />
                </div>
              </div>

              <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 dark:bg-blue-900/10 dark:border-blue-900/30">
                <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 mb-4 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-blue-600"></span> Ngữ cảnh câu ví dụ</h3>
                {formData.examples.map((ex, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-3 mb-3 bg-white dark:bg-gray-800 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50 shadow-sm">
                    <input placeholder="Câu ví dụ chứa từ vựng (vd: 先生は日本人です)" value={ex.content} onChange={(e) => handleExampleChange(idx, 'content', e.target.value)} className="w-full sm:w-1/2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-bold outline-none focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white" />
                    <input placeholder="Nghĩa dịch tiếng Việt (vd: Giáo viên là người Nhật)" value={ex.meaning} onChange={(e) => handleExampleChange(idx, 'meaning', e.target.value)} className="w-full sm:flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-bold outline-none focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white" />
                    <button type="button" onClick={() => removeExampleRow(idx)} className="rounded-lg bg-red-50 px-3 py-2 text-red-500 hover:bg-red-100 dark:bg-red-900/20"><X size={18} /></button>
                  </div>
                ))}
                <button type="button" onClick={addExampleRow} className="w-full py-3 mt-2 rounded-xl border-2 border-dashed border-blue-300 text-blue-600 font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 dark:hover:bg-blue-900/20"><Plus size={18} /> Thêm câu ví dụ minh họa</button>
              </div>
            </div>

            <div className="px-8 py-5 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 dark:text-gray-300">Hủy</button>
              <button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 px-8 py-3 rounded-xl font-black text-white bg-primary shadow-[0_4px_0_rgb(37,99,235)] hover:brightness-110 active:translate-y-1 transition-all disabled:opacity-50">
                {isSubmitting && <Loader2 size={18} className="animate-spin" />} Lưu thông tin từ vựng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};