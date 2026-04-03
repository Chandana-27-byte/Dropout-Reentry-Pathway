import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiDownload } from 'react-icons/fi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import DataTable from '../../components/common/DataTable';
import Input from '../../components/common/Input';
import studentService from '../../services/studentService';
import toast from 'react-hot-toast';

const StudentList = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({ search: '', status: '' });

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await studentService.getAll({ page: pagination.page, limit: pagination.limit, search: filters.search, status: filters.status });
      if (response.success) { setStudents(response.data.students); setPagination(response.data.pagination); }
    } catch (error) { toast.error('Failed to fetch students'); } finally { setLoading(false); }
  }, [pagination.page, pagination.limit, filters]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const columns = [
    { header: 'Enrollment No.', accessor: 'enrollment_number', render: (value) => <span className="font-medium text-primary-600">{value}</span> },
    { header: 'Name', accessor: 'first_name', render: (_, row) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
          <span className="text-primary-700 font-semibold text-sm">{row.first_name?.[0]}{row.last_name?.[0]}</span>
        </div>
        <div><p className="font-medium text-gray-900">{row.first_name} {row.last_name}</p><p className="text-xs text-gray-500">{row.email || 'No email'}</p></div>
      </div>
    ) },
    { header: 'Gender', accessor: 'gender', render: (value) => <span className="capitalize">{value}</span> },
    { header: 'District', accessor: 'district_name' },
    { header: 'Status', accessor: 'status', render: (value) => {
      const cls = { active: 'badge-success', dropout: 'badge-danger', reentry: 'badge-warning', completed: 'badge-info' };
      return <span className={`badge ${cls[value] || 'badge-gray'}`}>{value}</span>;
    }},
    { header: 'Created', accessor: 'created_at', render: (value) => new Date(value).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="page-title">Students</h1><p className="page-subtitle">Manage all students in the system</p></div>
        <Link to="/students/add"><Button icon={FiPlus}>Add Student</Button></Link>
      </div>
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input placeholder="Search by name or enrollment number..." icon={FiSearch} value={filters.search} onChange={(e) => { setFilters(p => ({ ...p, search: e.target.value })); setPagination(p => ({ ...p, page: 1 })); }} />
          </div>
          <div className="sm:w-48">
            <select className="input" value={filters.status} onChange={(e) => { setFilters(p => ({ ...p, status: e.target.value })); setPagination(p => ({ ...p, page: 1 })); }}>
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="dropout">Dropout</option>
              <option value="reentry">Re-entry</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <Button variant="secondary" icon={FiDownload}>Export</Button>
        </div>
      </Card>
      <Card padding={false}>
        <DataTable columns={columns} data={students} loading={loading} pagination={pagination}
          onPageChange={(page) => setPagination(p => ({ ...p, page }))}
          onRowClick={(row) => navigate(`/students/${row.student_id}`)}
          emptyMessage="No students found" />
      </Card>
    </div>
  );
};

export default StudentList;
