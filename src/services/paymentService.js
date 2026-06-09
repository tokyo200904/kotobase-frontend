import { getHeaders } from './authService';

const BASE_URL = 'http://localhost:8080/api/v1';

export const paymentService = {
  getPlans: async () => {
    const res = await fetch(`${BASE_URL}/plans`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Không tải được gói Premium');
    return await res.json();
  },

  createPayment: async (planId) => {
    const res = await fetch(`${BASE_URL}/payment/create`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ planId }) 
    });
    if (!res.ok) throw new Error('Không tạo được đơn hàng');
    return await res.json();
  },

  checkPaymentStatus: async (orderId) => {
    const res = await fetch(`${BASE_URL}/payment/check-status/${orderId}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Lỗi kiểm tra trạng thái');
    return await res.json();
  },

  triggerLocalIPN: async (queryString) => {
    const res = await fetch(`${BASE_URL}/payment/vnpay-ipn${queryString}`, {
      method: 'GET'
    });
    if (!res.ok) throw new Error('Lỗi gọi ngầm IPN');
    return await res.json();
  }
};