import React, { useState, useEffect } from 'react';
import { X, Loader2, Crown, History, ShieldAlert } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { CustomDropdown } from '../../../components/common/CustomDropdown';

export const UserDetailDrawer = ({ isOpen, onClose, userId, onSuccess }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [detailData, setDetailData] = useState(null);
  
  const [activePlans, setActivePlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [isGranting, setIsGranting] = useState(false);

  useEffect(() => {
    if (userId && isOpen) {
      setIsLoading(true);
      const fetchDetail = async () => {
        try {
          const res = await adminService.getUserDetail(userId);
          setDetailData(res.data || res);
        } catch (err) {
          alert('Không thể tải chi tiết học viên!');
          triggerClose();
        } finally {
          setIsLoading(false);
        }
      };
      fetchDetail();
    } else {
      setDetailData(null);
      setSelectedPlanId('');
    }
  }, [userId, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const fetchPlans = async () => {
        try {
          const res = await adminService.getActivePlansForDropdown();
          setActivePlans(res.data || res || []);
        } catch (err) { console.error('Lỗi tải Plan', err); }
      };
      fetchPlans();
    }
  }, [isOpen]);

  const triggerClose = () => {
    setIsClosing(true);
    setTimeout(() => { onClose(); setIsClosing(false); }, 300); 
  };

  const handleGrantPremium = async () => {
    if (!selectedPlanId) {
      alert("Vui lòng chọn một gói cước để cấp VIP!"); return;
    }
    const selectedPlan = activePlans.find(p => p.id === selectedPlanId);
    if (!window.confirm(`Xác nhận cấp [${selectedPlan?.name}] cho học viên này?`)) return;

    setIsGranting(true);
    try {
      await adminService.grantManualPremium(userId, selectedPlanId);
      alert('🎉 Cấp VIP thành công! Hệ thống đã cộng dồn ngày sử dụng.');
      onSuccess(); 
      triggerClose();
    } catch (err) {
      alert(`Lỗi cấp VIP: ${err.message}`);
    } finally {
      setIsGranting(false);
    }
  };

  if (!isOpen && !isClosing) return null;

  const user = detailData?.userInfo;
  const history = detailData?.paymentHistory || [];

  return (
    <>
      {/* Overlay nền đen mờ */}
      <div 
        className={`fixed inset-0 z-[100] bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
        onClick={triggerClose}
      />

      {/* Drawer trượt từ bên phải */}
      <div className={`fixed inset-y-0 right-0 z-[110] w-full max-w-md bg-white dark:bg-gray-950 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isClosing ? 'translate-x-full' : 'translate-x-0'}`}>
        
        {/* Header Drawer */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 z-30">
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white">Chi tiết Học viên</h2>
            <p className="text-xs font-bold text-gray-400 mt-1">ID: #{user?.id || '---'}</p>
          </div>
          <button onClick={triggerClose} className="p-2 bg-gray-50 hover:bg-gray-200 text-gray-500 rounded-xl transition-all dark:bg-gray-800 dark:hover:bg-gray-700">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* 🌟 SỬA LỖI SCROLL DROPDOWN: Bổ sung pb-40 để tạo đáy đủ sâu cho Dropdown bung xuống */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 bg-gray-50/50 dark:bg-gray-950/50 pb-40">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center"><Loader2 size={32} className="animate-spin text-primary" /></div>
          ) : user ? (
            <>
              {/* Profile Card */}
              <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm text-center">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-3xl font-black shadow-lg mb-4">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : '?'}
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-1">{user.fullName}</h3>
                <p className="text-sm font-bold text-gray-500">{user.email}</p>
                <div className="flex items-center gap-2 mt-4">
                  {user.isPremium 
                    ? <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-black uppercase rounded-lg border border-yellow-200 flex items-center gap-1"><Crown size={12}/> Premium</span>
                    : <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-black uppercase rounded-lg border border-gray-200">Học viên Free</span>
                  }
                </div>
              </div>

              {/* KHU VỰC 1: CẤP VIP THỦ CÔNG */}
              {/* 🌟 SỬA LỖI CLIPPING: Đã gỡ bỏ class overflow-hidden và thêm z-20 để Dropdown bung đè lên vùng Lịch sử */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-yellow-100 dark:border-yellow-900/30 shadow-sm relative z-20">
                <div className="rounded-t-3xl bg-yellow-50 dark:bg-yellow-900/10 px-5 py-4 border-b border-yellow-100 dark:border-yellow-900/30 flex items-center gap-2">
                  <Crown size={18} className="text-yellow-600" />
                  <h4 className="font-black text-yellow-700 dark:text-yellow-500">Cấp VIP Thủ Công</h4>
                </div>
                <div className="p-5 space-y-4">
                  <p className="text-xs font-bold text-gray-500 leading-relaxed">
                    Sử dụng tính năng này để cộng dồn ngày VIP cho học viên trong các trường hợp cổng thanh toán gặp sự cố hoặc trao giải thưởng event.
                  </p>
                  
                  {/* Dropdown giờ đã có thể click và scroll thoải mái */}
                  <CustomDropdown 
                    value={selectedPlanId} 
                    options={activePlans} 
                    onChange={setSelectedPlanId} 
                    placeholder="Chọn Gói Cước..." 
                    optionLabelKey="name" 
                  />
                  
                  <button 
                    onClick={handleGrantPremium}
                    disabled={isGranting || !selectedPlanId}
                    className="w-full py-3.5 bg-yellow-500 hover:bg-yellow-400 text-white font-black rounded-xl shadow-[0_4px_0_rgb(202,138,4)] hover:shadow-none hover:translate-y-1 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
                  >
                    {isGranting ? <Loader2 size={18} className="animate-spin" /> : <ShieldAlert size={18} />} Xác nhận Cấp VIP
                  </button>
                </div>
              </div>

              {/* KHU VỰC 2: LỊCH SỬ NẠP TIỀN */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden relative z-10">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                  <History size={18} className="text-primary" />
                  <h4 className="font-black text-gray-900 dark:text-white">Lịch sử đơn hàng VNPay</h4>
                </div>
                <div className="p-0">
                  {history.length > 0 ? (
                    <ul className="divide-y divide-gray-50 dark:divide-gray-800/50">
                      {history.map((tx, idx) => (
                        <li key={idx} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <span className={`font-black text-sm ${tx.status !== 'SUCCESS' ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                              {tx.planName || 'Gói Premium'}
                            </span>
                            <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${
                              tx.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 
                              tx.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-600'
                            }`}>
                              {tx.status}
                            </span>
                          </div>
                          
                          {/* 🌟 LOGIC KẾ TOÁN MỚI: Chỉ SUCCESS mới hiển thị + Tiền */}
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span className="text-gray-400">{tx.createdAt}</span>
                            
                            {tx.status === 'SUCCESS' ? (
                              <span className="text-green-600 text-sm font-black">
                                +{tx.amount ? tx.amount.toLocaleString('vi-VN') : '0'}đ
                              </span>
                            ) : (
                              <span className="text-gray-400 text-sm line-through decoration-gray-300">
                                {tx.amount ? tx.amount.toLocaleString('vi-VN') : '0'}đ
                              </span>
                            )}
                          </div>

                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-8 text-center text-gray-400">
                      <History size={32} className="mx-auto mb-2 opacity-30" />
                      <p className="text-xs font-bold">Chưa có giao dịch nào.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
};