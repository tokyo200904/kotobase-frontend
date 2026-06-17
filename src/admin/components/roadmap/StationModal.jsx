import React, { useState, useEffect } from 'react';
import { X, Loader2, Map, CheckCircle2, ChevronRight, ChevronLeft, Search } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { CustomDropdown } from '../../../components/common/CustomDropdown';

const ITEM_TYPES = [
  { id: 'KANJI', name: 'Trạm học Hán tự (Kanji)' },
  { id: 'VOCAB', name: 'Trạm học Từ vựng (Vocabulary)' }
];

export const StationModal = ({ isOpen, onClose, editId, onSuccess, levels }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialForm = { levelId: '', itemType: '', stationOrder: 1, title: '', description: '', targetItemIds: [] };
  const [formData, setFormData] = useState(initialForm);

  const [sourceItems, setSourceItems] = useState([]);
  const [isLoadingKho, setIsLoadingKho] = useState(false);
  
  const [leftChecked, setLeftChecked] = useState([]);
  const [rightChecked, setRightChecked] = useState([]);
  const [leftSearch, setLeftSearch] = useState('');
  const [rightSearch, setRightSearch] = useState('');

  useEffect(() => {
    if (editId && isOpen) {
      const fetchDetail = async () => {
        try {
          const res = await adminService.getStationById(editId);
          const d = res.data || res;
          setFormData({
            levelId: d.levelId || '', 
            itemType: d.itemType || '', 
            stationOrder: d.stationOrder || 1,
            title: d.title || '', 
            description: d.description || '', 
            targetItemIds: d.targetItemIds || []
          });
        } catch (err) { alert('Lỗi tải trạm!'); triggerClose(); }
      };
      fetchDetail();
    } else if (isOpen) { 
      setFormData(initialForm); 
    }
  }, [editId, isOpen]);

  useEffect(() => {
    if (formData.levelId && formData.itemType && isOpen) {
      const fetchKho = async () => {
        setIsLoadingKho(true);
        try {
          const res = await adminService.getCompactDictionary(formData.levelId, formData.itemType);
          setSourceItems(res.data || res || []);
        } catch (err) { console.error("Lỗi tải kho từ vựng/kanji", err); setSourceItems([]); }
        finally { setIsLoadingKho(false); }
      };
      fetchKho();
    } else {
      setSourceItems([]);
    }
  }, [formData.levelId, formData.itemType, isOpen]);

  const triggerClose = () => { setIsClosing(true); setTimeout(() => { onClose(); setIsClosing(false); }, 300); };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({
      ...p,
      [name]: name === 'stationOrder' ? (value ? parseInt(value, 10) : 1) : value
    }));
  };

  const availableItems = sourceItems.filter(item => !formData.targetItemIds.includes(item.id));
  const selectedItems = sourceItems.filter(item => formData.targetItemIds.includes(item.id));

  const filteredLeft = availableItems.filter(item => (item.word || item.character || '').toLowerCase().includes(leftSearch.toLowerCase()) || (item.meaning || '').toLowerCase().includes(leftSearch.toLowerCase()));
  const filteredRight = selectedItems.filter(item => (item.word || item.character || '').toLowerCase().includes(rightSearch.toLowerCase()) || (item.meaning || '').toLowerCase().includes(rightSearch.toLowerCase()));

  const toggleCheck = (id, side) => {
    if (side === 'left') setLeftChecked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    else setRightChecked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const moveRight = () => {
    setFormData(p => ({ ...p, targetItemIds: [...p.targetItemIds, ...leftChecked] }));
    setLeftChecked([]);
  };
  const moveLeft = () => {
    setFormData(p => ({ ...p, targetItemIds: p.targetItemIds.filter(id => !rightChecked.includes(id)) }));
    setRightChecked([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.levelId || !formData.itemType) { alert("⚠️ Vui lòng điền đủ thông tin cơ bản!"); return; }
    
    setIsSubmitting(true);
    try {
      if (editId) await adminService.updateStation(editId, formData);
      else await adminService.createStation(formData);
      onSuccess(); triggerClose();
    } catch (err) { alert(`Lỗi: ${err.message}`); } finally { setIsSubmitting(false); }
  };

  if (!isOpen && !isClosing) return null;
  const inputClass = "w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 font-bold text-gray-900 outline-none focus:border-primary focus:bg-white";

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-md p-4 transition-all duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      <div className={`bg-[#f8fafc] dark:bg-gray-950 w-full max-w-6xl h-[95vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-gray-200/50 dark:border-gray-800 transition-all duration-300 ${isClosing ? 'scale-95 opacity-0 translate-y-4' : 'scale-100 opacity-100 translate-y-0'}`}>
        
        <div className="px-10 py-6 border-b border-gray-200/50 bg-white dark:bg-gray-900 flex items-center justify-between z-30">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Map size={24}/></div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">{editId ? 'Cấu hình Trạm học' : 'Tạo Trạm học Mới'}</h2>
          </div>
          <button type="button" onClick={triggerClose} className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-200"><X size={24}/></button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-6 bg-gray-50/50 dark:bg-gray-950/50 pb-40">
          
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
               <div className="relative z-40">
                 <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Cấp độ JLPT</label>
                 <CustomDropdown value={formData.levelId} options={levels} onChange={(v)=>setFormData(p=>({...p, levelId:v, targetItemIds:[]}))} placeholder="Chọn Cấp độ" optionLabelKey="levelName" />
               </div>
               <div className="relative z-30">
                 <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Loại Trạm</label>
                 <CustomDropdown value={formData.itemType} options={ITEM_TYPES} onChange={(v)=>setFormData(p=>({...p, itemType:v, targetItemIds:[]}))} placeholder="Chọn Loại" />
               </div>
               <div>
                 <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Thứ tự Trạm (Order)</label>
                 <input type="number" name="stationOrder" value={formData.stationOrder} onChange={handleInputChange} min="1" className={inputClass} />
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Tên Trạm (Vd: Lời chào hỏi)</label>
                 <input name="title" value={formData.title} onChange={handleInputChange} className={inputClass} />
               </div>
               <div>
                 <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Mô tả (Mục tiêu của trạm)</label>
                 <input name="description" value={formData.description} onChange={handleInputChange} className={inputClass} />
               </div>
             </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative z-10 flex flex-col h-[500px]">
            <h3 className="font-black text-base mb-4">Nhúng Vật phẩm vào Trạm <span className="text-primary">({formData.targetItemIds.length} mục)</span></h3>
            
            {!formData.levelId || !formData.itemType ? (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl text-gray-400">
                <Map size={48} className="mb-2 opacity-50"/>
                <p className="font-bold">Vui lòng chọn Cấp độ và Loại trạm ở trên để tải kho dữ liệu.</p>
              </div>
            ) : isLoadingKho ? (
              <div className="flex-1 flex items-center justify-center"><Loader2 size={32} className="animate-spin text-primary"/></div>
            ) : (
              <div className="flex flex-1 gap-4 overflow-hidden">
                <div className="flex-1 flex flex-col border border-gray-200 rounded-2xl overflow-hidden bg-gray-50/50">
                  <div className="p-3 bg-gray-100 border-b border-gray-200 font-black text-xs text-gray-600 flex items-center justify-between">
                    <span>Kho Dữ Liệu ({availableItems.length})</span>
                    <span className="text-primary">{leftChecked.length} đang chọn</span>
                  </div>
                  <div className="p-2 border-b border-gray-200 bg-white relative">
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={leftSearch} onChange={e=>setLeftSearch(e.target.value)} placeholder="Tìm chữ/nghĩa..." className="w-full pl-8 pr-2 py-1.5 text-xs font-bold outline-none bg-gray-50 rounded-lg" />
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar bg-white">
                    {filteredLeft.map(item => (
                      <div key={item.id} onClick={() => toggleCheck(item.id, 'left')} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer border hover:border-blue-300 transition-colors ${leftChecked.includes(item.id) ? 'bg-blue-50 border-blue-200' : 'border-transparent'}`}>
                        <input type="checkbox" checked={leftChecked.includes(item.id)} readOnly className="h-4 w-4 rounded accent-primary pointer-events-none" />
                        <span className="font-black text-gray-900">{item.word || item.character}</span>
                        <span className="text-xs text-gray-500 font-medium truncate">{item.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-3">
                  <button type="button" onClick={moveRight} disabled={leftChecked.length === 0} className="h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center shadow-md disabled:opacity-30 hover:scale-105 active:scale-95 transition-all"><ChevronRight size={20} strokeWidth={3}/></button>
                  <button type="button" onClick={moveLeft} disabled={rightChecked.length === 0} className="h-10 w-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md disabled:opacity-30 hover:scale-105 active:scale-95 transition-all"><ChevronLeft size={20} strokeWidth={3}/></button>
                </div>

                <div className="flex-1 flex flex-col border border-gray-200 rounded-2xl overflow-hidden bg-blue-50/30">
                  <div className="p-3 bg-blue-100 border-b border-blue-200 font-black text-xs text-blue-800 flex items-center justify-between">
                    <span>Đã nạp vào Trạm ({selectedItems.length})</span>
                    <span className="text-red-500">{rightChecked.length} đang chọn</span>
                  </div>
                  <div className="p-2 border-b border-gray-200 bg-white relative">
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={rightSearch} onChange={e=>setRightSearch(e.target.value)} placeholder="Tìm trong trạm..." className="w-full pl-8 pr-2 py-1.5 text-xs font-bold outline-none bg-gray-50 rounded-lg" />
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar bg-white">
                    {filteredRight.map(item => (
                      <div key={item.id} onClick={() => toggleCheck(item.id, 'right')} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer border hover:border-red-300 transition-colors ${rightChecked.includes(item.id) ? 'bg-red-50 border-red-200' : 'border-transparent'}`}>
                        <input type="checkbox" checked={rightChecked.includes(item.id)} readOnly className="h-4 w-4 rounded accent-red-500 pointer-events-none" />
                        <span className="font-black text-gray-900">{item.word || item.character}</span>
                        <span className="text-xs text-gray-500 font-medium truncate">{item.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        <div className="px-10 py-6 border-t border-gray-200/50 bg-white flex justify-end gap-4 z-30 shadow-lg">
          <button type="button" onClick={triggerClose} className="px-8 py-4 rounded-2xl font-black text-gray-500 bg-gray-50 hover:bg-gray-200">Hủy</button>
          <button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 px-10 py-4 rounded-2xl font-black text-white bg-indigo-600 shadow-sm hover:brightness-110 active:translate-y-1 transition-all disabled:opacity-50">
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20}/>} Lưu Trạm Học
          </button>
        </div>
      </div>
    </div>
  );
};