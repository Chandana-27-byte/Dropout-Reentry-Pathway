import api from './api';

const reportService = {
  getDashboardStats: async () => { const response = await api.get('/reports/dashboard'); return { success: true, data: { statistics: response.data.data } }; },
  getDropoutReport: async (params = {}) => { const response = await api.get('/reports/dropouts', { params }); return { success: true, data: response.data.data || [] }; },
  getEnrollmentReport: async (params = {}) => { const response = await api.get('/reports/enrollments', { params }); return { success: true, data: response.data.data || [] }; },
  getSuccessRateReport: async () => { const response = await api.get('/reports/success-rate'); return { success: true, data: response.data.data }; },
  getDistrictWiseReport: async () => { const response = await api.get('/reports/district-wise'); return { success: true, data: response.data.data || [] }; },
  getMonthlyTrendReport: async (params = {}) => { const response = await api.get('/reports/monthly-trend', { params }); return { success: true, data: response.data.data || { dropouts: [], enrollments: [] } }; },
  exportReport: async (type, params = {}) => { const response = await api.get(`/reports/export/${type}`, { params, responseType: 'blob' }); return response.data; },
};

export default reportService;
