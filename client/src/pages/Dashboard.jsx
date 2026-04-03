import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiUsers, FiUserX, FiBookOpen, FiAward, FiPlus, FiArrowRight, FiTrendingUp, FiActivity,
} from 'react-icons/fi';
import Card from '../components/common/Card';
import StatsCard from '../components/charts/StatsCard';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import reportService from '../services/reportService';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      const response = await reportService.getDashboardStats();
      if (response.success) setStats(response.data.statistics);
    } catch (error) {
      console.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading fullScreen />;

  const quickActions = [
    { label: 'Add Student', icon: FiUsers, to: '/students/add', color: 'bg-blue-500' },
    { label: 'Record Dropout', icon: FiUserX, to: '/dropouts/record', color: 'bg-red-500' },
    { label: 'Browse Pathways', icon: FiBookOpen, to: '/pathways', color: 'bg-green-500' },
    { label: 'View Reports', icon: FiActivity, to: '/reports', color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of the Dropout Re-entry Pathway System</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Students" value={stats?.total_students ?? 0} icon={FiUsers} color="primary" />
        <StatsCard title="Total Dropouts" value={stats?.total_dropouts ?? 0} icon={FiUserX} color="danger" />
        <StatsCard title="Active Enrollments" value={stats?.enrolled_in_pathway ?? 0} icon={FiBookOpen} color="warning" />
        <StatsCard title="Success Rate" value={`${stats?.success_rate ?? 0}%`} icon={FiAward} color="success" />
      </div>

      <Card title="Quick Actions" subtitle="Common tasks you can perform">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link key={action.to} to={action.to}>
              <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all group cursor-pointer">
                <div className={`p-2.5 rounded-xl ${action.color} text-white shadow-sm`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{action.label}</p>
                </div>
                <FiArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary-500 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="System Overview" subtitle="Key metrics at a glance">
          <div className="space-y-4">
            {[
              { label: 'Enrollment Rate', icon: FiTrendingUp, color: 'bg-primary-100', iconColor: 'text-primary-600', value: stats?.total_dropouts > 0 ? `${((stats?.enrolled_in_pathway || 0) / stats.total_dropouts * 100).toFixed(1)}%` : '0%' },
              { label: 'Completion Rate', icon: FiAward, color: 'bg-green-100', iconColor: 'text-green-600', value: `${stats?.success_rate ?? 0}%` },
              { label: 'Active Pathways', icon: FiActivity, color: 'bg-amber-100', iconColor: 'text-amber-600', value: stats?.active_pathways ?? '—' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${item.color} rounded-lg`}><item.icon className={`w-4 h-4 ${item.iconColor}`} /></div>
                  <span className="text-sm text-gray-600">{item.label}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Getting Started" subtitle="Complete these steps to set up your system">
          <div className="space-y-3">
            {[
              { text: 'Register students in the system', to: '/students/add', done: (stats?.total_students ?? 0) > 0 },
              { text: 'Set up re-entry pathways', to: '/pathways', done: false },
              { text: 'Record dropout cases', to: '/dropouts/record', done: (stats?.total_dropouts ?? 0) > 0 },
              { text: 'Enroll dropouts in pathways', to: '/pathways', done: false },
            ].map((step, i) => (
              <Link key={i} to={step.to}>
                <div className={`flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-gray-50 group ${step.done ? 'opacity-60' : ''}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${step.done ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    {step.done ? '✓' : i + 1}
                  </div>
                  <span className={`text-sm ${step.done ? 'line-through text-gray-400' : 'text-gray-700 group-hover:text-primary-600'}`}>{step.text}</span>
                  <FiArrowRight className="w-3 h-3 text-gray-300 ml-auto group-hover:text-primary-500 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
