import React, { useState, useEffect } from 'react';
import { Search, Loader2, Users, ShieldAlert, Crown, UserX, Mail } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Pagination } from '../../components/common/Pagination';
import { CustomDropdown } from '../../components/common/CustomDropdown';
import { UserDetailDrawer } from '../components/user/UserDetailDrawer';

// Hằng số bộ lọc
const STATUS_OPTIONS = [
  { id: 'true', name: 'Đang hoạt động (Enabled)' },
  { id: 'false', name: 'Đang bị khóa (Banned)' }
];
const PREMIUM_OPTIONS = [
  { id: 'true', name: 'Học viên Premium' },
  { id: 'false', name: 'Học viên Free' }
];

export const UserAdmin = () => {
  const [users, setUsers] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // States Bộ lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEnabled, setFilterEnabled] = useState('');
  const [filterPremium, setFilterPremium] = useState('');
  
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // States Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    // 🌟 Bật Loading tức thời tối ưu UX
    setIsLoading(true);
    const loadUsers = async () => {
      try {
        const response = await adminService.getUsers(searchTerm, filterEnabled, filterPremium, currentPage, 15);
        setUsers(response.data || response.content || []);
        setTotalPages(response.totalPages || 1);
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };

    const delayDebounce = setTimeout(() => { loadUsers(); }, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, filterEnabled, filterPremium, currentPage, refreshKey]);

  // 🌟 Đỉnh cao UI: Toggle Ban/Unban trực tiếp trên hàng của bảng
  const handleToggleStatus = async (id, currentStatus) => {
    if (!window.confirm(currentStatus ? '⚠️ Khóa (Ban) tài khoản này?' : '✅ Mở khóa (Unban) tài khoản này?')) return;
    
    try {
      // Optimistic Update: Cập nhật UI ngay lập tức
      setUsers(prev => prev.map(u => u.id === id ? { ...u, isEnabled: !u.isEnabled } : u));
      
      // Gọi API thực thi
      await adminService.toggleUserStatus(id);
    } catch (err) {
      alert(`Lỗi: ${err.message}`);
      setRefreshKey(old => old + 1); // Khôi phục nếu server lỗi
    }
  };

  const inputClass = "w-full rounded-2xl border border-gray-200 bg-gray-100/50 px-5 py-4 font-bold text-gray-900 outline-none transition-all placeholder:text-gray-400/70 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:focus:bg-gray-900";

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* HEADER PAGE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl"></div>
        <div className="relative z-10 flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 shadow-inner">
            <Users size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Học viên KotoBase</h1>
            <p className="text-sm font-bold text-gray-400 mt-1">Quản lý tài khoản, hỗ trợ cấp VIP và khóa vi phạm</p>
          </div>
        </div>
      </div>

      {/* BỘ LỌC ĐA CẤP (3 CỘT) */}
      <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative group md:col-span-2">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors z-10" size={20} strokeWidth={2.5} />
            <input type="text" placeholder="Tìm tên hoặc email học viên..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }} className={`${inputClass} pl-14`} />
          </div>
          <div className="relative z-30">
            <CustomDropdown value={filterEnabled} options={STATUS_OPTIONS} onChange={(val) => { setFilterEnabled(val); setCurrentPage(0); }} placeholder="Lọc Trạng Thái" optionLabelKey="name" className="w-full" />
          </div>
          <div className="relative z-20">
            <CustomDropdown value={filterPremium} options={PREMIUM_OPTIONS} onChange={(val) => { setFilterPremium(val); setCurrentPage(0); }} placeholder="Lọc Hạng Tài Khoản" optionLabelKey="name" className="w-full" />
          </div>
        </div>

        {/* BẢNG QUẢN LÝ USER */}
        <div className="overflow-x-auto custom-scrollbar min-h-[400px]">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center"><Loader2 size={40} className="animate-spin text-primary" /></div>
          ) : users.length > 0 ? (
            <table className="w-full min-w-[1000px] text-left">
              <thead>
                <tr className="border-b-2 border-gray-100 text-gray-400 dark:border-gray-800">
                  <th className="pb-4 pl-4 font-black uppercase tracking-widest text-xs">Học viên</th>
                  <th className="pb-4 font-black uppercase tracking-widest text-xs">Hạng Tài Khoản</th>
                  <th className="pb-4 font-black uppercase tracking-widest text-xs">Đăng nhập</th>
                  <th className="pb-4 font-black uppercase tracking-widest text-xs text-center">Tình trạng (Ban)</th>
                  <th className="pb-4 text-center font-black uppercase tracking-widest text-xs pr-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className={`group border-b border-gray-50 transition-colors dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 ${!u.isEnabled ? 'bg-red-50/30 dark:bg-red-950/10' : ''}`}>
                    <td className="py-4 pl-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center font-black text-gray-500 shadow-inner">
                          {u.fullName ? u.fullName.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                          <div className={`font-black text-lg ${!u.isEnabled ? 'text-red-600 line-through' : 'text-gray-900 dark:text-white'}`}>{u.fullName}</div>
                          <div className="text-xs font-bold text-gray-400 flex items-center gap-1 mt-0.5"><Mail size={12}/> {u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      {u.isPremium 
                        ? <span className="inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-sm bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-900/50"><Crown size={12}/> VIP</span>
                        : <span className="inline-flex items-center rounded-xl px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">Free</span>
                      }
                    </td>
                    <td className="py-4 font-bold text-gray-600 dark:text-gray-300">
                      {u.provider}
                    </td>
                    <td className="py-4 text-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={u.isEnabled} onChange={() => handleToggleStatus(u.id, u.isEnabled)} className="sr-only peer" />
                        {/* Switch Xanh (Enabled) -> Đỏ (Banned) */}
                        <div className="w-11 h-6 bg-red-400 peer-focus:outline-none rounded-full peer dark:bg-red-900/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                      </label>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center justify-end">
                        <button 
                          onClick={() => { setSelectedUserId(u.id); setIsDrawerOpen(true); }}
                          className="rounded-xl px-4 py-2.5 font-black text-xs uppercase tracking-wider text-primary bg-primary/10 hover:bg-primary hover:text-white transition-all active:scale-95 shadow-sm"
                        >
                          Hồ sơ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
             <div className="flex flex-col items-center justify-center h-64 text-gray-400">
               <UserX size={48} className="mb-4 opacity-50" />
               <p className="font-bold text-lg">Không tìm thấy học viên.</p>
             </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </div>

      {/* COMPONENT CỬA SỔ TRƯỢT */}
      <UserDetailDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        userId={selectedUserId} 
        onSuccess={() => setRefreshKey(old => old + 1)} 
      />

    </div>
  );
};