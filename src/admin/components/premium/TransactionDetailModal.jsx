import React, { useState, useEffect } from 'react';
import { X, Loader2, CreditCard, Terminal, Calendar, Mail, ShieldCheck } from 'lucide-react';
import { adminService } from '../../../services/adminService';

export const TransactionDetailModal = ({ isOpen, onClose, transactionId }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [detailData, setDetailData] = useState(null);

  useEffect(() => {
    if (transactionId && isOpen) {
      setIsLoading(true);
      const fetchDetail = async () => {
        try {
          const res = await adminService.getTransactionDetail(transactionId);
          setDetailData(res.data || res);
        } catch (err) {
          alert('Không thể tải vết log giao dịch từ Gateway!');
          triggerClose();
        } finally {
          setIsLoading(false);
        }
      };
      fetchDetail();
    } else {
      setDetailData(null);
    }
  }, [transactionId, isOpen]);

  const triggerClose = () => {
    setIsClosing(true);
    setTimeout(() => { onClose(); setIsClosing(false); }, 300);
  };

  if (!isOpen && !isClosing) return null;

  const formatCurrency = (val) => val ? val.toLocaleString('vi-VN') + ' VNĐ' : '0 VNĐ';

  const formatRawPayload = (payloadString) => {
    if (!payloadString) return "{}";
    try {
      const parsed = typeof payloadString === 'string' ? JSON.parse(payloadString) : payloadString;
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      return payloadString;
    }
  };

  const info = detailData?.transactionInfo;
  const latestLog = detailData?.logs && detailData.logs.length > 0 ? detailData.logs[0] : null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-md p-4 transition-all duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      <div className={`bg-[#f8fafc] dark:bg-gray-950 w-full max-w-4xl h-[90vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-gray-200/50 dark:border-gray-800 transition-all duration-300 ${isClosing ? 'scale-95 opacity-0 translate-y-4' : 'scale-100 opacity-100 translate-y-0'}`}>
        
        <div className="px-10 py-6 border-b border-gray-200/50 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm z-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <CreditCard size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Chi tiết giao dịch</h2>
              <p className="text-xs font-bold text-gray-400 mt-0.5">Mã đơn hệ thống: {transactionId}</p>
            </div>
          </div>
          <button onClick={triggerClose} className="h-12 w-12 flex items-center justify-center text-gray-400 bg-gray-50 hover:bg-gray-200 rounded-2xl transition-all dark:bg-gray-800 dark:hover:bg-gray-700">
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center"><Loader2 size={40} className="animate-spin text-primary" /></div>
          ) : detailData ? (
            <>
              <section className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-gray-400" />
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Học viên thanh toán</p>
                      <p className="text-sm font-black text-gray-900 dark:text-white">{info?.userEmail || 'Đang tải...'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={18} className="text-gray-400" />
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Gói cước đăng ký</p>
                      <p className="text-sm font-black text-primary">{info?.planName || 'Gói Premium'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 md:border-l md:border-gray-100 md:dark:border-gray-800 md:pl-6">
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-gray-400" />
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Thời gian khởi tạo đơn</p>
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{info?.createdAt || latestLog?.createdAt || '---'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-0.5">Tổng số tiền giao dịch</p>
                    <p className="text-xl font-black text-green-600">{formatCurrency(info?.amount)}</p>
                  </div>
                </div>
              </section>

              <section className="flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Terminal size={18} className="text-orange-500" />
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Raw Payload Webhook Log</h3>
                </div>
                
                <div className="mb-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-wrap gap-6 text-xs font-bold text-gray-500">
                  <div>Mã phản hồi Gateway (vnp_ResponseCode): <span className={`font-black ${latestLog?.resultCode === '00' ? 'text-green-600' : 'text-red-500'}`}>{latestLog?.resultCode || 'N/A'}</span></div>
                  <div className="hidden sm:block">|</div>
                  <div>Mã GD Cổng VNPay: <span className="text-gray-900 dark:text-white font-black">{latestLog?.gatewayTransId || 'Chưa phát sinh'}</span></div>
                </div>

                <div className="relative rounded-2xl border border-gray-800 bg-[#1e1e1e] p-5 shadow-inner overflow-hidden group">
                  <div className="absolute right-4 top-4 text-[10px] font-black text-gray-500 uppercase tracking-widest pointer-events-none group-hover:text-primary transition-colors">JSON Format</div>
                  <pre className="max-h-[300px] overflow-auto text-left text-xs font-mono font-bold leading-relaxed text-green-400 custom-scrollbar whitespace-pre-wrap break-all select-text selection:bg-primary/30">
                    <code>{formatRawPayload(latestLog?.rawPayload)}</code>
                  </pre>
                </div>
              </section>
            </>
          ) : (
            <p className="text-center text-gray-400 py-12">Không tìm thấy bản ghi chi tiết.</p>
          )}
        </div>

        <div className="px-10 py-6 border-t border-gray-200/50 dark:border-gray-800 bg-white dark:bg-gray-900 flex justify-end gap-4 z-20">
          <button onClick={triggerClose} className="px-8 py-4 rounded-2xl font-black text-gray-500 bg-gray-50 hover:bg-gray-200 transition-all dark:bg-gray-800 dark:text-gray-300">
            Đóng bảng kiểm tra
          </button>
        </div>

      </div>
    </div>
  );
};