import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiPlus, FiSearch, FiClock, FiUsers, FiStar, FiBook } from 'react-icons/fi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import pathwayService from '../../services/pathwayService';
import dropoutService from '../../services/dropoutService';
import enrollmentService from '../../services/enrollmentService';
import toast from 'react-hot-toast';

const PathwayList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const recommendForId = searchParams.get('recommend');
  const [recommendStudent, setRecommendStudent] = useState(null);
  const [enrolling, setEnrolling] = useState(null);
  const [pathways, setPathways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', type: '', mode: '' });

  const fetchPathways = useCallback(async () => {
    try {
      const response = await pathwayService.getAll();
      if (response.success) setPathways(response.data.pathways);
    } catch (error) { toast.error('Failed to fetch pathways'); } finally { setLoading(false); }
  }, []);

  const fetchRecommendStudent = useCallback(async () => {
    if (!recommendForId) return;
    try {
      const response = await dropoutService.getById(recommendForId);
      if (response.success) setRecommendStudent(response.data);
    } catch (error) { console.error('Failed to fetch recommended student'); }
  }, [recommendForId]);

  useEffect(() => { fetchPathways(); fetchRecommendStudent(); }, [fetchPathways, fetchRecommendStudent]);

  const handleEnroll = async (pathwayId) => {
    if (!recommendForId) return;
    if (!window.confirm('Are you sure you want to enroll this student in this pathway?')) return;
    setEnrolling(pathwayId);
    try {
      const response = await enrollmentService.create({ dropoutId: recommendForId, pathwayId });
      if (response.success) { toast.success(`Enrollment successful for ${recommendStudent?.first_name || 'Student'}`); navigate(`/dropouts/${recommendForId}`); }
    } catch (error) { toast.error(error.response?.data?.message || 'Enrollment failed'); } finally { setEnrolling(null); }
  };

  const pathwayTypeColors = { academic: 'bg-blue-100 text-blue-800', vocational: 'bg-green-100 text-green-800', skill_based: 'bg-purple-100 text-purple-800', bridge_course: 'bg-yellow-100 text-yellow-800', certification: 'bg-orange-100 text-orange-800', diploma: 'bg-pink-100 text-pink-800' };
  const modeColors = { full_time: 'bg-gray-100 text-gray-800', part_time: 'bg-indigo-100 text-indigo-800', distance: 'bg-teal-100 text-teal-800', online: 'bg-cyan-100 text-cyan-800', hybrid: 'bg-amber-100 text-amber-800' };

  if (loading) return <Loading fullScreen />;

  const filteredPathways = Array.isArray(pathways) ? pathways.filter(p =>
    (!filters.search || p.pathway_name?.toLowerCase().includes(filters.search.toLowerCase())) &&
    (!filters.type || p.pathway_type === filters.type) &&
    (!filters.mode || p.mode === filters.mode)
  ) : [];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">{recommendStudent ? `Recommended Pathways for ${recommendStudent.first_name} ${recommendStudent.last_name}` : 'Re-entry Pathways'}</h1>
          <p className="page-subtitle">{recommendStudent ? 'Based on academic history and dropout reasoning' : 'Explore available educational and vocational programs'}</p>
        </div>
        <div className="flex items-center gap-3">
          {recommendStudent && <Button variant="outline" onClick={() => navigate(`/dropouts/${recommendForId}`)}>Cancel Selection</Button>}
          <Link to="/pathways/create"><Button icon={FiPlus}>Create Pathway</Button></Link>
        </div>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1"><Input placeholder="Search pathways..." icon={FiSearch} value={filters.search} onChange={(e) => setFilters(p => ({ ...p, search: e.target.value }))} /></div>
          <div className="sm:w-48">
            <select className="input" value={filters.type} onChange={(e) => setFilters(p => ({ ...p, type: e.target.value }))}>
              <option value="">All Types</option><option value="academic">Academic</option><option value="vocational">Vocational</option>
              <option value="skill_based">Skill Based</option><option value="bridge_course">Bridge Course</option>
              <option value="certification">Certification</option><option value="diploma">Diploma</option>
            </select>
          </div>
          <div className="sm:w-48">
            <select className="input" value={filters.mode} onChange={(e) => setFilters(p => ({ ...p, mode: e.target.value }))}>
              <option value="">All Modes</option><option value="full_time">Full Time</option><option value="part_time">Part Time</option>
              <option value="distance">Distance</option><option value="online">Online</option><option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>
      </Card>

      {filteredPathways.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPathways.map((pathway) => (
            <Card key={pathway.pathway_id} className="hover:shadow-lg transition-shadow" padding={false}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className={`badge ${pathwayTypeColors[pathway.pathway_type] || 'badge-gray'}`}>{pathway.pathway_type?.replace('_', ' ')}</span>
                    <h3 className="text-lg font-semibold text-gray-900 mt-2">{pathway.pathway_name}</h3>
                    <p className="text-sm text-gray-500">{pathway.pathway_code}</p>
                  </div>
                  {pathway.rating > 0 && (
                    <div className="flex items-center gap-1 text-yellow-500">
                      <FiStar className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{Number(pathway.rating || 0).toFixed(1)}</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pathway.description || 'No description available'}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500"><FiClock className="w-4 h-4" /><span>{pathway.duration_months} months</span><span className={`badge ${modeColors[pathway.mode] || 'badge-gray'} ml-auto`}>{pathway.mode?.replace('_', ' ')}</span></div>
                  <div className="flex items-center gap-2 text-sm text-gray-500"><FiBook className="w-4 h-4" /><span>{pathway.total_modules || 0} modules</span></div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div>
                    {pathway.fee_amount > 0 ? <p className="text-lg font-bold text-gray-900">₹{Number(pathway.fee_amount).toLocaleString()}</p> : <p className="text-lg font-bold text-green-600">Free</p>}
                    {pathway.scholarship_available && <p className="text-xs text-green-600">Scholarship Available</p>}
                  </div>
                  {recommendForId ? (
                    <Button size="sm" loading={enrolling === pathway.pathway_id} onClick={() => handleEnroll(pathway.pathway_id)}>Enroll</Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => navigate(`/pathways/${pathway.pathway_id}`)}>View Details</Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <FiBook className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Pathways Found</h3>
            <p className="text-gray-500 mb-4">{recommendForId ? 'No suitable pathways found for this dropout profile' : 'Get started by creating your first pathway'}</p>
            <Link to="/pathways/create"><Button icon={FiPlus}>Create Pathway</Button></Link>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PathwayList;
