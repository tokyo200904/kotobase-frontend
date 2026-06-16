import React, { useState, useEffect } from 'react';
import { X, Loader2, PlusCircle, Edit, Crown, Clock, DollarSign } from 'lucide-react';
import { adminService } from '../../../services/adminService';

export const PlanModal = ({ isOpen, onClose, editId, onSuccess }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialForm = { name: '', durationDays: '', price: '', description: '', isActive: true };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (editId && isOpen) {
      const fetchDetail = async () => {
        try {
          const res = await adminService.getPlanById(editId);
          const detail = res.data || res;
          setFormData({
            name: detail.name,
            durationDays: detail.durationDays,
            price: detail.price,
            description: detail.description || '',
            isActive: detail.isActive ?? true
          });
        } catch (err) { alert('Lỗi tải thông tin gói cước!'); triggerClose(); }
      };
      fetchDetail();
    } else {
      setFormData(initialForm);
    }
  }, [editId, isOpen]);

  const triggerClose = () => {
    setIsClosing(true);
    setTimeout(() => { onClose(); setIsClosing(false); }, 300);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              name === 'durationDays' ? (value ? parseInt(value, 10) : '') :
              name === 'price' ? (value ? parseFloat(value) : '') : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || formData.durationDays === '' || formData.price === '') {
      alert("⚠️ Vui lòng nhập đầy đủ các thông tin bắt buộc!");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editId) await adminService.updatePlan(editId, formData);
      else await adminService.createPlan(formData);
      onSuccess();
      triggerClose();
    } catch (err) { alert(`Lỗi lưu gói cước: ${err.message}`); } finally { setIsSubmitting(false); }
  };

  if (!isOpen && !isClosing) return null;

  const inputClass = "w-full rounded-2xl border border-gray-200 bg-gray-100/50 px-5 py-4 font-bold text-gray-900 outline-none transition-all placeholder:text-gray-400/60 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:focus:bg-gray-900";

  const isValid = formData.name && formData.durationDays !== '' && formData.price !== '';

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-md p-4 transition-all duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      <div className={`bg-[#f8fafc] dark:bg-gray-950 w-full max-w-2xl rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-gray-200/50 dark:border-gray-800 transition-all duration-300 ${isClosing ? 'scale-95 opacity-0 translate-y-4' : 'scale-100 opacity-100 translate-y-0'}`}>
        
        <div className="px-10 py-6 border-b border-gray-200/50 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm z-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Crown size={24} strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
              {editId ? 'Cấu hình Gói Cước' : 'Tạo Gói Cước Premium'}
            </h2>
          </div>
          <button onClick={triggerClose} className="h-12 w-12 flex items-center justify-center text-gray-400 bg-gray-50 hover:bg-gray-200 rounded-2xl transition-all dark:bg-gray-800 dark:hover:bg-gray-700">
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-6 bg-white dark:bg-gray-900">
          
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">Tên gói dịch vụ (*)</label>
            <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Vd: VIP Tiết kiệm 1 Năm" required className={`${inputClass} text-xl`} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">
                <Clock size={14} /> Thời hạn hiệu lực (Số ngày) (*)
              </label>
              <input type="number" min="1" name="durationDays" value={formData.durationDays} onChange={handleInputChange} placeholder="Vd: 365" required className={inputClass} />
            </div>
            <div>
              <label className="flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">
                <DollarSign size={14} /> Giá bán cấu hình (VNĐ) (*)
              </label>
              <input type="number" min="0" step="1000" name="price" value={formData.price} onChange={handleInputChange} placeholder="Vd: 799000" required className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">Mô tả quyền lợi gói</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" placeholder="Mở khóa toàn bộ kho tàng từ vựng, ngữ pháp nâng cao..." className={`${inputClass} resize-none font-medium leading-relaxed`} />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-800">
            <div>
              <h4 className="text-sm font-black text-gray-900 dark:text-white">Kích hoạt kinh doanh mặc định</h4>
              <p className="text-xs font-bold text-gray-400 mt-0.5">Gói cước sẽ xuất hiện trên ứng dụng ngay sau khi tạo</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="sr-only peer" />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </label>
          </div>

        </div>

        <div className="px-10 py-6 border-t border-gray-200/50 dark:border-gray-800 bg-white dark:bg-gray-900 flex justify-end gap-4 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] z-20">
          <button onClick={triggerClose} className="px-8 py-4 rounded-2xl font-black text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-gray-900 transition-all dark:bg-gray-800 dark:text-gray-300">Hủy</button>
          <button onClick={handleSubmit} disabled={isSubmitting || !isValid} className="flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-white bg-primary shadow-[0_6px_0_rgb(0,0,0,0.15)] hover:brightness-110 active:translate-y-1.5 active:shadow-none transition-all disabled:opacity-50 disabled:grayscale">
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <PlusCircle size={20} strokeWidth={2.5} />} 
            {editId ? 'Lưu cập nhật' : 'Tạo gói cước'}
          </button>
        </div>

      </div>
    </div>
  );
};