import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import studentService from '../../services/studentService';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AddStudent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', dateOfBirth: '', gender: '', email: '', phone: '',
    address: '', districtId: '', pincode: '', aadhaarNumber: '', category: 'general',
    isDifferentlyAbled: false, disabilityType: '', fatherName: '', motherName: '',
    guardianName: '', guardianPhone: '', guardianOccupation: '', familyIncome: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => { fetchStates(); }, []);

  const fetchStates = async () => {
    try {
      const response = await api.get('/institutions/states');
      if (response.data.success) setStates(response.data.data);
    } catch (error) { console.error('Failed to fetch states'); }
  };

  const fetchDistricts = async (stateId) => {
    try {
      const response = await api.get(`/institutions/districts?stateId=${stateId}`);
      if (response.data.success) setDistricts(response.data.data);
    } catch (error) { console.error('Failed to fetch districts'); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleStateChange = (e) => {
    const stateId = e.target.value;
    if (stateId) fetchDistricts(stateId); else setDistricts([]);
    setFormData((prev) => ({ ...prev, districtId: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (formData.aadhaarNumber && !/^\d{12}$/.test(formData.aadhaarNumber)) newErrors.aadhaarNumber = 'Aadhaar number must be 12 digits';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await studentService.create(formData);
      if (response.success) { toast.success('Student created successfully'); navigate(`/students/${response.data.studentId}`); }
    } catch (error) { toast.error(error.response?.data?.message || 'Failed to create student'); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/students')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><FiArrowLeft className="w-5 h-5" /></button>
        <div><h1 className="page-title">Add New Student</h1><p className="page-subtitle">Create a new student record</p></div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Personal Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} error={errors.firstName} required />
              <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} error={errors.lastName} required />
              <Input label="Date of Birth" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} error={errors.dateOfBirth} required />
              <div>
                <label className="label">Gender <span className="text-red-500">*</span></label>
                <select name="gender" value={formData.gender} onChange={handleChange} className={`input ${errors.gender ? 'input-error' : ''}`}>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                </select>
                {errors.gender && <p className="text-sm text-red-600 mt-1">{errors.gender}</p>}
              </div>
              <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} />
              <Input label="Phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} />
              <Input label="Aadhaar Number" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} error={errors.aadhaarNumber} maxLength={12} />
              <div>
                <label className="label">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="input">
                  <option value="general">General</option><option value="obc">OBC</option>
                  <option value="sc">SC</option><option value="st">ST</option><option value="ews">EWS</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="isDifferentlyAbled" checked={formData.isDifferentlyAbled} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-primary-600" />
                <span className="text-sm text-gray-700">Differently Abled</span>
              </label>
              {formData.isDifferentlyAbled && <Input label="Disability Type" name="disabilityType" value={formData.disabilityType} onChange={handleChange} className="mt-3" />}
            </div>
          </Card>
          <Card title="Address Information">
            <div className="space-y-4">
              <div><label className="label">Address</label><textarea name="address" value={formData.address} onChange={handleChange} rows={3} className="input" placeholder="Enter full address" /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">State</label>
                  <select onChange={handleStateChange} className="input">
                    <option value="">Select State</option>
                    {states.map((s) => <option key={s.state_id} value={s.state_id}>{s.state_name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">District</label>
                  <select name="districtId" value={formData.districtId} onChange={handleChange} className="input">
                    <option value="">Select District</option>
                    {districts.map((d) => <option key={d.district_id} value={d.district_id}>{d.district_name}</option>)}
                  </select>
                </div>
                <Input label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} maxLength={6} />
              </div>
            </div>
          </Card>
          <Card title="Family Information" className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Father's Name" name="fatherName" value={formData.fatherName} onChange={handleChange} />
              <Input label="Mother's Name" name="motherName" value={formData.motherName} onChange={handleChange} />
              <Input label="Guardian's Name" name="guardianName" value={formData.guardianName} onChange={handleChange} />
              <Input label="Guardian's Phone" type="tel" name="guardianPhone" value={formData.guardianPhone} onChange={handleChange} />
              <Input label="Guardian's Occupation" name="guardianOccupation" value={formData.guardianOccupation} onChange={handleChange} />
              <Input label="Family Annual Income (₹)" type="number" name="familyIncome" value={formData.familyIncome} onChange={handleChange} />
            </div>
          </Card>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <Link to="/students"><Button variant="secondary">Cancel</Button></Link>
          <Button type="submit" icon={FiSave} loading={loading}>Save Student</Button>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;
