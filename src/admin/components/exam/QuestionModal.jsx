import React, { useState, useEffect } from 'react';
import { X, Loader2, PlusCircle, CheckCircle2, ImageIcon, Volume2, Trash2 } from 'lucide-react';
import { adminService } from '../../../services/adminService';

export const QuestionModal = ({ isOpen, onClose, questionId, groupId, onSuccess }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingType, setUploadingType] = useState(null);

  const initialForm = {
    content: '', point: 1, displayOrder: 1, audioId: '', audioUrl: '', imageId: '', imageUrl: '',
    answers: [
      { content: '', isCorrect: true, displayOrder: 1, explanation: '' }, // A mặc định đúng
      { content: '', isCorrect: false, displayOrder: 2, explanation: '' }, // B
      { content: '', isCorrect: false, displayOrder: 3, explanation: '' }, // C
      { content: '', isCorrect: false, displayOrder: 4, explanation: '' }  // D
    ]
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (questionId && isOpen) {
      const fetchDetail = async () => {
        try {
          const res = await adminService.getQuestionsByGroup(groupId);
          const list = res.data || res || [];
          const currentQ = list.find(q => q.id === questionId);
          if (currentQ) {
            setFormData({
              content: currentQ.content || '',
              point: currentQ.point || 1,
              displayOrder: currentQ.displayOrder || 1,
              audioId: currentQ.audioId || '',
              audioUrl: currentQ.audioUrl ? (currentQ.audioUrl.startsWith('http') ? currentQ.audioUrl : `http://localhost:8080${currentQ.audioUrl}`) : '',
              imageId: currentQ.imageId || '',
              imageUrl: currentQ.imageUrl ? (currentQ.imageUrl.startsWith('http') ? currentQ.imageUrl : `http://localhost:8080${currentQ.imageUrl}`) : '',
              answers: currentQ.answers || initialForm.answers
            });
          }
        } catch (err) { alert('Không thể tải chi tiết câu hỏi!'); triggerClose(); }
      };
      fetchDetail();
    } else if (isOpen) {
      setFormData(initialForm);
    }
  }, [questionId, groupId, isOpen]);

  const triggerClose = () => { setIsClosing(true); setTimeout(() => { onClose(); setIsClosing(false); }, 300); };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'displayOrder' ? parseInt(value, 10) : name === 'point' ? parseFloat(value) : value }));
  };

  const handleAnswerChange = (idx, field, value) => {
    const newAnswers = [...formData.answers]; newAnswers[idx][field] = value;
    setFormData(prev => ({ ...prev, answers: newAnswers }));
  };

  const setCorrectAnswer = (idx) => {
    const newAnswers = formData.answers.map((ans, i) => ({
      ...ans,
      isCorrect: i === idx,
      explanation: i === idx ? ans.explanation : '' 
    }));
    setFormData(prev => ({ ...prev, answers: newAnswers }));
  };

  const handleMediaUpload = async (e, type) => {
    const file = e.target.files[0]; if (!file) return;
    setUploadingType(type);
    try {
      let id, relativeUrl;
      if (type === 'audio') {
        const res = await adminService.uploadAudio(file); const data = res.data || res; id = data.id; relativeUrl = data.url;
      } else {
        const res = await adminService.uploadImage(file); const data = res.data || res; id = data.id; relativeUrl = data.imageUrl;
      }
      const fullUrl = relativeUrl.startsWith('http') ? relativeUrl : `http://localhost:8080${relativeUrl}`;
      setFormData(prev => ({ ...prev, [type === 'audio' ? 'audioId' : 'imageId']: id, [type === 'audio' ? 'audioUrl' : 'imageUrl']: fullUrl }));
    } catch (err) { alert("Lỗi upload: " + err.message); } finally { setUploadingType(null); e.target.value = null; }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.content.trim()) { alert("⚠️ Vui lòng nhập nội dung câu hỏi!"); return; }

    const correctAns = formData.answers.find(a => a.isCorrect);
    if (!correctAns || !correctAns.content.trim()) { alert("⚠️ Vui lòng nhập nội dung cho đáp án đúng!"); return; }
    
    if (!correctAns.explanation || !correctAns.explanation.trim()) {
      alert("⚠️ Bắt buộc phải nhập 'Giải thích lý do' cho đáp án đúng!"); return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        content: formData.content,
        point: formData.point,
        displayOrder: formData.displayOrder,
        audioId: formData.audioId ? parseInt(formData.audioId, 10) : null,
        imageId: formData.imageId ? parseInt(formData.imageId, 10) : null,
        answers: formData.answers.map(a => ({
          content: a.content,
          isCorrect: a.isCorrect,
          displayOrder: a.displayOrder,
          explanation: a.isCorrect ? a.explanation : ''
        }))
      };

      if (questionId) {
        await adminService.updateQuestion(questionId, payload);
        alert("✅ Cập nhật câu hỏi thành công!");
      } else {
        await adminService.addQuestionToGroup(groupId, payload);
        alert("🎉 Thêm câu hỏi con thành công!");
      }
      onSuccess(); triggerClose();
    } catch (err) { alert(`Lỗi API: ${err.message}`); } finally { setIsSubmitting(false); }
  };

  if (!isOpen && !isClosing) return null;
  const inputClass = "w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 font-bold text-gray-900 outline-none focus:border-primary focus:bg-white";

  return (
    <div className={`fixed inset-0 z-[120] flex items-center justify-center bg-gray-900/60 backdrop-blur-md p-4 transition-all duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      <form onSubmit={handleSubmit} className={`bg-[#f8fafc] dark:bg-gray-950 w-full max-w-3xl h-[85vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-gray-200/50 dark:border-gray-800 transition-all duration-300 ${isClosing ? 'scale-95 opacity-0 translate-y-4' : 'scale-100 opacity-100 translate-y-0'}`}>
        
        <div className="px-8 py-5 border-b border-gray-200/50 bg-white dark:bg-gray-900 flex items-center justify-between z-30">
          <h3 className="text-xl font-black text-gray-900 dark:text-white">{questionId ? 'Chỉnh sửa Câu hỏi con' : 'Thêm Câu hỏi con Mới'}</h3>
          <button type="button" onClick={triggerClose} className="h-10 w-10 flex items-center justify-center bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-200"><X size={20}/></button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6 bg-white dark:bg-gray-900 pb-32">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2"><label className="block text-[11px] font-black uppercase text-gray-400 mb-1">Nội dung câu hỏi (*)</label><input name="content" value={formData.content} onChange={handleInputChange} className={inputClass} required /></div>
            <div><label className="block text-[11px] font-black uppercase text-gray-400 mb-1">Điểm số</label><input type="number" step="0.5" name="point" value={formData.point} onChange={handleInputChange} className={inputClass} /></div>
            <div><label className="block text-[11px] font-black uppercase text-gray-400 mb-1">Thứ tự</label><input type="number" name="displayOrder" value={formData.displayOrder} onChange={handleInputChange} className={inputClass} /></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
              <span className="font-bold text-gray-500">Hình ảnh câu hỏi:</span>
              {formData.imageUrl ? <div className="flex items-center gap-2"><img src={formData.imageUrl} className="h-10 rounded object-contain border" /><button type="button" onClick={()=>setFormData(p=>({...p,imageId:'',imageUrl:''}))} className="text-red-500 font-bold">Xóa</button></div> : 
                <button type="button" onClick={()=>document.getElementById('q-sub-img').click()} className="text-blue-500 font-black">{uploadingType==='image' ? 'Đang tải...' : 'Tải lên'}</button>}
              <input type="file" accept="image/*" id="q-sub-img" className="hidden" onChange={(e)=>handleMediaUpload(e,'image')} />
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
              <span className="font-bold text-gray-500">Âm thanh câu hỏi:</span>
              {formData.audioUrl ? <div className="flex items-center gap-2"><audio src={formData.audioUrl} controls className="h-8 w-32" /><button type="button" onClick={()=>setFormData(p=>({...p,audioId:'',audioUrl:''}))} className="text-red-500 font-bold">Xóa</button></div> : 
                <button type="button" onClick={()=>document.getElementById('q-sub-aud').click()} className="text-orange-500 font-black">{uploadingType==='audio' ? 'Đang tải...' : 'Tải lên'}</button>}
              <input type="file" accept="audio/*" id="q-sub-aud" className="hidden" onChange={(e)=>handleMediaUpload(e,'audio')} />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-[11px] font-black uppercase text-gray-400">Thiết lập 4 đáp án trắc nghiệm</label>
            {['A', 'B', 'C', 'D'].map((char, idx) => (
              <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-colors ${formData.answers[idx].isCorrect ? 'border-green-400 bg-green-50/30' : 'border-gray-100'}`}>
                <div onClick={() => setCorrectAnswer(idx)} className={`h-6 w-6 rounded-full border-4 flex items-center justify-center cursor-pointer shrink-0 ${formData.answers[idx].isCorrect ? 'border-green-500 bg-green-500' : 'border-gray-300 bg-white'}`}>{formData.answers[idx].isCorrect && <div className="h-2 w-2 bg-white rounded-full"></div>}</div>
                <span className="font-black text-gray-400 w-4">{char}.</span>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder={`Nội dung đáp án ${char}...`} value={formData.answers[idx].content} onChange={(e)=>handleAnswerChange(idx, 'content', e.target.value)} required className="w-full bg-transparent outline-none font-bold text-sm text-gray-900" />
                  {formData.answers[idx].isCorrect ? (
                    <input placeholder="⚠️ Bắt buộc điền giải thích vì sao câu này ĐÚNG..." value={formData.answers[idx].explanation || ''} onChange={(e)=>handleAnswerChange(idx, 'explanation', e.target.value)} className="w-full bg-transparent outline-none font-bold text-xs text-orange-600 border-l pl-3 placeholder:text-orange-300" />
                  ) : (
                    <div className="text-xs text-gray-400 italic pl-3 border-l flex items-center">Đáp án sai không có phần giải thích</div>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>

        <div className="px-8 py-5 border-t border-gray-200/50 bg-white dark:bg-gray-900 flex justify-end gap-3 z-30 shadow-lg">
          <button type="button" onClick={triggerClose} className="px-6 py-3 rounded-xl font-bold text-gray-500 bg-gray-50 hover:bg-gray-200">Hủy</button>
          <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-8 py-3 rounded-xl font-black text-white bg-primary shadow-sm hover:brightness-110 transition-all">
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />} Lưu câu hỏi
          </button>
        </div>
      </form>
    </div>
  );
};