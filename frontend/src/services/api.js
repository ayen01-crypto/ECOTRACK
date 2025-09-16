import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ecotrack_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('ecotrack_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
};

// Users API
export const usersAPI = {
  getDashboard: (params) => api.get('/users/dashboard', { params }),
  getProfile: () => api.get('/users/profile'),
  updatePreferences: (preferences) => api.put('/users/preferences', { preferences }),
  getStats: (params) => api.get('/users/stats', { params }),
};

// Activities API
export const activitiesAPI = {
  getActivities: (params) => api.get('/activities', { params }),
  getActivity: (id) => api.get(`/activities/${id}`),
  createActivity: (activityData) => api.post('/activities', activityData),
  updateActivity: (id, activityData) => api.put(`/activities/${id}`, activityData),
  deleteActivity: (id) => api.delete(`/activities/${id}`),
  getFootprintStats: (params) => api.get('/activities/stats/footprint', { params }),
};

// Calculator API
export const calculatorAPI = {
  calculateFootprint: (data) => api.post('/calculator/footprint', data),
  getFactors: () => api.get('/calculator/factors'),
  getTransportationOptions: () => api.get('/calculator/transportation'),
  getDietOptions: () => api.get('/calculator/diet'),
};

// Achievements API
export const achievementsAPI = {
  getAchievements: (params) => api.get('/achievements', { params }),
  getUserAchievements: () => api.get('/achievements/user'),
  checkAchievements: () => api.post('/achievements/check'),
  getAchievementStats: () => api.get('/achievements/stats'),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;
