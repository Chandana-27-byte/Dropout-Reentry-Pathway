import api from './api';

const pathwayService = {
  getAll: async (params = {}) => { const response = await api.get('/pathways', { params }); return { success: true, data: { pathways: response.data.data, pagination: response.data.pagination } }; },
  getById: async (id) => { const response = await api.get(`/pathways/${id}`); return response.data; },
  create: async (data) => { const response = await api.post('/pathways', data); return response.data; },
  delete: async (id) => { const response = await api.delete(`/pathways/${id}`); return response.data; },
  getRecommendations: async (dropoutId) => { const response = await api.get(`/pathways/recommend/${dropoutId}`); return response.data; },
};

export default pathwayService;
