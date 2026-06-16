import React, { useState, useEffect } from 'react';
import { Search, Loader2, CreditCard, Terminal, HelpCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Pagination } from '../../components/common/Pagination';
import { CustomDropdown } from '../../components/common/CustomDropdown';
import { TransactionDetailModal } from '../components/premium/TransactionDetailModal';

const TRANSACTION_STATUSES = [
  { id: 'SUCCESS', name: 'Thành công (SUCCESS)' },
  { id: 'PENDING', name: 'Chờ thanh toán (PENDING)' },
  { id: 'FAILED', name: 'Lỗi giao dịch (FAILED)' },
  { id: 'CANCELLED', name: 'Hủy đơn (CANCELLED)' }
];

export const TransactionAdmin = () => {
  const [transactions, setTransactions] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const loadTransactions = async () => {
      try {
        const response = await adminService.getTransactions(searchTerm, filterStatus, currentPage, 15);
        setTransactions(response.data || response.content || []);
        setTotalPages(response.totalPages || 1);
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };

    const delayDebounce = setTimeout(() => { loadTransactions(); }, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, filterStatus, currentPage, refreshKey]);

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'SUCCESS':
        return <span className="inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-black bg-green-50 text-green-600 dark:bg-green-900/20 shadow-sm border border-green-100 dark:border-green-900/30">SUCCESS</span>;
      case 'PENDING':
        return <span className="inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-black bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 shadow-sm border border-yellow-100 dark:border-yellow-900/30">PENDING</span>;
      case 'FAILED':
        return <span className="inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-black bg-red-50 text-red-600 dark:bg-red-900/20 shadow-sm border border-red-100 dark:border-red-900/30">FAILED</span>;
      case 'CANCELLED':
        return <span className="inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-black bg-gray-100 text-gray-500 dark:bg-gray-800 shadow-sm border border-gray-200">CANCELLED</span>;
      default:
        return <span className="inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-black bg-gray-50 text-gray-400">UNKNOWN</span>;
    }
  };

  const inputClass = "w-full rounded-2xl border border-gray-200 bg-gray-100/50 px-5 py-4 font-bold text-gray-900 outline-none transition-all placeholder:text-gray-400/70 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:focus:bg-gray-900";

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-green-500/5 blur-3xl"></div>
        <div className="relative z-10 flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 text-green-600 shadow-inner">
            <CreditCard size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Nhật ký Giao dịch</h1>
            <p className="text-sm font-bold text-gray-400 mt-1">Sổ cái kế toán theo dõi dòng tiền Premium thực tế đổ về từ cổng VNPay</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-400">
          <HelpCircle size={14}/> Sổ cái bất biến (Read-only Ledger)
        </div>
      </div>

      <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative group md:col-span-2">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors z-10" size={20} strokeWidth={2.5} />
            <input type="text" placeholder="Gõ mã đơn hàng hệ thống hoặc Email học viên..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }} className={`${inputClass} pl-14`} />
          </div>
          <div className="relative z-20 md:col-span-2">
            <CustomDropdown value={filterStatus} options={TRANSACTION_STATUSES} onChange={(val) => { setFilterStatus(val); setCurrentPage(0); }} placeholder="Lọc trạng thái đơn kế toán" optionLabelKey="name" className="w-full" />
          </div>
        </div>

        {/* BẢNG DỮ LIỆU LEDGER */}
        <div className="overflow-x-auto custom-scrollbar min-h-[400px]">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center"><Loader2 size={40} className="animate-spin text-primary" /></div>
          ) : transactions.length > 0 ? (
            <table className="w-full min-w-[1000px] text-left">
              <thead>
                <tr className="border-b-2 border-gray-100 text-gray-400 dark:border-gray-800">
                  <th className="pb-4 pl-4 font-black uppercase tracking-widest text-xs">Mã đơn hệ thống</th>
                  <th className="pb-4 font-black uppercase tracking-widest text-xs">Email Học viên</th>
                  <th className="pb-4 font-black uppercase tracking-widest text-xs">Gói cước</th>
                  <th className="pb-4 font-black uppercase tracking-widest text-xs">Số tiền</th>
                  <th className="pb-4 font-black uppercase tracking-widest text-xs">Trạng thái</th>
                  <th className="pb-4 text-center font-black uppercase tracking-widest text-xs pr-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="group border-b border-gray-50 transition-colors hover:bg-gray-50/50 dark:border-gray-800/50 dark:hover:bg-gray-800/30">
                    <td className="py-5 pl-4 font-mono font-black text-gray-900 dark:text-white text-sm">
                      {tx.id}
                    </td>
                    <td className="py-5 font-bold text-gray-600 dark:text-gray-300">
                      {tx.userEmail || <span className="text-gray-400 italic">N/A</span>}
                    </td>
                    <td className="py-5">
                      <span className="font-black text-gray-900 dark:text-white">{tx.planName || 'Gói Premium'}</span>
                    </td>
                    <td className="py-5 font-black text-green-600 text-base">
                      {tx.amount ? tx.amount.toLocaleString('vi-VN') : '0'} <span className="text-xs font-bold uppercase text-gray-400">đ</span>
                    </td>
                    <td className="py-5">
                      {renderStatusBadge(tx.status)}
                    </td>
                    <td className="py-5 pr-4">
                      <div className="flex items-center justify-end">
                        <button 
                          onClick={() => { setSelectedId(tx.id); setIsModalOpen(true); }}
                          className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-50 hover:bg-orange-500 hover:text-white transition-all shadow-sm dark:bg-orange-950/30 dark:text-orange-400"
                        >
                          <Terminal size={14} /> Kiểm log thô
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <CreditCard size={48} className="mb-4 opacity-50" />
              <p className="font-bold text-lg">Không có dữ liệu giao dịch.</p>
              <p className="text-sm">Hệ thống chưa phát sinh doanh thu nào thỏa mãn điều kiện lọc.</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setRefreshKey} />
          </div>
        )}
      </div>

      <TransactionDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        transactionId={selectedId} 
      />
      
    </div>
  );
};