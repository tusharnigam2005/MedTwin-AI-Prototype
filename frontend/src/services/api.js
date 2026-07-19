import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('medtwin_jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    return api.post('/api/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  },
  signup: (payload) => api.post('/api/auth/signup', payload),
};

export const reportsAPI = {
  upload: (patientId, file) => {
    const formData = new FormData();
    formData.append('patient_id', patientId);
    formData.append('file', file);
    return api.post('/api/reports/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

export const patientAPI = {
  getPrediction: (patientId) => api.get(`/api/prediction/${patientId}`),
  getRecommendations: (patientId) => api.get(`/api/recommendation/${patientId}`),
  getHistory: (patientId) => api.get(`/api/history/${patientId}`),
};

export const blockchainAPI = {
  verifyRecord: (recordId, sha256Hash) => api.post('/api/blockchain/verify', { record_id: recordId, sha256_hash: sha256Hash }),
};

export const doctorAPI = {
  approveRecord: (recordId, status, overrideNotes = null) => 
    api.post(`/api/doctor/approve/${recordId}`, { action_status: status, override_notes: overrideNotes }),
};

export default api;
