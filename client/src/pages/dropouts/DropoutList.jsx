import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiDownload, FiPieChart, FiCheckCircle } from 'react-icons/fi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import DataTable from '../../components/common/DataTable';
import Input from '../../components/common/Input';
import StatsCard from '../../components/charts/StatsCard';
import dropoutService from '../../services/dropoutService';
import toast from 'react-hot-toast';

const DropoutList = () => {
  const navigate = useNavigate();
  const [dropouts, setDropouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({ search: '', status: '', reason: '' });

  const fetchDropouts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await dropoutService.getAll({ page: pagination.page, limit: pagination.limit, status: filters.status, reason: filters.reason });
      if (response.success) { setDropouts(response.data.dropouts); setPagination(response.data.pagination); }
    } catch (error) { toast.error('Failed to fetch dropouts'); } finally { setLoading(false); }
  }, [pagination.page, pagination.limit, filters]);

  const fetchStats = async () => {
    try {
      const response = await dropoutService.getStats();
      if (response.success) setStats(response.data);
    } catch (error) { console.error('Failed to fetch stats'); }
  };

  useEffect(() => { fetchDropouts(); fetchStats(); }, [fetchDropouts]);

  const handleVerify = async (e, dropoutId) => {
    e.stopPropagation();
    try {
      const response = await dropoutService.verify(dropoutId);
      if (response.success) { toast.success('Dropout verified successfully'); fetchDropouts(); }
    } catch (error) { toast.error('Failed to verify dropout'); }
  };

  const columns = [
    { header: 'Student', accessor: 'student_name', render: (value, row) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
          <span className="text-red-700 font-semibold text-sm">{value?.split(' ').map(n => n[0]).join('')}</span>
        </div>
        <div><p className="font-medium text-gray-900">{value}</p><p className="text-xs text-gray-500">{row.enrollment_number}</p></div>
      </div>
    )},
    { header: 'Dropout Date', accessor: 'dropout_date', render: (value) => new Date(value).toLocaleDateString() },
    { header: 'Last Education', accessor: 'last_education_level', render: (value) => <span className="capitalize">{value?.replace('_', ' ')}</span> },
    { header: 'Status', accessor: 'dropout_status', render: (value) => {
      const cls = { recorded: 'badge-gray', verified: 'badge-info', counseling: 'badge-warning', enrolled: 'badge-success', reentry_completed: 'badge-success', closed: 'badge-danger' };
      return <span className={`badge ${cls[value] || 'badge-gray'}`}>{value?.replace('_', ' ')}</span>;
    }},
    { header: 'Willing to Return', accessor: 'willing_to_return', render: (value) => <span className={value ? 'text-green-600' : 'text-red-600'}>{value ? 'Yes' : 'No'}</span> },
    { header: 'Actions', accessor: 'dropout_id', render: (value, row) => (
      <div className="flex gap-2">
        {row.dropout_status === 'recorded' && (
          <button onClick={(e) => handleVerify(e, value)} className="text-green-600 hover:text-green-700" title="Verify">
            <FiCheckCircle className="w-5 h-5" />
          </button>
        )}
      </div>
    )},
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="page-title">Dropouts</h1><p className="page-subtitle">Manage dropout records and interventions</p></div>
        <div className="flex gap-2">
          <Link to="/dropouts/analysis"><Button variant="outline" icon={FiPieChart}>Analysis</Button></Link>
          <Link to="/dropouts/record"><Button icon={FiPlus}>Record Dropout</Button></Link>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard title="Total Dropouts" value={stats.overview?.total || 0} color="danger" />
          <StatsCard title="Enrolled in Pathway" value={stats.overview?.enrolled || 0} color="success" />
          <StatsCard title="Re-entry Completed" value={stats.overview?.completed || 0} color="info" />
          <StatsCard title="Willing to Return" value={stats.overview?.willing_to_return || 0} color="warning" />
        </div>
      )}

      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1"><Input placeholder="Search by student name..." icon={FiSearch} value={filters.search} onChange={(e) => setFilters(p => ({ ...p, search: e.target.value }))} /></div>
          <div className="sm:w-48">
            <select className="input" value={filters.status} onChange={(e) => setFilters(p => ({ ...p, status: e.target.value }))}>
              <option value="">All Status</option>
              <option value="recorded">Recorded</option><option value="verified">Verified</option>
              <option value="counseling">Counseling</option><option value="enrolled">Enrolled</option>
              <option value="reentry_completed">Completed</option>
            </select>
          </div>
          <Button variant="secondary" icon={FiDownload}>Export</Button>
        </div>
      </Card>

      <Card padding={false}>
        <DataTable columns={columns} data={dropouts} loading={loading} pagination={pagination}
          onPageChange={(page) => setPagination(p => ({ ...p, page }))}
          onRowClick={(row) => navigate(`/dropouts/${row.dropout_id}`)}
          emptyMessage="No dropout records found" />
      </Card>
    </div>
  );
};

export default DropoutList;
