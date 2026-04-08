import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiArrowLeft,
  FiEdit,
  FiTrash2,
  FiClock,
  FiUsers,
  FiStar,
  FiBook,
  FiDollarSign,
  FiAward,
  FiCheckCircle,
  FiPlus,
} from 'react-icons/fi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import Modal from '../../components/common/Modal';
import pathwayService from '../../services/pathwayService';
import toast from 'react-hot-toast';

const PathwayDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pathway, setPathway] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPathway();
  }, [id]);

  const fetchPathway = async () => {
    try {
      const response = await pathwayService.getById(id);
      if (response.success) {
        setPathway(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch pathway details');
      navigate('/pathways');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await pathwayService.delete(id);
      if (response.success) {
        toast.success('Pathway deactivated successfully');
        navigate('/pathways');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete pathway');
    } finally {
      setDeleting(false);
      setDeleteModal(false);
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!pathway) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Pathway not found</p>
        <Link to="/pathways" className="text-primary-600 hover:text-primary-700">
          Back to Pathways
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/pathways')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="page-title">{pathway.pathway_name}</h1>
            <span className={`badge ${pathway.is_active ? 'badge-success' : 'badge-danger'}`}>
              {pathway.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
          <p className="text-gray-500">{pathway.pathway_code}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/pathways/${id}/edit`}>
            <Button variant="secondary" icon={FiEdit}>Edit</Button>
          </Link>
          <Button variant="danger" icon={FiTrash2} onClick={() => setDeleteModal(true)}>
            Delete
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <FiClock className="w-8 h-8 text-primary-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{pathway.duration_months}</p>
          <p className="text-sm text-gray-500">Months</p>
        </Card>
        <Card className="text-center">
          <FiUsers className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {pathway.current_enrollment || 0} / {pathway.max_enrollment || 'N/A'}
          </p>
          <p className="text-sm text-gray-500">Enrolled</p>
        </Card>
        <Card className="text-center">
          <FiBook className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{pathway.total_modules || 0}</p>
          <p className="text-sm text-gray-500">Modules</p>
        </Card>
        <Card className="text-center">
          <FiAward className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {pathway.success_rate?.toFixed(0) || 0}%
          </p>
          <p className="text-sm text-gray-500">Success Rate</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <Card className="lg:col-span-2" title="Pathway Details">
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-gray-600">
                {pathway.description || 'No description provided'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium capitalize">{pathway.pathway_type?.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mode</p>
                <p className="font-medium capitalize">{pathway.mode?.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Target Level</p>
                <p className="font-medium capitalize">
                  {pathway.target_education_level?.replace('_', ' ') || 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Prerequisite</p>
                <p className="font-medium capitalize">
                  {pathway.prerequisite_level?.replace('_', ' ') || 'None'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Credits</p>
                <p className="font-medium">{pathway.total_credits || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Institution</p>
                <p className="font-medium">{pathway.institution_name || 'Not assigned'}</p>
              </div>
            </div>

            {pathway.eligibility_criteria && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Eligibility Criteria</h4>
                <p className="text-gray-600">{pathway.eligibility_criteria}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Fee Info */}
          <Card title="Fee Information">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Course Fee</span>
                <span className="text-2xl font-bold text-gray-900">
                  {pathway.fee_amount > 0 ? `₹${pathway.fee_amount.toLocaleString()}` : 'Free'}
                </span>
              </div>
              {pathway.scholarship_available && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-800">
                    Scholarship Available
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {pathway.scholarship_details || 'Contact for details'}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Enrollment Stats */}
          {pathway.enrollmentStats && (
            <Card title="Enrollment Statistics">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Enrolled</span>
                  <span className="font-medium">{pathway.enrollmentStats?.total_enrolled || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">In Progress</span>
                  <span className="font-medium text-yellow-600">
                    {pathway.enrollmentStats?.active_count || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-medium text-green-600">
                    {pathway.enrollmentStats?.completed_count || 0}
                  </span>
                </div>
              </div>
            </Card>
          )}

          {/* Rating */}
          {pathway.rating > 0 && (
            <Card title="Rating">
              <div className="flex items-center gap-2">
                <FiStar className="w-6 h-6 text-yellow-500 fill-current" />
                <span className="text-2xl font-bold">{pathway.rating.toFixed(1)}</span>
                <span className="text-gray-500">/ 5.0</span>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Modules */}
      <Card
        title="Modules"
        subtitle={`${pathway.modules?.length || 0} modules in this pathway`}
        action={
          <Button variant="outline" size="sm" icon={FiPlus}>
            Add Module
          </Button>
        }
      >
        {pathway.modules && pathway.modules.length > 0 ? (
          <div className="space-y-4">
            {pathway.modules.map((module, index) => (
              <div
                key={module.module_id}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-700 font-bold">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">{module.module_name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {module.duration_weeks} weeks
                        </span>
                        {module.credits && (
                          <span className="badge badge-info">{module.credits} credits</span>
                        )}
                        {module.is_mandatory ? (
                          <span className="badge badge-warning">Mandatory</span>
                        ) : (
                          <span className="badge badge-gray">Optional</span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{module.module_code}</p>
                    {module.description && (
                      <p className="text-sm text-gray-600 mt-2">{module.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <span>Assessment: {module.assessment_type?.replace('_', ' ')}</span>
                      <span>Pass: {module.passing_percentage}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FiBook className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No modules added yet</p>
            <Button variant="outline" size="sm" className="mt-3" icon={FiPlus}>
              Add First Module
            </Button>
          </div>
        )}
      </Card>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Deactivate Pathway"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting}>
              Deactivate
            </Button>
          </>
        }
      >
        <p className="text-gray-600">
          Are you sure you want to deactivate this pathway? Students currently enrolled will not be affected.
        </p>
      </Modal>
    </div>
  );
};

export default PathwayDetails;
