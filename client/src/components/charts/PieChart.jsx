import React, { useState } from 'react';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'];

const PieChart = ({ data = [], dataKey = 'value', nameKey = 'name', height = 300, innerRadius = 60, outerRadius = 100 }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  if (!data.length) return <div className="flex items-center justify-center text-gray-400" style={{ height }}>No data available</div>;

  const total = data.reduce((sum, item) => sum + (Number(item[dataKey]) || 0), 0);
  const cx = 150; const cy = 130;
  let currentAngle = -90;
  const slices = data.map((item, i) => {
    const value = Number(item[dataKey]) || 0;
    const percentage = total > 0 ? (value / total) * 100 : 0;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle; const endAngle = currentAngle + angle; currentAngle = endAngle;
    const startRad = (startAngle * Math.PI) / 180; const endRad = (endAngle * Math.PI) / 180;
    const r = activeIndex === i ? outerRadius + 6 : outerRadius; const ir = innerRadius;
    const x1 = cx + r * Math.cos(startRad); const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad); const y2 = cy + r * Math.sin(endRad);
    const ix1 = cx + ir * Math.cos(startRad); const iy1 = cy + ir * Math.sin(startRad);
    const ix2 = cx + ir * Math.cos(endRad); const iy2 = cy + ir * Math.sin(endRad);
    const largeArc = angle > 180 ? 1 : 0;
    const d = [`M ${x1} ${y1}`, `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`, `L ${ix2} ${iy2}`, `A ${ir} ${ir} 0 ${largeArc} 0 ${ix1} ${iy1}`, 'Z'].join(' ');
    return { d, color: COLORS[i % COLORS.length], name: item[nameKey], value, percentage: percentage.toFixed(1) };
  });

  return (
    <div style={{ height }} className="flex flex-col">
      <div className="flex items-center justify-center flex-1 min-h-0">
        <svg viewBox="0 0 300 260" className="w-full max-h-full" style={{ maxWidth: 300 }}>
          {slices.map((slice, i) => (<path key={i} d={slice.d} fill={slice.color} className="transition-all duration-200 cursor-pointer" style={{ opacity: activeIndex !== null && activeIndex !== i ? 0.5 : 1 }} onMouseEnter={() => setActiveIndex(i)} onMouseLeave={() => setActiveIndex(null)} />))}
          <text x={cx} y={cy - 8} textAnchor="middle" fill="#111827" fontSize="18" fontWeight="bold">{total.toLocaleString()}</text>
          <text x={cx} y={cy + 12} textAnchor="middle" fill="#9ca3af" fontSize="11">Total</text>
        </svg>
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-2 px-2">
        {slices.map((slice, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs cursor-pointer transition-opacity" style={{ opacity: activeIndex !== null && activeIndex !== i ? 0.4 : 1 }} onMouseEnter={() => setActiveIndex(i)} onMouseLeave={() => setActiveIndex(null)}>
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: slice.color }} />
            <span className="text-gray-600 truncate">{slice.name}</span>
            <span className="text-gray-400 font-medium">({slice.percentage}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChart;
