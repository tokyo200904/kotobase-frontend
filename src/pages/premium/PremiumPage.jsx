import React, { useState, useEffect } from 'react';
import { Crown, Sparkles, Check, Loader2, ShieldCheck, Lock } from 'lucide-react';
import { paymentService } from '../../services/paymentService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const PremiumPage = () => {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingPlanId, setProcessingPlanId] = useState(null);
  
  const { addToast } = useToast();
  
  const { setAuthModalOpen } = useAuth();
  const isAuthenticated = !!localStorage.getItem('token');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await paymentService.getPlans();
        setPlans(data);
      } catch (error) {
        addToast('Không tải được danh sách gói', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, [addToast]);

  const handleAction = async (planId) => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }

    if (processingPlanId) return; 
    setProcessingPlanId(planId);
    
    try {
      const response = await paymentService.createPayment(planId);
      if (response.paymentUrl) {
        window.location.href = response.paymentUrl;
      } else {
        throw new Error('Không nhận được URL thanh toán');
      }
    } catch (error) {
      addToast('Tạo đơn hàng thất bại. Vui lòng thử lại!', 'error');
      setProcessingPlanId(null); 
    }
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (isLoading) {
    return <div className="flex h-[calc(100vh-6rem)] items-center justify-center"><Loader2 className="animate-spin text-yellow-500" size={48} /></div>;
  }

  return (
    <div className="custom-scrollbar h-[calc(100vh-6rem)] w-full overflow-y-auto bg-gray-50 dark:bg-gray-950">
      
      <div className="relative bg-gray-900 py-16 text-center shadow-xl overflow-hidden dark:bg-black">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#fbbf24 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div className="relative z-10 flex flex-col items-center animate-fade-in">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 shadow-lg shadow-yellow-500/30">
            <Crown size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-white md:text-5xl">
            Nâng cấp <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">KotoBase Premium</span>
          </h1>
          <p className="mt-4 text-lg font-medium text-gray-400 max-w-xl mx-auto px-4">
            Mở khóa toàn bộ lộ trình, xóa bỏ mọi giới hạn và chinh phục JLPT với tốc độ nhanh nhất.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16 animate-fade-in">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan) => {
            const isPopular = plan.id === 3; // Mặc định gói 3 là phổ biến
            const isProcessing = processingPlanId === plan.id;
            const anyProcessing = processingPlanId !== null;

            return (
              <div 
                key={plan.id} 
                className={`relative flex flex-col justify-between rounded-[2.5rem] bg-white p-8 transition-all duration-300 dark:bg-gray-900 ${
                  isPopular 
                    ? 'scale-105 border-4 border-yellow-400 shadow-2xl shadow-yellow-500/20 z-10' 
                    : 'border-2 border-gray-100 shadow-lg hover:-translate-y-2 dark:border-gray-800'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-4 py-1 text-xs font-black uppercase tracking-widest text-white shadow-md">
                    Tiết kiệm nhất
                  </div>
                )}

                <div>
                  <h3 className={`text-2xl font-black ${isPopular ? 'text-yellow-500' : 'text-gray-900 dark:text-white'}`}>
                    {plan.name}
                  </h3>
                  <div className="mt-4 flex items-end gap-2">
                    <span className="text-4xl font-black text-gray-900 dark:text-white">{formatMoney(plan.price)}</span>
                    <span className="text-gray-500 font-bold mb-1">/ {plan.durationDays} ngày</span>
                  </div>

                  <ul className="mt-8 space-y-4">
                    {plan.description.split('\n').map((line, i) => {
                      const cleanLine = line.replace('✓ ', '');
                      return (
                        <li key={i} className="flex items-start gap-3">
                          <Check size={20} className="text-green-500 shrink-0 mt-0.5" />
                          <span className="text-gray-600 font-medium dark:text-gray-300">{cleanLine}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <button
                  onClick={() => handleAction(plan.id)}
                  disabled={anyProcessing && isAuthenticated} // Không khóa nút nếu chỉ là nhắc đăng nhập
                  className={`mt-10 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-lg font-black transition-all ${
                    isProcessing
                      ? 'bg-gray-200 text-gray-500 cursor-wait dark:bg-gray-800'
                      : !isAuthenticated
                        ? 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 active:translate-y-1 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                        : isPopular
                          ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-[0_6px_0_#d97706] hover:brightness-110 active:translate-y-1 active:shadow-none'
                          : 'bg-gray-900 text-white shadow-[0_6px_0_#000] hover:bg-gray-800 active:translate-y-1 active:shadow-none dark:bg-gray-800 dark:shadow-[0_6px_0_#1f2937]'
                  }`}
                >
                  {isProcessing ? (
                    <><Loader2 className="animate-spin" size={24} /> Đang xử lý...</>
                  ) : !isAuthenticated ? (
                    <>Đăng nhập để nâng cấp <Lock size={20} /></>
                  ) : (
                    <>Mua {plan.name} <Sparkles size={20} /></>
                  )}
                </button>
              </div>
            );
          })}
        </div>
        
        <div className="mt-12 flex items-center justify-center gap-2 text-sm font-bold text-gray-400">
          <ShieldCheck size={20} /> Thanh toán bảo mật an toàn 100% qua VNPay
        </div>
      </div>
    </div>
  );
};