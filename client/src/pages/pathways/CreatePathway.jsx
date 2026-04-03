import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiInfo, FiBook, FiClock, FiUsers } from 'react-icons/fi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import pathwayService from '../../services/pathwayService';
import toast from 'react-hot-toast';

const CreatePathway = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pathway_name: '', pathway_code: '', pathway_type: '', description: '',
    duration_months: '', mode: '', total_modules: '', max_enrollment: '',
    fee_amount: '', target_education_level: '', prerequisite_level: 'none',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.pathway_name) newErrors.pathway_name = 'Pathway name is required';
    if (!formData.pathway_type) newErrors.pathway_type = 'Type is required';
    if (!formData.duration_months) newErrors.duration_months = 'Duration is required';
    if (!formData.mode) newErrors.mode = 'Mode is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await pathwayService.create({
        ...formData,
        duration_months: Number(formData.duration_months),
        total_modules: Number(formData.total_modules),
        max_enrollment: Number(formData.max_enrollment),
        fee_amount: Number(formData.fee_amount || 0),
      });
      if (response.success) { toast.success('Pathway created successfully'); navigate(`/pathways/${response.data.id || response.data.pathway_id}`); }
    } catch (error) { toast.error(error.response?.data?.message || 'Failed to create pathway'); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/pathways')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><FiArrowLeft className="w-5 h-5" /></button>
        <div><h1 className="page-title">Create New Pathway</h1><p className="page-subtitle">Add a new educational re-entry pathway</p></div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card title="Basic Information" icon={FiInfo}>
              <div className="space-y-4">
                <Input label="Pathway Name" name="pathway_name" placeholder="e.g. Bridge Course (Secondary)" value={formData.pathway_name} onChange={handleChange} error={errors.pathway_name} required />
                <div><label className="label">Description</label><textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="input" placeholder="Describe the pathway and its benefits..." /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Pathway Type <span className="text-red-500">*</span></label>
                    <select name="pathway_type" value={formData.pathway_type} onChange={handleChange} className={`input ${errors.pathway_type ? 'input-error' : ''}`}>
                      <option value="">Select Type</option>
                      <option value="academic">Academic</option><option value="vocational">Vocational</option>
                      <option value="skill_based">Skill Based</option><option value="bridge_course">Bridge Course</option>
                      <option value="certification">Certification</option><option value="diploma">Diploma</option>
                    </select>
                    {errors.pathway_type && <p className="text-sm text-red-600 mt-1">{errors.pathway_type}</p>}
                  </div>
                  <Input label="Pathway Code (Optional)" name="pathway_code" placeholder="e.g. BR-SEC-01" value={formData.pathway_code} onChange={handleChange} />
                </div>
              </div>
            </Card>
            <Card title="Curriculum & Capacity" icon={FiBook}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="Total Modules" type="number" name="total_modules" value={formData.total_modules} onChange={handleChange} placeholder="0" />
                <Input label="Max Enrollment" type="number" name="max_enrollment" value={formData.max_enrollment} onChange={handleChange} placeholder="N/A" />
                <Input label="Pathway Fee (₹)" type="number" name="fee_amount" value={formData.fee_amount} onChange={handleChange} placeholder="0 for Free" />
              </div>
            </Card>
          </div>
          <div className="space-y-6">
            <Card title="Delivery Stats" icon={FiClock}>
              <div className="space-y-4">
                <Input label="Duration (Months)" type="number" name="duration_months" value={formData.duration_months} onChange={handleChange} error={errors.duration_months} required />
                <div>
                  <label className="label">Mode of Delivery <span className="text-red-500">*</span></label>
                  <select name="mode" value={formData.mode} onChange={handleChange} className={`input ${errors.mode ? 'input-error' : ''}`}>
                    <option value="">Select Mode</option>
                    <option value="full_time">Full Time</option><option value="part_time">Part Time</option>
                    <option value="distance">Distance</option><option value="online">Online</option><option value="hybrid">Hybrid</option>
                  </select>
                  {errors.mode && <p className="text-sm text-red-600 mt-1">{errors.mode}</p>}
                </div>
              </div>
            </Card>
            <Card title="Academic Requirements" icon={FiUsers}>
              <div className="space-y-4">
                <div>
                  <label className="label">Target Education Level</label>
                  <select name="target_education_level" value={formData.target_education_level} onChange={handleChange} className="input">
                    <option value="">Any</option><option value="primary">Primary</option><option value="middle">Middle</option>
                    <option value="secondary">Secondary</option><option value="higher_secondary">Higher Secondary</option><option value="graduation">Graduation</option>
                  </select>
                </div>
                <div>
                  <label className="label">Prerequisite Level</label>
                  <select name="prerequisite_level" value={formData.prerequisite_level} onChange={handleChange} className="input">
                    <option value="none">None</option><option value="primary">Primary</option>
                    <option value="middle">Middle</option><option value="secondary">Secondary</option>
                  </select>
                </div>
              </div>
            </Card>
            <div className="pt-4">
              <Button type="submit" icon={FiSave} className="w-full h-12 text-lg" loading={loading}>Create Pathway</Button>
              <Link to="/pathways" className="block text-center mt-4 text-sm text-gray-500 hover:text-gray-700">Cancel and return</Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePathway;
