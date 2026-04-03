import api from './api';

const studentService = {
  getAll: async (params = {}) => {
    const response = await api.get('/students', { params });
    return {
      success: true,
      data: {
        students: response.data.data,
        pagination: response.data.pagination,
      },
    };
  },

  getById: async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  create: async (data) => {
    const payload = {
      enrollment_number: data.enrollmentNumber || `STU${Date.now()}`,
      first_name: data.firstName,
      last_name: data.lastName,
      date_of_birth: data.dateOfBirth,
      gender: data.gender,
      email: data.email,
      phone: data.phone,
      address: data.address,
      district_id: data.districtId || null,
      pincode: data.pincode,
      aadhaar_number: data.aadhaarNumber,
      category: data.category,
      is_differently_abled: data.isDifferentlyAbled,
      disability_type: data.disabilityType,
      father_name: data.fatherName,
      mother_name: data.motherName,
      guardian_name: data.guardianName,
      guardian_phone: data.guardianPhone,
      guardian_occupation: data.guardianOccupation,
      family_income: data.familyIncome || null,
      status: 'active',
    };
    const response = await api.post('/students', payload);
    return { success: true, data: { studentId: response.data.data?.id } };
  },

  update: async (id, data) => {
    const response = await api.put(`/students/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },

  search: async (query) => {
    const response = await api.get('/students', { params: { search: query, limit: 20 } });
    return { success: true, data: response.data.data };
  },
};

export default studentService;
