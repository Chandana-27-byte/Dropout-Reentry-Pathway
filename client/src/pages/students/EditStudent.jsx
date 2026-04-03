import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import studentService from '../../services/studentService';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiSave } from 'react-icons/fi';

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    studentService.getById(id)
      .then(res => { if (res.success) setFormData(res.data); })
      .catch(() => { toast.error('Failed to load student'); navigate('/students'); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await studentService.update(id, formData);
      toast.success('Student updated successfully');
      navigate(`/students/${id}`);
    } catch (error) { toast.error('Failed to update student'); } finally { setSaving(false); }
  };

  if (loading) return <Loading fullScreen />;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(`/students/${id}`)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><FiArrowLeft className="w-5 h-5" /></button>
        <div><h1 className="page-title">Edit Student</h1><p className="page-subtitle">Update student information</p></div>
      </div>
      <form onSubmit={handleSubmit}>
        <Card title="Personal Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="First Name" name="first_name" value={formData.first_name || ''} onChange={handleChange} required />
            <Input label="Last Name" name="last_name" value={formData.last_name || ''} onChange={handleChange} required />
            <Input label="Email" type="email" name="email" value={formData.email || ''} onChange={handleChange} />
            <Input label="Phone" type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} />
          </div>
        </Card>
        <div className="flex justify-end gap-4 mt-6">
          <Button variant="secondary" onClick={() => navigate(`/students/${id}`)}>Cancel</Button>
          <Button type="submit" icon={FiSave} loading={saving}>Save Changes</Button>
        </div>
      </form>
    </div>
  );
};

export default EditStudent;
