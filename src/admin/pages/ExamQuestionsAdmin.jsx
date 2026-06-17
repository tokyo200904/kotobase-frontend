import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Loader2, PlusCircle, ArrowLeft, LayoutList, HelpCircle, Edit, Trash2, Plus, ChevronDown, ChevronUp, Image as ImageIcon, Volume2, CheckCircle2 } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { QuestionGroupModal } from '../components/exam/QuestionGroupModal';
import { QuestionModal } from '../components/exam/QuestionModal';

const getFullMediaUrl = (url) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `http://localhost:8080${url}`;
};

export const ExamQuestionsAdmin = () => {
  const { sectionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const sectionName = location.state?.sectionName || `Phần thi #${sectionId}`;
  const examTitle = location.state?.examTitle || 'Đề thi';
  const sectionType = location.state?.sectionType || ''; 

  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [expandedGroups, setExpandedGroups] = useState({});

  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editGroupId, setEditGroupId] = useState(null);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [targetGroupId, setTargetGroupId] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const loadGroups = async () => {
      try {
        const res = await adminService.getQuestionGroupsBySection(sectionId);
        const sortedGroups = (res.data || res || []).sort((a,b) => a.displayOrder - b.displayOrder);
        setGroups(sortedGroups);
        
        if (sortedGroups.length > 0) {
          setExpandedGroups({ [sortedGroups[0].id]: true });
        }
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };
    loadGroups();
  }, [sectionId, refreshKey]);

  const toggleGroup = (id) => {
    setExpandedGroups(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDeleteGroup = async (id) => {
    if (window.confirm('⚠️ XÓA TOÀN BỘ NHÓM NÀY VÀ TẤT CẢ CÂU HỎI BÊN TRONG?')) {
      try { await adminService.deleteQuestionGroup(id); setRefreshKey(k => k+1); } 
      catch (err) { alert(`Lỗi: ${err.message}`); }
    }
  };

  const handleDeleteQuestion = async (qId) => {
    if (window.confirm('❓ Bạn có chắc chắn muốn xóa riêng câu hỏi con này không?')) {
      try { await adminService.deleteQuestion(qId); setRefreshKey(k => k + 1); } 
      catch (err) { alert(`Lỗi khi xóa câu hỏi: ${err.message}`); }
    }
  };

  const translateGroupType = (type) => {
    switch(type?.toLowerCase()) {
      case 'standalone': return 'Từ vựng / Ngữ pháp';
      case 'reading': return 'Đọc hiểu (Passage)';
      case 'listening': return 'Nghe hiểu (Choukai)';
      default: return type;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-24">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="relative z-10 flex items-center gap-5">
          <button onClick={() => navigate('/admin/exams')} className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white/10 text-white hover:bg-white hover:text-gray-900 transition-all backdrop-blur-sm">
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">{sectionName}</h1>
            <div className="flex items-center gap-2 mt-2 text-sm font-bold text-gray-400">
              <span className="bg-primary/20 text-primary px-3 py-1 rounded-lg uppercase tracking-wider text-[10px]">{sectionType}</span>
              <span>Đề thi: {examTitle}</span>
            </div>
          </div>
        </div>
        <button onClick={() => { setEditGroupId(null); setIsGroupModalOpen(true); }} className="relative z-10 flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 font-black text-white shadow-[0_6px_0_rgb(0,0,0,0.15)] hover:brightness-110 active:translate-y-1.5 active:shadow-none transition-all">
          <PlusCircle size={22}/> Nhóm Mới
        </button>
      </div>

      <div className="space-y-6">
        {isLoading ? (
           <div className="flex h-64 items-center justify-center bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800"><Loader2 size={40} className="animate-spin text-primary" /></div>
        ) : groups.length > 0 ? (
          groups.map((group) => (
            <div key={group.id} className={`bg-white dark:bg-gray-900 rounded-[2.5rem] border transition-all duration-300 shadow-sm overflow-hidden ${expandedGroups[group.id] ? 'border-primary/30 ring-4 ring-primary/5' : 'border-gray-100 dark:border-gray-800 hover:border-gray-300'}`}>
              
              <div 
                onClick={() => toggleGroup(group.id)}
                className="flex items-start justify-between p-6 cursor-pointer select-none"
              >
                <div className="flex gap-5 flex-1 pr-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 text-orange-600 flex items-center justify-center shrink-0 font-black text-xl shadow-inner border border-orange-200/50">
                    {group.displayOrder}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-500 px-2.5 py-1 rounded-md dark:bg-gray-800">{translateGroupType(group.groupType)}</span>
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">ID: #{group.id}</span>
                      <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md ml-auto flex items-center gap-1"><LayoutList size={12}/> {group.questions?.length || 0} Câu</span>
                    </div>
                    
                    {group.groupType === 'reading' ? (
                      <div className="text-sm font-bold text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">{group.content}</div>
                    ) : (
                      <h3 className="text-lg font-black text-gray-900 dark:text-white line-clamp-1">{group.content || 'Nhóm câu hỏi trắc nghiệm chung'}</h3>
                    )}

                    {(group.imageUrl || group.audioUrl) && (
                      <div className="flex items-center gap-4 mt-3">
                        {group.imageUrl && <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg"><ImageIcon size={14} className="text-blue-500"/> Có đính kèm Ảnh</div>}
                        {group.audioUrl && <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg"><Volume2 size={14} className="text-orange-500"/> Có đính kèm Audio</div>}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button onClick={(e) => { e.stopPropagation(); setEditGroupId(group.id); setIsGroupModalOpen(true); }} className="h-10 w-10 flex items-center justify-center text-primary bg-primary/10 hover:bg-primary hover:text-white rounded-xl transition-all shadow-sm"><Edit size={16} strokeWidth={2.5}/></button>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteGroup(group.id); }} className="h-10 w-10 flex items-center justify-center text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm"><Trash2 size={16} strokeWidth={2.5}/></button>
                  <div className="h-8 w-px bg-gray-200 mx-1"></div>
                  <div className={`text-gray-400 transition-transform duration-300 ${expandedGroups[group.id] ? 'rotate-180 text-primary' : ''}`}>
                    <ChevronDown size={24} strokeWidth={2.5}/>
                  </div>
                </div>
              </div>

              <div className={`transition-all duration-500 ease-in-out ${expandedGroups[group.id] ? 'max-h-[5000px] opacity-100 border-t border-gray-50 dark:border-gray-800' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                <div className="p-6 bg-gray-50/50 dark:bg-gray-900/30">
                  
                  {(group.groupType === 'reading' && group.content) && (
                    <div className="mb-6 p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 shadow-inner text-sm font-medium text-gray-700 leading-loose whitespace-pre-wrap">
                      {group.content}
                    </div>
                  )}
                  {group.audioUrl && (
                    <div className="mb-6 bg-white p-3 rounded-2xl border border-gray-200 shadow-sm inline-block">
                      <audio src={getFullMediaUrl(group.audioUrl)} controls className="h-10 w-72" />
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-black uppercase text-gray-400 flex items-center gap-1.5"><LayoutList size={14}/> Danh sách câu hỏi</h4>
                    <button onClick={() => { setTargetGroupId(group.id); setSelectedQuestionId(null); setIsQuestionModalOpen(true); }} className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-black transition-all shadow-sm">
                      <Plus size={14} strokeWidth={3}/> Thêm câu hỏi
                    </button>
                  </div>

                  {group.questions?.length > 0 ? (
                    <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {group.questions?.sort((a,b)=>a.displayOrder-b.displayOrder).map((q) => (
                         <li key={q.id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col justify-between gap-4 group/item hover:border-blue-200 transition-colors shadow-sm">
                           
                           <div className="flex items-start gap-4">
                             <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-black text-sm flex items-center justify-center shrink-0 shadow-inner">{q.displayOrder}</div>
                             <div className="flex-1">
                               <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">{q.content}</p>
                               {(q.imageUrl || q.audioUrl) && (
                                 <div className="flex gap-2 mb-3">
                                   {q.imageUrl && <img src={getFullMediaUrl(q.imageUrl)} className="h-12 rounded border" alt="q-img" />}
                                   {q.audioUrl && <audio src={getFullMediaUrl(q.audioUrl)} controls className="h-8 w-32" />}
                                 </div>
                               )}
                               <div className="inline-flex items-center bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-100">
                                 <CheckCircle2 size={14} className="mr-1.5"/>
                                 <span className="text-[11px] font-black uppercase tracking-wider">{q.answers?.find(a => a.isCorrect)?.content || 'Chưa định nghĩa'}</span>
                               </div>
                             </div>
                           </div>

                           <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-50">
                             <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Trọng số: <span className="text-gray-900">{q.point} điểm</span></span>
                             <div className="flex items-center gap-2">
                               <button onClick={() => { setTargetGroupId(group.id); setSelectedQuestionId(q.id); setIsQuestionModalOpen(true); }} className="px-3 py-1.5 bg-gray-50 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg text-xs font-bold transition-all border shadow-sm flex items-center gap-1.5"><Edit size={12} strokeWidth={2.5}/> Sửa</button>
                               <button onClick={() => handleDeleteQuestion(q.id)} className="px-3 py-1.5 bg-gray-50 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg text-xs font-bold transition-all border shadow-sm"><Trash2 size={12} strokeWidth={2.5}/></button>
                             </div>
                           </div>

                         </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-6 bg-white rounded-2xl border border-dashed border-gray-200">
                      <p className="text-xs font-bold text-gray-400 italic">Chưa có câu hỏi con nào. Hãy bấm "Thêm câu hỏi" ở góc phải!</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 shadow-sm"><HelpCircle size={48} className="mb-4 opacity-50" /><p className="font-bold text-lg">Chưa có dữ liệu câu hỏi.</p></div>
        )}
      </div>

<QuestionGroupModal 
  isOpen={isGroupModalOpen} 
  onClose={() => setIsGroupModalOpen(false)} 
  editId={editGroupId} 
  groupData={groups.find(g => g.id === editGroupId)} 
  sectionId={sectionId} 
  sectionType={sectionType} 
  onSuccess={() => setRefreshKey(k=>k+1)} 
/>      
      <QuestionModal isOpen={isQuestionModalOpen} onClose={() => setIsQuestionModalOpen(false)} questionId={selectedQuestionId} groupId={targetGroupId} onSuccess={() => setRefreshKey(k=>k+1)} />
    </div>
  );
};