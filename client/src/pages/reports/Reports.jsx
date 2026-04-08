import React, { useState, useEffect } from 'react';
import {
  FiDownload,
  FiCalendar,
  FiTrendingUp,
  FiTrendingDown,
  FiUsers,
  FiUserX,
  FiBookOpen,
  FiAward,
} from 'react-icons/fi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import StatsCard from '../../components/charts/StatsCard';
import BarChart from '../../components/charts/BarChart';
import LineChart from '../../components/charts/LineChart';
import PieChart from '../../components/charts/PieChart';
import reportService from '../../services/reportService';
import toast from 'react-hot-toast';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [dropoutReport, setDropoutReport] = useState([]);
  const [reasonsReport, setReasonsReport] = useState([]);
  const [enrollmentReport, setEnrollmentReport] = useState([]);
  const [successReport, setSuccessReport] = useState(null);
  const [districtReport, setDistrictReport] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState({ dropouts: [], enrollments: [] });

  useEffect(() => {
    fetchAllReports();
  }, []);

  const fetchAllReports = async () => {
    setLoading(true);
    try {
      const [statsRes, reasonRes, dropoutRes, enrollmentRes, successRes, districtRes, trendRes] = 
        await Promise.all([
          reportService.getDashboardStats(),
          reportService.getDropoutReport({ groupBy: 'reason' }),
          reportService.getDropoutReport(),
          reportService.getEnrollmentReport(),
          reportService.getSuccessRateReport(),
          reportService.getDistrictWiseReport(),
          reportService.getMonthlyTrendReport({ months: 12 }),
        ]);

      if (statsRes.success) setStats(statsRes.data.statistics);
      if (reasonRes.success) setReasonsReport(reasonRes.data);
      if (dropoutRes.success) setDropoutReport(dropoutRes.data);
      if (enrollmentRes.success) setEnrollmentReport(enrollmentRes.data);
      if (successRes.success) setSuccessReport(successRes.data);
      if (districtRes.success) setDistrictReport(districtRes.data);
      if (trendRes.success) setMonthlyTrend(trendRes.data);
    } catch (error) {
      console.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type) => {
    try {
      const response = await reportService.exportReport(type, { format: 'csv' });
      // Handle download
      toast.success(`${type} report exported successfully`);
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  // Prepare chart data
  const trendData = monthlyTrend.dropouts?.map((d, i) => {
    const enrollmentMatch = monthlyTrend.enrollments?.find(e => e.month === d.month);
    return {
      month: d.month,
      dropouts: d.dropouts || 0,
      enrollments: enrollmentMatch?.enrollments || 0,
      completions: enrollmentMatch?.completions || 0,
    };
  }) || [];

  const reasonPieData = reasonsReport.slice(0, 6).map((item) => ({
    name: item.reason_name,
    value: item.count,
  }));

  const pathwayBarData = (successReport?.byPathwayType || []).slice(0, 8).map((item) => ({
    name: item.pathway_name?.substring(0, 15) + (item.pathway_name?.length > 15 ? '...' : ''),
    enrolled: item.total || 0,
    completed: item.completed || 0,
  }));

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'dropouts', label: 'Dropouts' },
    { id: 'enrollments', label: 'Enrollments' },
    { id: 'success', label: 'Success Rate' },
    { id: 'district', label: 'District Wise' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">Comprehensive insights and data analysis</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon={FiDownload} onClick={() => handleExport('dropouts')}>
            Export Dropouts
          </Button>
          <Button variant="secondary" icon={FiDownload} onClick={() => handleExport('enrollments')}>
            Export Enrollments
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Students"
              value={stats?.total_students || 0}
              icon={FiUsers}
              color="primary"
            />
            <StatsCard
              title="Total Dropouts"
              value={stats?.total_dropouts || 0}
              icon={FiUserX}
              color="danger"
            />
            <StatsCard
              title="Currently Enrolled"
              value={stats?.enrolled_in_pathway || 0}
              icon={FiBookOpen}
              color="warning"
            />
            <StatsCard
              title="Successful Re-entries"
              value={stats?.completed_pathways || 0}
              icon={FiAward}
              color="success"
            />
          </div>

          {/* Trend Chart */}
          <Card title="12-Month Trend" subtitle="Dropouts, Enrollments, and Completions">
            <LineChart
              data={trendData}
              xKey="month"
              lines={[
                { dataKey: 'dropouts', name: 'Dropouts', color: '#ef4444' },
                { dataKey: 'enrollments', name: 'Enrollments', color: '#3b82f6' },
                { dataKey: 'completions', name: 'Completions', color: '#22c55e' },
              ]}
              height={350}
            />
          </Card>

          {/* Two Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Dropout Reasons Distribution">
              <PieChart
                data={reasonPieData}
                dataKey="value"
                nameKey="name"
                height={300}
                innerRadius={50}
                outerRadius={90}
              />
            </Card>
            <Card title="Enrollment by Pathway">
              <BarChart
                data={pathwayBarData}
                xKey="name"
                bars={[
                  { dataKey: 'enrolled', name: 'Enrolled', color: '#3b82f6' },
                  { dataKey: 'completed', name: 'Completed', color: '#22c55e' },
                ]}
                height={300}
              />
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'dropouts' && (
        <Card title="Dropout Details Report">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Reason</th>
                  <th>District</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dropoutReport.map((item, index) => (
                  <tr key={index}>
                    <td className="font-medium">{item.student_name}</td>
                    <td className="text-sm font-mono">{item.enrollment_number}</td>
                    <td>{new Date(item.dropout_date).toLocaleDateString()}</td>
                    <td>{item.primary_reason}</td>
                    <td>{item.district_name}</td>
                    <td>
                      <span className={`badge ${
                        item.dropout_status === 'verified' ? 'badge-success' : 'badge-warning'
                      }`}>
                        {item.dropout_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'enrollments' && (
        <Card title="Re-entry Enrollment Report">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Pathway</th>
                  <th>Date</th>
                  <th>Progress</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enrollmentReport.map((item, index) => (
                  <tr key={index}>
                    <td className="font-medium">{item.student_name}</td>
                    <td>{item.pathway_name}</td>
                    <td>{new Date(item.enrollment_date).toLocaleDateString()}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${item.completion_percentage || 0}%` }}
                          />
                        </div>
                        <span>{item.completion_percentage || 0}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        item.enrollment_status === 'completed' ? 'badge-success' : 'badge-primary'
                      }`}>
                        {item.enrollment_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'success' && successReport && (
        <div className="space-y-6">
          {/* Success Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="text-center p-6">
              <h3 className="text-4xl font-bold text-primary-600">
                {successReport.overall?.enrollment_rate?.toFixed(1) || 0}%
              </h3>
              <p className="text-gray-500 mt-2">Enrollment Rate</p>
              <p className="text-sm text-gray-400">Dropouts enrolled in pathways</p>
            </Card>
            <Card className="text-center p-6">
              <h3 className="text-4xl font-bold text-green-600">
                {successReport.overall?.completion_rate?.toFixed(1) || 0}%
              </h3>
              <p className="text-gray-500 mt-2">Completion Rate</p>
              <p className="text-sm text-gray-400">Enrolled students who completed</p>
            </Card>
            <Card className="text-center p-6">
              <h3 className="text-4xl font-bold text-purple-600">
                {successReport.overall?.completed || 0}
              </h3>
              <p className="text-gray-500 mt-2">Total Completions</p>
              <p className="text-sm text-gray-400">Successful re-entries</p>
            </Card>
          </div>

          {/* By Pathway Type */}
          <Card title="Success Rate by Pathway Type">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Pathway Type</th>
                    <th>Total Enrolled</th>
                    <th>Completed</th>
                    <th>Success Rate</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {successReport.byPathwayType?.map((item, index) => (
                    <tr key={index}>
                      <td className="font-medium capitalize">
                        {item.pathway_type?.replace('_', ' ')}
                      </td>
                      <td>{item.total}</td>
                      <td>{item.completed}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${item.success_rate || 0}%` }}
                            />
                          </div>
                          <span className="font-medium">
                            {item.success_rate?.toFixed(1) || 0}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'district' && (
        <Card title="District-wise Summary">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>District</th>
                  <th>State</th>
                  <th>Total Dropouts</th>
                  <th>Enrolled</th>
                  <th>Completed</th>
                  <th>Re-entry Rate</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {districtReport.map((item, index) => (
                  <tr key={index}>
                    <td className="font-medium">{item.district_name}</td>
                    <td>{item.state_name}</td>
                    <td>{item.total_dropouts}</td>
                    <td>{item.enrolled_count}</td>
                    <td>{item.completed_count}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${item.reentry_rate || 0}%` }}
                          />
                        </div>
                        <span>{item.reentry_rate?.toFixed(1) || 0}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Reports;
