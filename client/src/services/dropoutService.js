import api from './api';

const dropoutService = {
  getAll: async (params = {}) => {
    const response = await api.get('/dropouts', { params });
    return {
      success: true,
      data: {
        dropouts: response.data.data,
        pagination: response.data.pagination,
      },
    };
  },

  getById: async (id) => {
    const response = await api.get(`/dropouts/${id}`);
    return response.data;
  },

  record: async (data) => {
    const payload = {
      studentId: data.studentId,
      dropoutDate: data.dropoutDate,
      reasonId: data.primaryReasonId,
      detailedReason: data.detailedReason,
      lastClassAttended: data.lastClassAttended,
      lastEducationLevel: data.lastEducationLevel,
      familySituation: data.familySituation,
      financialStatus: data.financialStatus,
      willingToReturn: data.willingToReturn,
      preferredMode: data.preferredMode,
      specialNeeds: data.specialNeeds,
    };
    const response = await api.post('/dropouts', payload);
    return { success: true, data: { dropout_id: response.data.data?.id } };
  },

  verify: async (id) => {
    const response = await api.put(`/dropouts/${id}/verify`);
    return response.data;
  },

  getReasons: async () => {
    const response = await api.get('/dropouts/reasons');
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/dropouts/stats');
    return response.data;
  },

  getAnalysis: async (params = {}) => {
    const response = await api.get('/dropouts/analysis', { params });
    return response.data;
  },
};

export default dropoutService;
