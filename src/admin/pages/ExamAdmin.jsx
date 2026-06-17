import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, BookOpenCheck, Edit, Trash2, PlusCircle, LayoutList, ChevronDown, ChevronUp } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Pagination } from '../../components/common/Pagination';
import { CustomDropdown } from '../../components/common/CustomDropdown';
import { ExamModal } from '../components/exam/ExamModal';

export const ExamAdmin = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [levels, setLevels] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [expandedRowId, setExpandedRowId] = useState(null);

  useEffect(() => {
    const loadLevels = async () => {
      try { const res = await adminService.getCompactLevels(); setLevels(res.data || res || []); } 
      catch (err) { console.error(err); }
    };
    loadLevels();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const loadExams = async () => {
      try {
        const response = await adminService.getExams(searchTerm, filterLevel, currentPage, 10);
        setExams(response.data || response.content || []);
        setTotalPages(response.totalPages || 1);
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };
    const delayDebounce = setTimeout(() => { loadExams(); }, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, filterLevel, currentPage, refreshKey]);

  const handleTogglePublish = async (exam) => {
    if (!window.confirm(exam.isPublished ? '⚠️ Ẩn đề thi này khỏi hệ thống học viên?' : '✅ Xuất bản đề thi này cho học viên làm?')) return;
    try {
      const updatedExam = { ...exam, isPublished: !exam.isPublished };
      setExams(prev => prev.map(e => e.id === exam.id ? updatedExam : e));
      await adminService.updateExam(exam.id, updatedExam);
    } catch (err) { alert(`Lỗi: ${err.message}`); setRefreshKey(k => k + 1); }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`⚠️ BẠN CÓ CHẮC MUỐN XÓA TOÀN BỘ ĐỀ THI [${title}] VÀ CÂU HỎI BÊN TRONG?`)) {
      try { await adminService.deleteExam(id); setRefreshKey(k => k + 1); } 
      catch (err) { alert(`Lỗi: ${err.message}`); }
    }
  };

  const toggleRow = (id) => setExpandedRowId(prev => prev === id ? null : id);

  const inputClass = "w-full rounded-2xl border border-gray-200 bg-gray-100/50 px-5 py-4 font-bold text-gray-900 outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white";

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="relative z-10 flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner"><BookOpenCheck size={32} strokeWidth={2.5} /></div>
          <div><h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Quản lý Đề Thi JLPT</h1><p className="text-sm font-bold text-gray-400 mt-1">Quản trị khung cấu trúc đề thi thử các cấp độ</p></div>
        </div>
        <button onClick={() => { setEditId(null); setIsModalOpen(true); }} className="relative z-10 flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 font-black text-white shadow-[0_6px_0_rgb(0,0,0,0.15)] hover:brightness-110 active:translate-y-1.5 transition-all"><PlusCircle size={22}/> Tạo Đề Thi</button>
      </div>

      <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative group md:col-span-2"><Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={20}/><input type="text" placeholder="Tìm tên đề thi..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }} className={`${inputClass} pl-14`} /></div>
          <div className="relative z-20"><CustomDropdown value={filterLevel} options={levels} onChange={(val) => { setFilterLevel(val); setCurrentPage(0); }} placeholder="Lọc Cấp độ" optionLabelKey="levelName" optionLabelKey="levelName" className="w-full" /></div>
        </div>

        <div className="overflow-x-auto custom-scrollbar min-h-[400px]">
          {isLoading ? (
             <div className="flex h-64 items-center justify-center"><Loader2 size={40} className="animate-spin text-primary" /></div>
          ) : exams.length > 0 ? (
            <table className="w-full min-w-[1000px] text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-100 text-gray-400 dark:border-gray-800">
                  <th className="pb-4 pl-4 font-black uppercase text-xs w-10"></th>
                  <th className="pb-4 font-black uppercase text-xs">Đề Thi</th>
                  <th className="pb-4 font-black uppercase text-xs">Thời gian & Điểm</th>
                  <th className="pb-4 font-black uppercase text-xs text-center">Xuất bản</th>
                  <th className="pb-4 text-center font-black uppercase text-xs pr-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => (
                  <React.Fragment key={exam.id}>
                    <tr className={`border-b border-gray-50 transition-colors hover:bg-gray-50/50 dark:border-gray-800/50 dark:hover:bg-gray-800/30 ${expandedRowId === exam.id ? 'bg-primary/5' : ''}`}>
                      <td className="py-4 pl-4 text-center">
                        <button onClick={() => toggleRow(exam.id)} className="p-1.5 bg-gray-100 text-gray-500 rounded-lg hover:bg-primary hover:text-white transition-colors dark:bg-gray-800 dark:text-gray-400">
                          {expandedRowId === exam.id ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                        </button>
                      </td>
                      <td className="py-4">
                        <div className="font-black text-gray-900 dark:text-white text-lg">{exam.title}</div>
                        <div className="text-xs font-bold text-gray-500 flex items-center gap-2 mt-1">
                          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md">{exam.levelName}</span>
                          <span>{exam.sections?.length || 0} Phần thi</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="text-sm font-bold text-gray-700 dark:text-gray-300">{exam.durationMinutes} Phút | {exam.totalQuestions} Câu</div>
                        <div className="text-xs font-bold text-green-600 mt-0.5">Điểm đỗ: {exam.passingScore}/{exam.maxScore}</div>
                      </td>
                      <td className="py-4 text-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={exam.isPublished} onChange={() => handleTogglePublish(exam)} className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                        </label>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => { setEditId(exam.id); setIsModalOpen(true); }} className="p-2.5 text-primary bg-primary/10 hover:bg-primary hover:text-white rounded-xl transition-all shadow-sm"><Edit size={18}/></button>
                          <button onClick={() => handleDelete(exam.id, exam.title)} className="p-2.5 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm"><Trash2 size={18}/></button>
                        </div>
                      </td>
                    </tr>

                    {expandedRowId === exam.id && (
                      <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                        <td colSpan="5" className="p-6">
                          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
                            <div className="bg-gray-100 dark:bg-gray-800 px-5 py-3 font-black text-xs uppercase tracking-widest text-gray-500 flex items-center gap-2">
                              <LayoutList size={16}/> Cấu trúc Phần Thi (Sections)
                            </div>
                            {exam.sections?.length > 0 ? (
                              <table className="w-full text-left text-sm">
                                <tbody>
                                  {exam.sections.sort((a,b) => a.displayOrder - b.displayOrder).map(sec => (
                                    <tr key={sec.id} className="border-t border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                      <td className="py-3 pl-5 font-bold text-gray-800 dark:text-gray-200"><span className="text-gray-400 mr-2">#{sec.displayOrder}</span>{sec.sectionName}</td>
                                      <td className="py-3 font-bold text-primary text-xs">{sec.sectionType}</td>
                                      <td className="py-3 text-xs font-bold text-gray-500">{sec.durationMinutes} Phút | {sec.totalQuestions} Câu</td>
                                      <td className="py-3 text-xs font-bold text-red-500">Điểm liệt: {sec.minPassingScore}</td>
                                      <td className="py-3 pr-5 text-right">
                                        <button 
  onClick={() => navigate(`/admin/exams/sections/${sec.id}/questions`, { 
    state: { 
      sectionName: sec.sectionName, 
      examTitle: exam.title,
      sectionType: sec.sectionType 
    } 
  })}
  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-50 hover:bg-orange-500 hover:text-white transition-all shadow-sm"
>
  Quản lý Câu hỏi
</button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                              <div className="p-4 text-center text-sm font-bold text-gray-400">Đề thi này chưa có cấu trúc phần thi nào.</div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <BookOpenCheck size={48} className="mb-4 opacity-50" />
              <p className="font-bold text-lg">Trống rỗng!</p>
            </div>
          )}
        </div>
        {totalPages > 1 && <div className="mt-8 flex justify-center"><Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /></div>}
      </div>

      <ExamModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} editId={editId} onSuccess={() => setRefreshKey(k => k + 1)} levels={levels} />
    </div>
  );
};