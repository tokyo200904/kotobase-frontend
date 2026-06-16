import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Edit, Trash2, Loader2, BookOpen, AlignLeft, Gamepad2 } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Pagination } from '../../components/common/Pagination';
import { CustomDropdown } from '../../components/common/CustomDropdown';
// Import Modal vừa tạo
import { GrammarModal } from '../components/grammar/GrammarModal';

export const GrammarAdmin = () => {
  const [grammars, setGrammars] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0); 
  const [levels, setLevels] = useState([]);
  const [lessons, setLessons] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterLesson, setFilterLesson] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // States quản lý bật tắt Modal (Rất ngắn gọn)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const loadLevels = async () => {
      try { const res = await adminService.getCompactLevels(); setLevels(res.data || res || []); } 
      catch (err) { console.error(err); }
    };
    loadLevels();
  }, []);

  useEffect(() => {
    if (!filterLevel) { setLessons([]); return; }
    const fetchLessons = async () => {
      try { const res = await adminService.getCompactLessonsByLevel(filterLevel, 'grammar'); setLessons(res.data || res || []); } 
      catch (err) { console.error(err); }
    };
    fetchLessons();
  }, [filterLevel]);

  useEffect(() => {
    setIsLoading(true);

    const loadGrammars = async () => {
      try {
        const response = await adminService.getGrammars(searchTerm, filterLevel, filterLesson, currentPage, 10);
        setGrammars(response.data || []);
        setTotalPages(response.totalPages || 1);
      } catch (err) { 
        console.error(err); 
      } finally { 
        setIsLoading(false); 
      }
    };
    
    const delayDebounce = setTimeout(() => { loadGrammars(); }, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, filterLevel, filterLesson, currentPage, refreshKey]);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Xóa ngữ pháp [${title}]? Các bài tập đi kèm cũng sẽ bị xóa!`)) {
      try { await adminService.deleteGrammar(id); setRefreshKey(old => old + 1); } 
      catch (err) { alert(`Lỗi: ${err.message}`); }
    }
  };

  const inputClass = "w-full rounded-2xl border border-gray-200 bg-gray-100/50 px-5 py-4 font-bold text-gray-900 outline-none transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:focus:bg-gray-900";

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="relative z-10 flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
            <BookOpen size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Kho Ngữ Pháp</h1>
            <p className="text-sm font-bold text-gray-400 mt-1">Biên soạn cấu trúc, ví dụ và bài tập xếp câu</p>
          </div>
        </div>
        <button onClick={() => { setEditId(null); setIsModalOpen(true); }} className="relative z-10 flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 font-black text-white shadow-[0_6px_0_rgb(0,0,0,0.15)] hover:brightness-110 active:translate-y-1.5 active:shadow-none transition-all">
          <PlusCircle size={22} strokeWidth={2.5} /> Thêm Cấu Trúc
        </button>
      </div>

      {/* BỘ LỌC & DANH SÁCH */}
      <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors z-10" size={20} strokeWidth={2.5} />
            <input type="text" placeholder="Tìm theo tên, ý nghĩa..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }} className={`${inputClass} pl-14`} />
          </div>
          <div className="relative z-20">
            <CustomDropdown value={filterLevel} options={levels} onChange={(val) => { setFilterLevel(val); setFilterLesson(''); setCurrentPage(0); }} placeholder="Lọc theo Cấp độ" optionLabelKey="levelName" className="w-full" />
          </div>
          <div className={`relative z-10 transition-opacity duration-300 ${filterLevel ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
            <CustomDropdown value={filterLesson} options={lessons} onChange={(val) => { setFilterLesson(val); setCurrentPage(0); }} placeholder="Lọc theo Bài học" optionLabelKey="title" className="w-full" />
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar min-h-[400px]">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center"><Loader2 size={40} className="animate-spin text-primary" /></div>
          ) : grammars.length > 0 ? (
            <table className="w-full min-w-[800px] text-left">
              <thead>
                <tr className="border-b-2 border-gray-100 text-gray-400 dark:border-gray-800">
                  <th className="pb-4 pl-4 font-black uppercase tracking-widest text-xs">Cấu trúc</th>
                  <th className="pb-4 font-black uppercase tracking-widest text-xs">Phân loại</th>
                  <th className="pb-4 font-black uppercase tracking-widest text-xs">Ý Nghĩa Cốt lõi</th>
                  <th className="pb-4 font-black uppercase tracking-widest text-xs">Dữ liệu đi kèm</th>
                  <th className="pb-4 text-center font-black uppercase tracking-widest text-xs pr-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {grammars.map((g) => (
                  <tr key={g.id} className="group border-b border-gray-50 transition-colors hover:bg-gray-50/50 dark:border-gray-800/50 dark:hover:bg-gray-800/30">
                    <td className="py-4 pl-4">
                      <div className="font-black text-gray-900 dark:text-white text-lg mb-1">{g.title}</div>
                      <div className="inline-flex rounded-lg bg-gray-100 px-2 py-1 text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700">CT: {g.structure}</div>
                    </td>
                    <td className="py-4">
                      <div className="flex flex-col items-start gap-1.5">
                        <span className="inline-flex items-center rounded-lg bg-primary/10 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-primary">{g.levelName}</span>
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{g.lessonTitle}</span>
                      </div>
                    </td>
                    <td className="py-4 font-bold text-gray-700 dark:text-gray-200">{g.meaning}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-xs font-bold text-blue-500 bg-blue-50 px-2.5 py-1.5 rounded-lg dark:bg-blue-900/20"><AlignLeft size={14} /> {g.examples?.length || 0} ví dụ</span>
                        <span className="flex items-center gap-1 text-xs font-bold text-orange-500 bg-orange-50 px-2.5 py-1.5 rounded-lg dark:bg-orange-900/20"><Gamepad2 size={14} /> {g.exercises?.length || 0} bài tập</span>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-50 sm:group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditId(g.id); setIsModalOpen(true); }} className="rounded-xl p-2.5 text-primary bg-primary/10 hover:bg-primary hover:text-white transition-all active:scale-95 shadow-sm"><Edit size={18} strokeWidth={2.5} /></button>
                        <button onClick={() => handleDelete(g.id, g.title)} className="rounded-xl p-2.5 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-sm"><Trash2 size={18} strokeWidth={2.5} /></button>
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
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
             <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </div>

      {/* GỌI MODAL COMPONENT TẠI ĐÂY */}
      <GrammarModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        editId={editId} 
        onSuccess={() => setRefreshKey(old => old + 1)} 
        levels={levels} 
      />
    </div>
  );
};