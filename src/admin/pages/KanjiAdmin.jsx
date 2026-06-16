import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, PlusCircle, Edit, Trash2, X, Plus, Loader2, JapaneseYen, BookOpen, ChevronDown, Check } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Pagination } from '../../components/common/Pagination';
import { CustomDropdown } from '../../components/common/CustomDropdown';

export const KanjiAdmin = () => {
  // --- 1. State Quản lý Dữ liệu ---
  const [kanjis, setKanjis] = useState([]);
  const [levels, setLevels] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0); 

  // --- 2. State Bộ lọc & UI ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // --- 3. State Modal Master-Detail ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialForm = { characters: '', meaning: '', strokeCount: '', han: '', levelId: '', onReadings: [], kunReadings: [], examples: [] };
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
    const loadKanjis = async () => {
      setIsLoading(true);
      try {
        const response = await adminService.getKanjis(searchTerm, filterLevel, currentPage, 10);
        setKanjis(response.data || []);
        setTotalPages(response.totalPages || 1);
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };

    const delayDebounce = setTimeout(() => { loadKanjis(); }, 400); 
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, filterLevel, currentPage, refreshKey]);

  const openAddModal = () => { setEditId(null); setFormData(initialForm); setIsModalOpen(true); setIsClosing(false); };

  const closeWithAnimation = () => {
    setIsClosing(true);
    setTimeout(() => { setIsModalOpen(false); setIsClosing(false); }, 300); // Đợi animation CSS chạy xong
  };

  const openEditModal = async (kanji) => {
    setEditId(kanji.id);
    setIsModalOpen(true);
    setIsClosing(false);
    try {
      const detailResponse = await adminService.getKanjiById(kanji.id);
      const detail = detailResponse.data || detailResponse; 
      setFormData({
        characters: detail.characters, meaning: detail.meaning, strokeCount: detail.strokeCount,
        han: detail.han, levelId: detail.levelId,
        onReadings: detail.onReadings || [], kunReadings: detail.kunReadings || [], examples: detail.examples || []
      });
    } catch (err) { alert('Không thể tải chi tiết Kanji'); closeWithAnimation(); }
  };

  const handleInputChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  const handleDropdownChange = (name, value) => { setFormData(prev => ({ ...prev, [name]: value })); };
  const handleArrayChange = (field, index, key, value) => { const newArray = [...formData[field]]; newArray[index][key] = value; setFormData(prev => ({ ...prev, [field]: newArray })); };
  const addArrayRow = (field, emptyObj) => { setFormData(prev => ({ ...prev, [field]: [...prev[field], emptyObj] })); };
  const removeArrayRow = (field, index) => { const newArray = [...formData[field]]; newArray.splice(index, 1); setFormData(prev => ({ ...prev, [field]: newArray })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.characters || !formData.han || !formData.meaning || !formData.levelId) {
      alert("⚠️ Vui lòng điền đầy đủ các trường Thông tin cơ bản bắt buộc (*) trước khi lưu!");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editId) { await adminService.updateKanji(editId, formData); } 
      else { await adminService.createKanji(formData); }
      closeWithAnimation();
      setRefreshKey(old => old + 1); 
    } catch (err) { alert(`Lỗi: ${err.message}`); } finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id, char) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa Kanji [${char}] không? Dữ liệu không thể khôi phục!`)) {
      try { 
        await adminService.deleteKanji(id); 
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
            <JapaneseYen size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Kho Hán Tự</h1>
            <p className="text-sm font-bold text-gray-400 mt-1">Quản lý từ điển, âm đọc và ví dụ</p>
          </div>
        </div>
        <button 
          onClick={openAddModal}
          className="relative z-10 flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 font-black text-white shadow-[0_6px_0_rgb(0,0,0,0.15)] hover:brightness-110 active:translate-y-1.5 active:shadow-none transition-all"
        >
          <PlusCircle size={22} strokeWidth={2.5} /> Thêm Hán Tự
        </button>
      </div>

      <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors z-10" size={20} strokeWidth={2.5} />
            <input 
              type="text" placeholder="Tìm kiếm theo Hán tự, Âm Hán, Nghĩa..." 
              value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }}
              className={`${inputClassName} pl-14`}
            />
          </div>
          <div className="relative w-full sm:w-[280px] z-20">
            <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" size={20} strokeWidth={2.5} />
            <CustomDropdown 
              value={filterLevel} 
              options={levels} 
              onChange={(val) => { setFilterLevel(val); setCurrentPage(0); }} 
              placeholder="Lọc theo Cấp độ" 
              className="w-full [&>div]:pl-14" 
            />
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar min-h-[400px]">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center"><Loader2 size={40} className="animate-spin text-primary" /></div>
          ) : kanjis.length > 0 ? (
            <table className="w-full min-w-[800px] text-left">
              <thead>
                <tr className="border-b-2 border-gray-100 text-gray-400 dark:border-gray-800">
                  <th className="pb-4 pl-4 font-black uppercase tracking-widest text-xs">Hán Tự</th>
                  <th className="pb-4 font-black uppercase tracking-widest text-xs">Âm Hán</th>
                  <th className="pb-4 font-black uppercase tracking-widest text-xs">Ý Nghĩa</th>
                  <th className="pb-4 font-black uppercase tracking-widest text-xs">Số nét</th>
                  <th className="pb-4 font-black uppercase tracking-widest text-xs">Cấp độ</th>
                  <th className="pb-4 text-center font-black uppercase tracking-widest text-xs pr-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {kanjis.map((k) => (
                  <tr key={k.id} className="group border-b border-gray-50 transition-colors hover:bg-gray-50/50 dark:border-gray-800/50 dark:hover:bg-gray-800/30">
                    <td className="py-4 pl-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm border border-gray-100 text-3xl font-serif font-black text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-white group-hover:scale-110 transition-transform">
                        {k.characters}
                      </div>
                    </td>
                    <td className="py-4 font-black text-primary text-lg tracking-wide">{k.han}</td>
                    <td className="py-4 font-bold text-gray-700 dark:text-gray-200">{k.meaning}</td>
                    <td className="py-4 font-black text-gray-400">{k.strokeCount} <span className="text-xs font-bold uppercase">nét</span></td>
                    <td className="py-4">
                      <span className="inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-black uppercase tracking-widest shadow-sm bg-primary/10 text-primary">
                        {k.levelName}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-50 sm:group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditModal(k)} className="rounded-xl p-2.5 text-primary bg-primary/10 hover:bg-primary hover:text-white transition-all active:scale-95 shadow-sm">
                          <Edit size={18} strokeWidth={2.5} />
                        </button>
                        <button onClick={() => handleDelete(k.id, k.characters)} className="rounded-xl p-2.5 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white dark:bg-red-900/20 dark:hover:bg-red-600 transition-all active:scale-95 shadow-sm">
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
              <p className="text-sm">Không tìm thấy chữ Hán nào phù hợp.</p>
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
                    {editId ? `Cập nhật Kanji` : 'Thêm Hán Tự Mới'}
                  </h2>
                </div>
              </div>
              <button onClick={closeWithAnimation} className="h-12 w-12 flex items-center justify-center text-gray-400 bg-gray-50 hover:bg-gray-200 hover:text-gray-900 rounded-2xl transition-all active:scale-95 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white">
                <X size={24} strokeWidth={2.5} />
              </button>
            </div>

            <div className="p-6 sm:p-10 overflow-y-auto custom-scrollbar flex-1 space-y-10">
              
              <section className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary font-black flex items-center justify-center">1</div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">Thông tin cơ bản</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">Chữ Hán (*)</label>
                    <input name="characters" value={formData.characters} onChange={handleInputChange} required className={`${inputClassName} text-center text-3xl font-serif py-3`} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">Âm Hán Việt (*)</label>
                    <input name="han" value={formData.han} onChange={handleInputChange} required className={`${inputClassName} uppercase text-lg`} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">Ý nghĩa (*)</label>
                    <input name="meaning" value={formData.meaning} onChange={handleInputChange} required className={`${inputClassName} text-lg`} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">Số nét</label>
                    <input type="number" name="strokeCount" value={formData.strokeCount} onChange={handleInputChange} className={`${inputClassName} text-lg`} />
                  </div>
                  <div className="relative z-30">
                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">Cấp độ (*)</label>
                    <CustomDropdown 
                      value={formData.levelId} 
                      options={levels} 
                      onChange={(val) => handleDropdownChange('levelId', val)} 
                      placeholder="Chọn cấp độ" 
                    />
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-20">
                {/* Âm On */}
                <section className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-8 rounded-xl bg-orange-100 text-orange-600 font-black flex items-center justify-center">2</div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white">Âm On (Onyomi)</h3>
                  </div>
                  <div className="space-y-4 mb-6">
                    {formData.onReadings.map((on, idx) => (
                      <div key={idx} className="flex gap-3 group">
                        <input placeholder="Cách đọc (Katakana)" value={on.reading} onChange={(e) => handleArrayChange('onReadings', idx, 'reading', e.target.value)} className={`${inputClassName} py-3`} />
                        <input placeholder="Romaji" value={on.romaji} onChange={(e) => handleArrayChange('onReadings', idx, 'romaji', e.target.value)} className={`${inputClassName} py-3`} />
                        <button type="button" onClick={() => removeArrayRow('onReadings', idx)} className="rounded-2xl bg-red-50 text-red-500 w-14 shrink-0 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"><X size={20} strokeWidth={3} /></button>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={() => addArrayRow('onReadings', { reading: '', romaji: '' })} className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-500 font-black hover:bg-orange-50 hover:border-orange-200 hover:text-orange-500 transition-all flex items-center justify-center gap-2">
                    <Plus size={20} strokeWidth={3} /> Thêm Âm On
                  </button>
                </section>

                <section className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-8 rounded-xl bg-green-100 text-green-600 font-black flex items-center justify-center">3</div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white">Âm Kun (Kunyomi)</h3>
                  </div>
                  <div className="space-y-4 mb-6">
                    {formData.kunReadings.map((kun, idx) => (
                      <div key={idx} className="flex gap-3 group">
                        <input placeholder="Cách đọc (Hiragana)" value={kun.reading} onChange={(e) => handleArrayChange('kunReadings', idx, 'reading', e.target.value)} className={`${inputClassName} py-3`} />
                        <input placeholder="Romaji" value={kun.romaji} onChange={(e) => handleArrayChange('kunReadings', idx, 'romaji', e.target.value)} className={`${inputClassName} py-3`} />
                        <button type="button" onClick={() => removeArrayRow('kunReadings', idx)} className="rounded-2xl bg-red-50 text-red-500 w-14 shrink-0 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"><X size={20} strokeWidth={3} /></button>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={() => addArrayRow('kunReadings', { reading: '', romaji: '' })} className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-500 font-black hover:bg-green-50 hover:border-green-200 hover:text-green-600 transition-all flex items-center justify-center gap-2">
                    <Plus size={20} strokeWidth={3} /> Thêm Âm Kun
                  </button>
                </section>
              </div>

              <section className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-8 w-8 rounded-xl bg-blue-100 text-blue-600 font-black flex items-center justify-center">4</div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">Ví dụ</h3>
                </div>

                <div className="space-y-4 mb-6">
                  {formData.examples.map((ex, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row gap-4">
                      <div className="sm:w-1/3">
                        <input placeholder="Từ/Câu ví dụ" value={ex.content} onChange={(e) => handleArrayChange('examples', idx, 'content', e.target.value)} className={`${inputClassName} py-3`} />
                      </div>
                      <div className="sm:flex-1">
                        <input placeholder="Ý nghĩa tiếng Việt" value={ex.meaning} onChange={(e) => handleArrayChange('examples', idx, 'meaning', e.target.value)} className={`${inputClassName} py-3`} />
                      </div>
                      <div className="sm:w-auto">
                        <button type="button" onClick={() => removeArrayRow('examples', idx)} className="h-[52px] w-14 flex items-center justify-center rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                          <Trash2 size={20} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => addArrayRow('examples', { content: '', meaning: '', displayOrder: formData.examples.length + 1 })} className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-500 font-black hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                  <Plus size={20} strokeWidth={3} /> Bổ sung Ví dụ
                </button>
              </section>

            </div>

   
            <div className="px-10 py-6 border-t border-gray-200/50 dark:border-gray-800 bg-white dark:bg-gray-900 flex justify-end gap-4 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] z-10">
              <button onClick={closeWithAnimation} className="px-8 py-4 rounded-2xl font-black text-gray-500 bg-gray-50 hover:bg-gray-200 hover:text-gray-900 transition-all dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">
                Đóng lại
              </button>
              <button 
  onClick={handleSubmit} 
  disabled={isSubmitting || !formData.characters || !formData.han || !formData.meaning || !formData.levelId} 
  className="flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-white bg-primary shadow-[0_6px_0_rgb(0,0,0,0.15)] hover:brightness-110 active:translate-y-1.5 active:shadow-none transition-all disabled:opacity-50 disabled:grayscale"
>
  {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <PlusCircle size={20} strokeWidth={2.5} />} 
  {editId ? 'Lưu cập nhật' : 'Xuất bản Kanji'}
</button>
            </div>

          </div>
        </div>
      )}
      
    </div>
  );
};