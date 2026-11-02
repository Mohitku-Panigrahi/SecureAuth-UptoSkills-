import axios from 'axios';

const api = axios.create({
  baseURL: '',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor for consistent error extraction
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message || 'An unexpected error occurred.',
      data: error.response?.data || null
    };
    return Promise.reject(customError);
  }
);

export const authApi = {
  checkHealth: () => api.get('/api/health'),
  register: (data) => api.post('/api/auth/register', data),
  verifyEmail: (data) => api.post('/api/auth/verify-email', data),
  resendOtp: (data) => api.post('/api/auth/resend-otp', data),
  login: (data) => api.post('/api/auth/login', data),
  logout: () => api.post('/api/auth/logout'),
  getMe: () => api.get('/api/auth/me'),
  forgotPassword: (data) => api.post('/api/auth/forgot-password', data),
  verifyResetOtp: (data) => api.post('/api/auth/verify-reset-otp', data),
  resetPassword: (data) => api.post('/api/auth/reset-password', data),
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (data) => api.put('/api/users/profile', data),
  changePassword: (data) => api.patch('/api/users/change-password', data),
  deleteAccount: () => api.delete('/api/users/account')
};

export default api;
