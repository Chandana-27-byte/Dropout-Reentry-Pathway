import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiDownload, FiCalendar } from 'react-icons/fi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';
import LineChart from '../../components/charts/LineChart';
import dropoutService from '../../services/dropoutService';

const DropoutAnalysis = () => {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => { fetchAnalysis(); }, [dateRange]);

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const response = await dropoutService.getAnalysis(dateRange);
      if (response.success) setAnalysis(response.data);
    } catch (error) { console.error('Failed to fetch analysis'); } finally { setLoading(false); }
  };

  if (loading) return <Loading fullScreen />;

  const reasonData = analysis?.byReason?.map(item => ({ name: item.reason_name, value: item.count, percentage: item.percentage })) || [];
  const genderData = analysis?.byGender?.map(item => ({ name: item.gender?.charAt(0).toUpperCase() + item.gender?.slice(1), value: item.count })) || [];
  const educationData = analysis?.byEducationLevel?.map(item => ({ level: item.last_education_level?.replace('_', ' '), count: item.count })) || [];
  const monthlyData = analysis?.monthlyTrend?.map(item => ({ month: item.month, dropouts: item.count })) || [];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/dropouts" className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><FiArrowLeft className="w-5 h-5" /></Link>
          <div><h1 className="page-title">Dropout Analysis</h1><p className="page-subtitle">Insights and trends on dropout patterns</p></div>
        </div>
        <Button variant="secondary" icon={FiDownload}>Export Report</Button>
      </div>

      <Card>
        <div className="flex flex-wrap gap-4 items-end">
          <div><label className="label">Start Date</label><input type="date" value={dateRange.startDate} onChange={(e) => setDateRange(p => ({ ...p, startDate: e.target.value }))} className="input" /></div>
          <div><label className="label">End Date</label><input type="date" value={dateRange.endDate} onChange={(e) => setDateRange(p => ({ ...p, endDate: e.target.value }))} className="input" /></div>
          <Button icon={FiCalendar} onClick={fetchAnalysis}>Apply Filter</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Monthly Dropout Trend" className="lg:col-span-2">
          <LineChart data={monthlyData} xKey="month" lines={[{ dataKey: 'dropouts', name: 'Dropouts', color: '#ef4444' }]} height={300} />
        </Card>
        <Card title="Dropouts by Reason">
          {reasonData.length > 0 ? <PieChart data={reasonData} dataKey="value" nameKey="name" height={350} innerRadius={60} outerRadius={100} /> : <p className="text-center text-gray-500 py-12">No data available</p>}
        </Card>
        <Card title="Dropouts by Gender">
          {genderData.length > 0 ? <PieChart data={genderData} dataKey="value" nameKey="name" height={350} innerRadius={60} outerRadius={100} /> : <p className="text-center text-gray-500 py-12">No data available</p>}
        </Card>
        <Card title="Dropouts by Education Level" className="lg:col-span-2">
          <BarChart data={educationData} xKey="level" bars={[{ dataKey: 'count', name: 'Dropouts', color: '#f59e0b' }]} height={300} />
        </Card>
      </div>
    </div>
  );
};

export default DropoutAnalysis;
