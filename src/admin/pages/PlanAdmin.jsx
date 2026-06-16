import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Edit, Loader2, Crown, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { CustomDropdown } from '../../components/common/CustomDropdown';
import { PlanModal } from '../components/premium/PlanModal';

const STATUS_OPTIONS = [
  { id: 'true', name: 'Đang hoạt động' },
  { id: 'false', name: 'Đang tạm dừng' }
];

export const PlanAdmin = () => {
  const [plans, setPlans] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const loadPlans = async () => {
      try {
        const response = await adminService.getPlans(searchTerm, filterActive, 0, 50);
        setPlans(response.data || response.content || []);
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };

    const delayDebounce = setTimeout(() => { loadPlans(); }, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, filterActive, refreshKey]);

  const handleToggleActive = async (id, currentName) => {
    try {
      setPlans(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
      
      await adminService.togglePlanStatus(id);
    } catch (err) {
      alert(`Không thể thay đổi trạng thái gói cước: ${err.message}`);
      setRefreshKey(old => old + 1);
    }
  };

  const inputClass = "w-full rounded-2xl border border-gray-200 bg-gray-100/50 px-5 py-4 font-bold text-gray-900 outline-none transition-all placeholder:text-gray-400/70 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:focus:bg-gray-900";

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="relative z-10 flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
            <Crown size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Gói Cước Premium</h1>
            <p className="text-sm font-bold text-gray-400 mt-1">Cấu hình giá bán, thời hạn sử dụng và quyền lợi tài khoản VIP</p>
          </div>
        </div>
        <button onClick={() => { setEditId(null); setIsModalOpen(true); }} className="relative z-10 flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 font-black text-white shadow-[0_6px_0_rgb(0,0,0,0.15)] hover:brightness-110 active:translate-y-1.5 active:shadow-none transition-all">
          <PlusCircle size={22} strokeWidth={2.5} /> Tạo Gói Mới
        </button>
      </div>

      <div className="rounded-[2.5rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative group md:col-span-2">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors z-10" size={20} strokeWidth={2.5} />
            <input type="text" placeholder="Tìm kiếm theo tên gói cước..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`${inputClass} pl-14`} />
          </div>
          <div className="relative z-20">
            <CustomDropdown value={filterActive} options={STATUS_OPTIONS} onChange={(val) => setFilterActive(val)} placeholder="Lọc Trạng thái" optionLabelKey="name" className="w-full" />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center"><Loader2 size={40} className="animate-spin text-primary" /></div>
      ) : plans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative flex flex-col rounded-[3rem] bg-white dark:bg-gray-900 border-2 p-8 transition-all duration-300 hover:-translate-y-2
                ${plan.isActive 
                  ? 'border-primary/40 shadow-xl shadow-primary/5 dark:border-primary/30' 
                  : 'border-gray-200 dark:border-gray-800 opacity-60 grayscale bg-gray-50/50'
                }`}
            >
              <div className="absolute right-6 top-6 flex items-center gap-3">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-sm ${plan.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                  {plan.isActive ? 'Kinh doanh' : 'Tạm ẩn'}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white pr-16 line-clamp-1">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-primary tracking-tight">
                    {plan.price ? plan.price.toLocaleString('vi-VN') : '0'}
                  </span>
                  <span className="text-sm font-black text-gray-400 uppercase">VNĐ</span>
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-gray-400">
                  <Clock size={14} /> Thời hạn: <span className="text-gray-700 dark:text-gray-200 font-black">{plan.durationDays} ngày</span>
                </div>
              </div>

              <div className="flex-1 border-t border-gray-100 dark:border-gray-800 pt-6 mb-8">
                <span className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-3">Mô tả quyền lợi gói</span>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-4">
                  {plan.description || "Quyền lợi thành viên Premium mặc định của hệ thống KotoBase."}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-6 mt-auto">
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={plan.isActive} 
                      onChange={() => handleToggleActive(plan.id, plan.name)}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </label>
                  <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Trạng thái</span>
                </div>

                <button 
                  onClick={() => { setEditId(plan.id); setIsModalOpen(true); }}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-primary bg-primary/10 hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                  <Edit size={16} strokeWidth={2.5} /> Cấu hình
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
          <ShieldAlert size={48} className="mb-3 opacity-50" />
          <p className="font-bold text-lg">Không tìm thấy gói cước nào.</p>
        </div>
      )}

      <PlanModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        editId={editId} 
        onSuccess={() => setRefreshKey(old => old + 1)} 
      />

    </div>
  );
};