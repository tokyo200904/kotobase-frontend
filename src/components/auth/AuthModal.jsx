import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; 
import { X, Mail, Lock, User, Loader2, AlertCircle } from 'lucide-react'; 
import { authService, GOOGLE_LOGIN_URL } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

let portalRoot = document.getElementById('portal-root');
if (!portalRoot && typeof document !== 'undefined') {
  portalRoot = document.createElement('div');
  portalRoot.id = 'portal-root';
  document.body.appendChild(portalRoot);
}

export const AuthModal = ({ isOpen, onClose }) => {
  const { loginWithToken } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const [apiError, setApiError] = useState('');
  
  const [formErrors, setFormErrors] = useState({});

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullname, setFullname] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    setFormErrors({});
    setApiError('');
  }, [isLoginMode]);

  if (!isOpen) return null;

  const validateForm = () => {
    const errors = {};
    
    if (!email.trim()) {
      errors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Định dạng Email không hợp lệ";
    }

    if (!password) {
      errors.password = "Mật khẩu không được để trống";
    } else if (password.length < 5) {
      errors.password = "Mật khẩu quá ngắn (tối thiểu 5 ký tự)";
    }

    if (!isLoginMode) {
      if (!fullname.trim()) {
        errors.fullname = "Họ tên không được để trống";
      } else if (fullname.length < 3 || fullname.length > 100) {
        errors.fullname = "Họ tên phải từ 3 đến 100 ký tự";
      }

      if (password !== confirmPassword) {
        errors.confirmPassword = "Mật khẩu nhập lại không khớp!";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let data;
      if (isLoginMode) {
        data = await authService.login(email, password);
      } else {
        data = await authService.register(email, password, fullname);
      }
      await loginWithToken(data.token);
      onClose();
    } catch (error) {
      setApiError(error.message); 
    } finally {
      setIsLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-0" onClick={onClose}></div>

      <div className="relative my-auto w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl dark:border dark:border-gray-800 dark:bg-gray-900">
        <button onClick={onClose} className="absolute right-4 top-4 z-10 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
          <X size={20} />
        </button>

        <div className="p-6 md:p-8">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white md:text-3xl">
              {isLoginMode ? 'Chào mừng trở lại!' : 'Tạo tài khoản mới'}
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Tiếp tục hành trình chinh phục tiếng Nhật cùng KotoBase
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            
            {apiError && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-600 dark:bg-red-900/30 dark:text-red-400">
                <AlertCircle size={18} className="shrink-0" />
                {apiError}
              </div>
            )}

            {!isLoginMode && (
              <div>
                <div className="relative">
                  <User size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${formErrors.fullname ? 'text-red-400' : 'text-gray-400'}`} />
                  <input
                    type="text" placeholder="Họ và tên" value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    className={`w-full rounded-xl border bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition-colors focus:bg-white focus:ring-1 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900 ${
                      formErrors.fullname ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-primary focus:ring-primary dark:border-gray-700'
                    }`}
                  />
                </div>
                {formErrors.fullname && <p className="mt-1.5 ml-1 text-xs font-medium text-red-500">{formErrors.fullname}</p>}
              </div>
            )}

            <div>
              <div className="relative">
                <Mail size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${formErrors.email ? 'text-red-400' : 'text-gray-400'}`} />
                <input
                  type="email" placeholder="Email của bạn" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full rounded-xl border bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition-colors focus:bg-white focus:ring-1 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900 ${
                    formErrors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-primary focus:ring-primary dark:border-gray-700'
                  }`}
                />
              </div>
              {formErrors.email && <p className="mt-1.5 ml-1 text-xs font-medium text-red-500">{formErrors.email}</p>}
            </div>

            <div>
              <div className="relative">
                <Lock size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${formErrors.password ? 'text-red-400' : 'text-gray-400'}`} />
                <input
                  type="password" placeholder="Mật khẩu" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full rounded-xl border bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition-colors focus:bg-white focus:ring-1 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900 ${
                    formErrors.password ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-primary focus:ring-primary dark:border-gray-700'
                  }`}
                />
              </div>
              {formErrors.password && <p className="mt-1.5 ml-1 text-xs font-medium text-red-500">{formErrors.password}</p>}
            </div>

            {!isLoginMode && (
              <div>
                <div className="relative">
                  <Lock size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${formErrors.confirmPassword ? 'text-red-400' : 'text-gray-400'}`} />
                  <input
                    type="password" placeholder="Nhập lại mật khẩu" value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full rounded-xl border bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition-colors focus:bg-white focus:ring-1 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900 ${
                      formErrors.confirmPassword ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-primary focus:ring-primary dark:border-gray-700'
                    }`}
                  />
                </div>
                {formErrors.confirmPassword && <p className="mt-1.5 ml-1 text-xs font-medium text-red-500">{formErrors.confirmPassword}</p>}
              </div>
            )}

            <button
              type="submit" disabled={isLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-primary-hover active:scale-95 disabled:opacity-70"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : (isLoginMode ? 'Đăng nhập' : 'Đăng ký')}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Hoặc</span>
            <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
          </div>

          <button
            type="button"
            onClick={() => window.location.href = GOOGLE_LOGIN_URL}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-3 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span>Tiếp tục với Google</span>
          </button>

          <p className="mt-6 text-center text-sm text-gray-500">
            {isLoginMode ? 'Bạn chưa có tài khoản? ' : 'Đã có tài khoản? '}
            <button 
              type="button" 
              onClick={() => setIsLoginMode(!isLoginMode)} 
              className="font-bold text-primary hover:underline"
            >
              {isLoginMode ? 'Đăng ký ngay' : 'Đăng nhập'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, portalRoot);
};