import React, { useState, useEffect } from 'react';
import { X, Loader2, ListOrdered, FileText, Volume2, Image as ImageIcon, Trash2, CheckCircle2, UploadCloud, Settings, Edit } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { CustomDropdown } from '../../../components/common/CustomDropdown';
import { QuestionModal } from './QuestionModal';

const GROUP_TYPES = [
  { id: 'standalone', name: 'Từ vựng / Ngữ pháp (Standalone)' },
  { id: 'reading', name: 'Nhóm Đọc hiểu (Reading)' },
  { id: 'listening', name: 'Nhóm Nghe hiểu (Listening)' }
];

export const QuestionGroupModal = ({ isOpen, onClose, editId, groupData, sectionId, sectionType, onSuccess }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingTarget, setUploadingTarget] = useState({ level: null, type: null });

  const [subQuestions, setSubQuestions] = useState([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  const [isChildModalOpen, setIsChildModalOpen] = useState(false);
  const [selectedChildQId, setSelectedChildQId] = useState(null);

  const initialForm = {
    groupType: 'standalone', content: '', displayOrder: 1, audioId: '', audioUrl: '', imageId: '', imageUrl: ''
  };
  const [formData, setFormData] = useState(initialForm);

  const loadSubQuestions = async (groupId) => {
    setIsLoadingQuestions(true);
    try {
      const res = await adminService.getQuestionsByGroup(groupId);
      setSubQuestions(res.data || res || []);
    } catch (err) { console.error("Lỗi tải câu hỏi con:", err); }
    finally { setIsLoadingQuestions(false); }
  };

  useEffect(() => {
    if (isOpen) {
      if (editId && groupData) {
        setFormData({
          groupType: groupData.groupType || 'standalone',
          content: groupData.content || '',
          displayOrder: groupData.displayOrder || 1,
          audioId: groupData.audioId || '',
          // Nối thêm domain localhost:8080 để khung preview có thể hát nhạc/hiển thị ảnh cũ lên luôn
          audioUrl: groupData.audioUrl ? (groupData.audioUrl.startsWith('http') ? groupData.audioUrl : `http://localhost:8080${groupData.audioUrl}`) : '',
          imageId: groupData.imageId || '',
          imageUrl: groupData.imageUrl ? (groupData.imageUrl.startsWith('http') ? groupData.imageUrl : `http://localhost:8080${groupData.imageUrl}`) : ''
        });
        loadSubQuestions(editId);
      } else {
        let autoType = 'standalone';
        const typeLower = sectionType?.toLowerCase();
        if (typeLower === 'reading') autoType = 'reading';
        if (typeLower === 'listening') autoType = 'listening';

        setFormData({ ...initialForm, groupType: autoType });
        setSubQuestions([]);
      }
    }
  }, [editId, isOpen, groupData, sectionType]);

  const triggerClose = () => { setIsClosing(true); setTimeout(() => { onClose(); setIsClosing(false); }, 300); };
  const handleGroupChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'displayOrder' ? (value ? parseInt(value, 10) : 1) : value }));
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0]; if (!file) return;
    setUploadingTarget({ level: 'group', type });
    try {
      let id, relativeUrl;
      if (type === 'audio') {
        const res = await adminService.uploadAudio(file); const data = res.data || res; id = data.id; relativeUrl = data.url;
      } else {
        const res = await adminService.uploadImage(file); const data = res.data || res; id = data.id; relativeUrl = data.imageUrl;
      }
      const fullUrl = relativeUrl.startsWith('http') ? relativeUrl : `http://localhost:8080${relativeUrl}`;
      setFormData(prev => ({ ...prev, [type === 'audio' ? 'audioId' : 'imageId']: id, [type === 'audio' ? 'audioUrl' : 'imageUrl']: fullUrl }));
    } catch (err) { alert("Lỗi upload: " + err.message); } 
    finally { setUploadingTarget({ level: null, type: null }); e.target.value = null; }
  };

  const handleDeleteChildQuestion = async (qId) => {
    if (window.confirm('❓ Xóa riêng câu hỏi con này trực tiếp bên trong nhóm?')) {
      try {
        await adminService.deleteQuestion(qId);
        alert("✅ Xóa câu hỏi con thành công!");
        loadSubQuestions(editId);
        onSuccess();
      } catch (err) { alert(`Lỗi: ${err.message}`); }
    }
  };

  const handleSubmitGroup = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        groupType: formData.groupType,
        content: formData.content,
        displayOrder: formData.displayOrder,
        audioId: formData.audioId ? parseInt(formData.audioId, 10) : null,
        imageId: formData.imageId ? parseInt(formData.imageId, 10) : null,
        questions: subQuestions.map(q => ({
          id: q.id,
          content: q.content,
          point: q.point,
          displayOrder: q.displayOrder,
          audioId: q.audioId,
          imageId: q.imageId,
          answers: q.answers?.map(a => ({
            id: a.id, content: a.content, isCorrect: a.isCorrect, displayOrder: a.displayOrder, explanation: a.explanation
          }))
        }))
      };

      if (editId) {
        await adminService.updateQuestionGroup(editId, payload);
        alert("✅ Cập nhật thông tin nhóm thành công!");
      } else {
        await adminService.createQuestionGroup(sectionId, payload);
        alert("🎉 Khởi tạo vỏ Nhóm thành công!");
      }
      onSuccess(); triggerClose();
    } catch (err) { alert(`Lỗi: ${err.message}`); } finally { setIsSubmitting(false); }
  };

  if (!isOpen && !isClosing) return null;
  const inputClass = "w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 font-bold text-gray-900 outline-none focus:border-primary focus:bg-white";

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-md p-4 transition-all duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      <div className={`bg-[#f8fafc] dark:bg-gray-950 w-full max-w-5xl h-[95vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-gray-200/50 dark:border-gray-800 transition-all duration-300 ${isClosing ? 'scale-95 opacity-0 translate-y-4' : 'scale-100 opacity-100 translate-y-0'}`}>
        
        <div className="px-10 py-6 border-b border-gray-200/50 bg-white dark:bg-gray-900 flex items-center justify-between z-30">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center"><Settings size={24}/></div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">{editId ? 'Quản lý cấu trúc Nhóm' : 'Khởi tạo vỏ Nhóm Câu hỏi'}</h2>
              <p className="text-xs font-bold text-gray-400">Section ID: #{sectionId}</p>
            </div>
          </div>
          <button type="button" onClick={triggerClose} className="h-12 w-12 flex items-center justify-center bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-200"><X size={24}/></button>
        </div>

        <div className="p-6 sm:p-10 overflow-y-auto custom-scrollbar flex-1 space-y-8 bg-gray-50/50 dark:bg-gray-950/50 pb-40">
          
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative z-20">
            <h3 className="font-black text-base mb-4 text-gray-900 dark:text-white">1. Cấu hình nội dung chung của Nhóm</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="relative z-30">
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Loại Nhóm</label>
                <CustomDropdown value={formData.groupType} options={GROUP_TYPES} onChange={(val)=>setFormData(p=>({...p, groupType:val}))} placeholder="Chọn Loại" />
              </div>
              <div><label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Thứ tự nhóm</label><input type="number" name="displayOrder" value={formData.displayOrder} onChange={handleGroupChange} className={inputClass} /></div>
            </div>

            <div className="space-y-4">
              {formData.groupType === 'reading' && (
                <div><label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Bài văn đọc hiểu</label><textarea name="content" value={formData.content} onChange={handleGroupChange} rows="4" className={`${inputClass} resize-y text-sm`} placeholder="Copy bài đọc hiểu tiếng Nhật vào đây..." /></div>
              )}
              {formData.groupType === 'standalone' && (
                <div><label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Tiêu đề nhóm</label><input name="content" value={formData.content} onChange={handleGroupChange} className={inputClass} placeholder="Vd: Hãy điền trợ từ thích hợp..." /></div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
                <div className="p-3 bg-gray-50 rounded-xl border flex justify-between items-center">
                  <span className="text-gray-500">Hình ảnh gốc nhóm:</span>
                  {formData.imageUrl ? <div className="flex items-center gap-1.5"><img src={formData.imageUrl} className="h-8 rounded" /><button type="button" onClick={()=>setFormData(p=>({...p,imageId:'',imageUrl:''}))} className="text-red-500">Xóa</button></div> : 
                    <button type="button" onClick={()=>document.getElementById('g-img-file').click()} className="text-blue-600">{uploadingTarget.type==='image'?'Tải...':'Tải lên'}</button>}
                  <input type="file" accept="image/*" id="g-img-file" className="hidden" onChange={(e)=>handleFileUpload(e,'image')} />
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border flex justify-between items-center">
                  <span className="text-gray-500">Âm thanh gốc nhóm:</span>
                  {formData.audioUrl ? <div className="flex items-center gap-1.5"><audio src={formData.audioUrl} controls className="h-6 w-32" /><button type="button" onClick={()=>setFormData(p=>({...p,audioId:'',audioUrl:''}))} className="text-red-500">Xóa</button></div> : 
                    <button type="button" onClick={()=>document.getElementById('g-aud-file').click()} className="text-orange-500">{uploadingTarget.type==='audio'?'Tải...':'Tải lên'}</button>}
                  <input type="file" accept="audio/*" id="g-aud-file" className="hidden" onChange={(e)=>handleFileUpload(e,'audio')} />
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
               <button type="button" onClick={handleSubmitGroup} disabled={isSubmitting} className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-black rounded-xl text-xs flex items-center gap-2">
                 {isSubmitting ? <Loader2 size={14} className="animate-spin"/> : <CheckCircle2 size={14}/>} Lưu thông tin vỏ nhóm
               </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative z-10">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-50">
              <h3 className="font-black text-base text-gray-900 dark:text-white">2. Danh sách Câu hỏi con thuộc Nhóm này</h3>
              {editId ? (
                <button 
                  type="button" 
                  onClick={() => { setSelectedChildQId(null); setIsChildModalOpen(true); }}
                  className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl text-xs font-black flex items-center gap-1 transition-all"
                >
                  Thêm câu hỏi con
                </button>
              ) : (
                <span className="text-xs text-orange-500 font-bold">⚠️ Vui lòng 'Lưu thông tin vỏ nhóm' trước khi tạo câu hỏi con!</span>
              )}
            </div>

            {isLoadingQuestions ? (
              <div className="flex py-8 justify-center"><Loader2 size={24} className="animate-spin text-primary"/></div>
            ) : subQuestions.length > 0 ? (
              <div className="space-y-3">
                {subQuestions.sort((a,b)=>a.displayOrder-b.displayOrder).map((q, idx) => (
                  <div key={q.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-md bg-blue-100 text-blue-600 font-black text-xs flex items-center justify-center">{q.displayOrder || idx + 1}</div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{q.content}</p>
                        <span className="text-[10px] font-black text-gray-400">Trọng số: {q.point} điểm | Đáp án đúng: {q.answers?.find(a=>a.isCorrect)?.content || 'Chưa gán'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button 
                        type="button" 
                        onClick={() => { setSelectedChildQId(q.id); setIsChildModalOpen(true); }}
                        className="p-2 bg-white text-gray-500 hover:text-primary rounded border shadow-sm"
                      >
                        <Edit size={12} strokeWidth={2.5}/>
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleDeleteChildQuestion(q.id)}
                        className="p-2 bg-white text-gray-500 hover:text-red-500 rounded border shadow-sm"
                      >
                        <Trash2 size={12} strokeWidth={2.5}/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs font-bold text-gray-400 italic">Nhóm này chưa tạo câu hỏi con nào. Hãy bấm nút góc phải để tạo câu hỏi!</div>
            )}
          </div>

        </div>

        <div className="px-10 py-6 border-t border-gray-200/50 bg-white dark:bg-gray-900 flex justify-end z-30 shadow-lg">
          <button type="button" onClick={triggerClose} className="px-8 py-4 rounded-2xl font-black text-gray-500 bg-gray-50 hover:bg-gray-200 transition-all">Hoàn thành & Đóng</button>
        </div>

      </div>

      <QuestionModal 
        isOpen={isChildModalOpen} 
        onClose={() => setIsChildModalOpen(false)} 
        questionId={selectedChildQId} 
        groupId={editId} 
        onSuccess={() => { loadSubQuestions(editId); onSuccess(); }} 
      />
    </div>
  );
};