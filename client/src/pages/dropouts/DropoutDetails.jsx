import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiInfo, FiBook, FiClock, FiCheckCircle } from 'react-icons/fi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import dropoutService from '../../services/dropoutService';
import toast from 'react-hot-toast';

const DropoutDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dropout, setDropout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDropout(); }, [id]);

  const fetchDropout = async () => {
    try {
      const response = await dropoutService.getById(id);
      if (response.success) setDropout(response.data);
    } catch (error) { toast.error('Failed to fetch dropout details'); navigate('/dropouts'); } finally { setLoading(false); }
  };

  if (loading) return <Loading fullScreen />;
  if (!dropout) return <div className="p-8 text-center">Dropout record not found.</div>;

  const statusColors = { recorded: 'badge-gray', verified: 'badge-info', counseling: 'badge-warning', pathway_assigned: 'badge-success', enrolled: 'badge-success', reentry_completed: 'badge-success', closed: 'badge-danger' };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/dropouts')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><FiArrowLeft className="w-5 h-5" /></button>
        <div className="flex-1"><h1 className="page-title">Dropout Details</h1><p className="page-subtitle">Intervention and Re-entry Management</p></div>
        {dropout.status !== 'enrolled' && dropout.status !== 'reentry_completed' && (
          <Link to={`/pathways?recommend=${id}`}><Button icon={FiBook}>Assign Pathway</Button></Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <div className="text-center p-4">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-700 font-bold text-3xl">{dropout.first_name?.[0]}{dropout.last_name?.[0]}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{dropout.first_name} {dropout.last_name}</h2>
            <p className="text-gray-500">{dropout.enrollment_number}</p>
            <span className={`badge ${statusColors[dropout.status]} mt-3 capitalize`}>{dropout.status?.replace('_', ' ')}</span>
          </div>
          <div className="mt-6 space-y-4 border-t pt-6">
            <div className="flex items-center gap-3 text-gray-600"><FiUser className="w-5 h-5" /><span>{dropout.gender === 'male' ? 'Male' : 'Female'}</span></div>
            <div className="flex items-center gap-3 text-gray-600"><FiClock className="w-5 h-5" /><span>Dropout Date: {new Date(dropout.dropout_date).toLocaleDateString()}</span></div>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card title="Reasoning & Background" icon={FiInfo}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><p className="text-sm text-gray-500 font-medium">Primary Reason</p><p className="text-gray-900 mt-1 capitalize">{dropout.primary_reason?.replace('_', ' ') || 'Not specified'}</p></div>
              <div><p className="text-sm text-gray-500 font-medium">Last Grade Attended</p><p className="text-gray-900 mt-1">{dropout.last_class_attended || 'N/A'}</p></div>
              <div className="md:col-span-2"><p className="text-sm text-gray-500 font-medium">Detailed Reason</p><p className="text-gray-600 mt-1">{dropout.detailed_reason || 'No detailed reason provided.'}</p></div>
              <div><p className="text-sm text-gray-500 font-medium capitalize">Financial Status</p><p className="text-gray-900 mt-1">{dropout.financial_status?.replace('_', ' ')}</p></div>
              <div><p className="text-sm text-gray-500 font-medium">Willing to Return</p><p className={`mt-1 font-semibold ${dropout.willing_to_return ? 'text-green-600' : 'text-red-600'}`}>{dropout.willing_to_return ? 'Yes' : 'No'}</p></div>
            </div>
          </Card>
          <Card title="Support & Intervention Status" icon={FiCheckCircle}>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-2">Intervention Notes</h4>
                <p className="text-sm text-gray-600">{dropout.special_needs ? `Special Needs: ${dropout.special_needs}` : 'No specific intervention notes listed.'}</p>
              </div>
              {dropout.status === 'recorded' && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700 font-medium">Verification Pending</p>
                  <p className="text-xs text-blue-600 mt-1">This record has been recorded and is currently awaiting verification.</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DropoutDetails;
