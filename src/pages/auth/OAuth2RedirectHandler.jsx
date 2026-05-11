import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

export const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    // Trích xuất token từ URL query string
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // Đăng nhập và đẩy về trang chủ
      loginWithToken(token).then(() => {
        navigate('/', { replace: true });
      }).catch((err) => {
        console.error("Lỗi Google Login:", err);
        navigate('/', { replace: true });
      });
    } else {
      navigate('/', { replace: true });
    }
  }, [location, loginWithToken, navigate]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="flex flex-col items-center gap-4">
        <Loader2 size={48} className="animate-spin text-primary" />
        <p className="text-lg font-medium text-gray-600 dark:text-gray-300">Đang xác thực thông tin...</p>
      </div>
    </div>
  );
};