import api from './api';

const enrollmentService = {
  getAll: async () => { const response = await api.get('/enrollments'); return response.data; },
  create: async (data) => { const response = await api.post('/enrollments', data); return response.data; },
};

export default enrollmentService;
