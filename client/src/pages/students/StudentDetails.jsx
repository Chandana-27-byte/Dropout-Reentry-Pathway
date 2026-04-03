import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiEdit, FiTrash2, FiPhone, FiMail, FiMapPin, FiCalendar, FiUser, FiBook, FiArrowLeft } from 'react-icons/fi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import Modal from '../../components/common/Modal';
import studentService from '../../services/studentService';
import toast from 'react-hot-toast';

const InfoItem = ({ label, value, className = '' }) => (
  <div className={className}><p className="text-sm text-gray-500">{label}</p><p className="font-medium text-gray-900">{value}</p></div>
);

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { fetchStudent(); }, [id]);

  const fetchStudent = async () => {
    try {
      const response = await studentService.getById(id);
      if (response.success) setStudent(response.data);
    } catch (error) { toast.error('Failed to fetch student details'); navigate('/students'); } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await studentService.delete(id);
      if (response.success) { toast.success('Student deleted successfully'); navigate('/students'); }
    } catch (error) { toast.error('Failed to delete student'); } finally { setDeleting(false); setDeleteModal(false); }
  };

  if (loading) return <Loading fullScreen />;
  if (!student) return <div className="text-center py-12"><p className="text-gray-500">Student not found</p><Link to="/students" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">Back to Students</Link></div>;

  const statusColors = { active: 'badge-success', dropout: 'badge-danger', reentry: 'badge-warning', completed: 'badge-info' };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/students')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><FiArrowLeft className="w-5 h-5" /></button>
        <div className="flex-1"><h1 className="page-title">Student Details</h1><p className="page-subtitle">View and manage student information</p></div>
        <div className="flex items-center gap-2">
          <Link to={`/students/${id}/edit`}><Button variant="secondary" icon={FiEdit}>Edit</Button></Link>
          <Button variant="danger" icon={FiTrash2} onClick={() => setDeleteModal(true)}>Delete</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <div className="text-center">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-700 font-bold text-3xl">{student.first_name?.[0]}{student.last_name?.[0]}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{student.first_name} {student.last_name}</h2>
            <p className="text-gray-500">{student.enrollment_number}</p>
            <span className={`badge ${statusColors[student.status]} mt-2`}>{student.status}</span>
          </div>
          <hr className="my-6" />
          <div className="space-y-4">
            {student.phone && <div className="flex items-center gap-3 text-gray-600"><FiPhone className="w-5 h-5" /><span>{student.phone}</span></div>}
            {student.email && <div className="flex items-center gap-3 text-gray-600"><FiMail className="w-5 h-5" /><span>{student.email}</span></div>}
            {student.district_name && <div className="flex items-center gap-3 text-gray-600"><FiMapPin className="w-5 h-5" /><span>{student.district_name}, {student.state_name}</span></div>}
            <div className="flex items-center gap-3 text-gray-600"><FiCalendar className="w-5 h-5" /><span>{new Date(student.date_of_birth).toLocaleDateString()}</span></div>
            <div className="flex items-center gap-3 text-gray-600"><FiUser className="w-5 h-5" /><span className="capitalize">{student.gender}</span></div>
          </div>
        </Card>
        <Card className="lg:col-span-2" title="Personal Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem label="Category" value={student.category?.toUpperCase()} />
            <InfoItem label="Aadhaar Number" value={student.aadhaar_number || 'Not provided'} />
            <InfoItem label="Father's Name" value={student.father_name || 'Not provided'} />
            <InfoItem label="Mother's Name" value={student.mother_name || 'Not provided'} />
            <InfoItem label="Guardian's Name" value={student.guardian_name || 'Not provided'} />
            <InfoItem label="Guardian's Phone" value={student.guardian_phone || 'Not provided'} />
            <InfoItem label="Family Income" value={student.family_income ? `₹${student.family_income.toLocaleString()}` : 'Not provided'} />
            <InfoItem label="Address" value={student.address || 'Not provided'} className="md:col-span-2" />
            <InfoItem label="Differently Abled" value={student.is_differently_abled ? 'Yes' : 'No'} />
          </div>
        </Card>
      </div>

      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Student"
        footer={<><Button variant="secondary" onClick={() => setDeleteModal(false)}>Cancel</Button><Button variant="danger" onClick={handleDelete} loading={deleting}>Delete</Button></>}>
        <p className="text-gray-600">Are you sure you want to delete this student? This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default StudentDetails;
