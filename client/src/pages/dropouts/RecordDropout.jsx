import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiSearch } from 'react-icons/fi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import dropoutService from '../../services/dropoutService';
import studentService from '../../services/studentService';
import toast from 'react-hot-toast';

const RecordDropout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [reasons, setReasons] = useState({});
  const [formData, setFormData] = useState({
    studentId: '', dropoutDate: '', lastClassAttended: '', lastEducationLevel: '',
    primaryReasonId: '', detailedReason: '', familySituation: '', financialStatus: 'middle_income',
    willingToReturn: true, preferredMode: 'flexible', specialNeeds: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => { fetchReasons(); }, []);

  const fetchReasons = async () => {
    try {
      const response = await dropoutService.getReasons();
      if (response.success) setReasons(response.data);
    } catch (error) { console.error('Failed to fetch reasons'); }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const response = await studentService.search(searchQuery);
      if (response.success) { setSearchResults(response.data.filter(s => s.status === 'active')); setShowSearchModal(true); }
    } catch (error) { toast.error('Failed to search students'); } finally { setSearching(false); }
  };

  const handleSelectStudent = (student) => { setSelectedStudent(student); setFormData(p => ({ ...p, studentId: student.student_id })); setShowSearchModal(false); };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.studentId) newErrors.studentId = 'Please select a student';
    if (!formData.dropoutDate) newErrors.dropoutDate = 'Dropout date is required';
    if (!formData.lastEducationLevel) newErrors.lastEducationLevel = 'Last education level is required';
    if (!formData.primaryReasonId) newErrors.primaryReasonId = 'Primary reason is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await dropoutService.record(formData);
      if (response.success) { toast.success('Dropout recorded successfully'); navigate(`/dropouts/${response.data.dropout_id}`); }
    } catch (error) { toast.error(error.response?.data?.message || 'Failed to record dropout'); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/dropouts')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><FiArrowLeft className="w-5 h-5" /></button>
        <div><h1 className="page-title">Record Dropout</h1><p className="page-subtitle">Document a new dropout case</p></div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Student Information" className="lg:col-span-2">
            <div className="flex gap-4 items-end">
              <div className="flex-1"><Input label="Search Student" placeholder="Enter name or enrollment number..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())} /></div>
              <Button type="button" onClick={handleSearch} loading={searching} icon={FiSearch}>Search</Button>
            </div>
            {selectedStudent && (
              <div className="mt-4 p-4 bg-primary-50 rounded-lg border border-primary-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-bold">{selectedStudent.first_name?.[0]}{selectedStudent.last_name?.[0]}</span>
                  </div>
                  <div><p className="font-semibold text-gray-900">{selectedStudent.first_name} {selectedStudent.last_name}</p><p className="text-sm text-gray-600">{selectedStudent.enrollment_number}</p></div>
                  <button type="button" onClick={() => { setSelectedStudent(null); setFormData(p => ({ ...p, studentId: '' })); }} className="ml-auto text-sm text-red-600 hover:text-red-700">Remove</button>
                </div>
              </div>
            )}
            {errors.studentId && <p className="mt-2 text-sm text-red-600">{errors.studentId}</p>}
          </Card>

          <Card title="Dropout Details">
            <div className="space-y-4">
              <Input label="Dropout Date" type="date" name="dropoutDate" value={formData.dropoutDate} onChange={handleChange} error={errors.dropoutDate} required />
              <Input label="Last Class Attended" name="lastClassAttended" value={formData.lastClassAttended} onChange={handleChange} placeholder="e.g., Class 10, 1st Year B.Com" />
              <div>
                <label className="label">Last Education Level <span className="text-red-500">*</span></label>
                <select name="lastEducationLevel" value={formData.lastEducationLevel} onChange={handleChange} className={`input ${errors.lastEducationLevel ? 'input-error' : ''}`}>
                  <option value="">Select Level</option>
                  <option value="primary">Primary (1-5)</option><option value="middle">Middle (6-8)</option>
                  <option value="secondary">Secondary (9-10)</option><option value="higher_secondary">Higher Secondary (11-12)</option>
                  <option value="graduation">Graduation</option><option value="post_graduation">Post Graduation</option>
                </select>
                {errors.lastEducationLevel && <p className="text-sm text-red-600 mt-1">{errors.lastEducationLevel}</p>}
              </div>
            </div>
          </Card>

          <Card title="Reason for Dropout">
            <div className="space-y-4">
              <div>
                <label className="label">Primary Reason <span className="text-red-500">*</span></label>
                <select name="primaryReasonId" value={formData.primaryReasonId} onChange={handleChange} className={`input ${errors.primaryReasonId ? 'input-error' : ''}`}>
                  <option value="">Select Reason</option>
                  {Object.entries(reasons).map(([category, reasonList]) => (
                    <optgroup key={category} label={category.toUpperCase()}>
                      {reasonList.map((reason) => <option key={reason.reason_id} value={reason.reason_id}>{reason.reason_name}</option>)}
                    </optgroup>
                  ))}
                </select>
                {errors.primaryReasonId && <p className="text-sm text-red-600 mt-1">{errors.primaryReasonId}</p>}
              </div>
              <div><label className="label">Detailed Reason</label><textarea name="detailedReason" value={formData.detailedReason} onChange={handleChange} rows={4} className="input" placeholder="Provide detailed explanation..." /></div>
              <div>
                <label className="label">Financial Status</label>
                <select name="financialStatus" value={formData.financialStatus} onChange={handleChange} className="input">
                  <option value="below_poverty">Below Poverty Line</option><option value="low_income">Low Income</option>
                  <option value="middle_income">Middle Income</option><option value="above_middle">Above Middle Income</option>
                </select>
              </div>
            </div>
          </Card>

          <Card title="Re-entry Preferences" className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="willingToReturn" checked={formData.willingToReturn} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-primary-600" />
                  <span className="text-sm text-gray-700">Willing to Return to Education</span>
                </label>
              </div>
              <div>
                <label className="label">Preferred Study Mode</label>
                <select name="preferredMode" value={formData.preferredMode} onChange={handleChange} className="input">
                  <option value="full_time">Full Time</option><option value="part_time">Part Time</option>
                  <option value="distance">Distance Learning</option><option value="online">Online</option><option value="flexible">Flexible</option>
                </select>
              </div>
              <Input label="Special Needs" name="specialNeeds" value={formData.specialNeeds} onChange={handleChange} placeholder="Any special requirements..." />
            </div>
          </Card>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <Link to="/dropouts"><Button variant="secondary">Cancel</Button></Link>
          <Button type="submit" icon={FiSave} loading={loading}>Record Dropout</Button>
        </div>
      </form>

      <Modal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} title="Select Student" size="lg">
        {searchResults.length > 0 ? (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {searchResults.map((student) => (
              <div key={student.student_id} onClick={() => handleSelectStudent(student)} className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-semibold">{student.first_name?.[0]}{student.last_name?.[0]}</span>
                  </div>
                  <div><p className="font-medium text-gray-900">{student.first_name} {student.last_name}</p><p className="text-sm text-gray-500">{student.enrollment_number}</p></div>
                  <span className="ml-auto badge badge-success">{student.status}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No active students found matching your search</p>
        )}
      </Modal>
    </div>
  );
};

export default RecordDropout;
