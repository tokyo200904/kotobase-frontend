import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { paymentService } from '../../services/paymentService';

export const PaymentResultPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState('CHECKING');
  
  const orderId = searchParams.get('vnp_TxnRef');

  useEffect(() => {
    if (!orderId) {
      setStatus('ERROR');
      return;
    }

    const processLocalPayment = async () => {
      try {
        const queryString = window.location.search;

        console.log("Đang gọi IPN ngầm cho Localhost...");
        await paymentService.triggerLocalIPN(queryString);


        const checkRes = await paymentService.checkPaymentStatus(orderId);
        
        if (checkRes.status === 'SUCCESS') {
          setStatus('SUCCESS');
        } else {
          setStatus('FAILED');
        }
      } catch (error) {
        console.error("Lỗi khi xử lý giao dịch ngầm:", error);
        setStatus('FAILED'); 
      }
    };

    processLocalPayment();
  }, [orderId]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-950">
      <div className="w-full max-w-md animate-fade-in flex flex-col items-center rounded-[2.5rem] bg-white p-10 text-center shadow-2xl dark:border dark:border-gray-800 dark:bg-gray-900">
        
        {status === 'CHECKING' && (
          <>
            <div className="relative mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-blue-50 text-blue-500 dark:bg-blue-900/20">
              <div className="absolute inset-0 animate-ping rounded-full bg-blue-400 opacity-20"></div>
              <Loader2 size={56} strokeWidth={2} className="animate-spin relative z-10" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Đang xác nhận giao dịch...</h1>
            <p className="mt-2 font-medium text-gray-500">Hệ thống đang thẩm định chữ ký bảo mật. Vui lòng không tắt trang.</p>
          </>
        )}

        {status === 'SUCCESS' && (
          <div className="animate-fade-in flex flex-col items-center">
            <div className="relative mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-green-100 text-green-500 shadow-xl shadow-green-500/20 dark:bg-green-500/20 animate-bounce-short">
              <CheckCircle2 size={64} strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">Thanh toán thành công!</h1>
            <p className="mt-2 font-medium text-gray-500">
              Cảm ơn bạn! Quyền Premium đã được kích hoạt. Hãy bắt đầu hành trình của mình.
            </p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 py-4 text-lg font-black text-white shadow-[0_6px_0_#059669] transition-all hover:brightness-110 active:translate-y-1.5 active:shadow-none"
            >
              Bắt đầu học ngay <ArrowRight size={20} strokeWidth={3} />
            </button>
          </div>
        )}

        {status === 'FAILED' && (
          <div className="animate-fade-in flex flex-col items-center">
            <div className="relative mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-red-100 text-red-500 shadow-xl shadow-red-500/20 dark:bg-red-500/20">
              <XCircle size={64} strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">Giao dịch thất bại</h1>
            <p className="mt-2 font-medium text-gray-500">
              Giao dịch đã bị hủy hoặc có lỗi xảy ra. Bạn chưa bị trừ tiền.
            </p>
            <div className="w-full flex flex-col gap-3 mt-8">
              <button 
                onClick={() => navigate('/premium')}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 py-4 text-lg font-black text-white shadow-[0_6px_0_#000] transition-all active:translate-y-1.5 active:shadow-none dark:bg-gray-800 dark:shadow-[0_6px_0_#1f2937]"
              >
                <RotateCcw size={20} strokeWidth={3} /> Thử lại
              </button>
              <button onClick={() => navigate('/dashboard')} className="font-bold text-gray-400 hover:text-gray-600 transition-colors">
                Về trang chủ
              </button>
            </div>
          </div>
        )}

        {status === 'ERROR' && (
          <div className="animate-fade-in flex flex-col items-center">
            <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800">
              <XCircle size={56} strokeWidth={2} />
            </div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Lỗi truy xuất</h1>
            <p className="mt-2 font-medium text-gray-500">Không tìm thấy mã đơn hàng hợp lệ.</p>
            <button onClick={() => navigate('/dashboard')} className="mt-8 font-bold text-primary">Về trang chủ</button>
          </div>
        )}

      </div>
    </div>
  );
};