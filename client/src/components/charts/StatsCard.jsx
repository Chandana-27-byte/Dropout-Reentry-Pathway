import React from 'react';

const colorMap = {
  primary: { bg: 'bg-primary-50', text: 'text-primary-600', icon: 'text-primary-500' },
  success: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: 'text-emerald-500' },
  danger: { bg: 'bg-red-50', text: 'text-red-600', icon: 'text-red-500' },
  warning: { bg: 'bg-amber-50', text: 'text-amber-600', icon: 'text-amber-500' },
  info: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'text-blue-500' },
};

const StatsCard = ({ title, value, icon: Icon, color = 'primary', change, changeType }) => {
  const colors = colorMap[color] || colorMap.primary;
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${colors.text}`}>{typeof value === 'number' ? value.toLocaleString() : value}</p>
          {change !== undefined && (
            <p className={`text-xs mt-1 font-medium ${changeType === 'increase' ? 'text-emerald-600' : 'text-red-600'}`}>
              {changeType === 'increase' ? '↑' : '↓'} {change}% from last month
            </p>
          )}
        </div>
        {Icon && <div className={`p-3 rounded-xl ${colors.bg}`}><Icon className={`w-6 h-6 ${colors.icon}`} /></div>}
      </div>
    </div>
  );
};

export default StatsCard;
