import React, { useState } from 'react';

const LineChart = ({ data = [], xKey, lines = [], height = 300 }) => {
  const [tooltip, setTooltip] = useState(null);

  if (!data.length || !lines.length) return <div className="flex items-center justify-center text-gray-400" style={{ height }}>No data available</div>;

  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const svgWidth = 700;
  const svgHeight = height;
  const chartW = svgWidth - padding.left - padding.right;
  const chartH = svgHeight - padding.top - padding.bottom;

  const allValues = data.flatMap(item => lines.map(l => Number(item[l.dataKey]) || 0));
  const maxVal = Math.max(...allValues) || 10;
  const yMax = Math.ceil(maxVal * 1.15);

  const getX = (i) => padding.left + (i / (data.length - 1 || 1)) * chartW;
  const getY = (val) => padding.top + chartH - ((Number(val) || 0) / yMax) * chartH;
  const gridLines = 5;
  const gridYs = Array.from({ length: gridLines + 1 }, (_, i) => ({ y: padding.top + (i / gridLines) * chartH, label: Math.round(yMax - (i / gridLines) * yMax) }));

  return (
    <div style={{ height }}>
      <div className="flex items-center gap-4 mb-3">
        {lines.map((line, i) => (<div key={i} className="flex items-center gap-2 text-sm text-gray-600"><div className="w-4 h-0.5 rounded" style={{ backgroundColor: line.color }} />{line.name}</div>))}
      </div>
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full" style={{ height: height - 30 }}>
        {gridYs.map((g, i) => (
          <g key={i}>
            <line x1={padding.left} y1={g.y} x2={svgWidth - padding.right} y2={g.y} stroke="#f1f5f9" strokeWidth="1" />
            <text x={padding.left - 8} y={g.y + 4} textAnchor="end" fill="#94a3b8" fontSize="10">{g.label}</text>
          </g>
        ))}
        {data.map((item, i) => { const showEvery = Math.ceil(data.length / 8); if (i % showEvery !== 0 && i !== data.length - 1) return null; return <text key={i} x={getX(i)} y={svgHeight - 8} textAnchor="middle" fill="#94a3b8" fontSize="10">{item[xKey]}</text>; })}
        {lines.map((line, lineIdx) => {
          const points = data.map((item, i) => `${getX(i)},${getY(item[line.dataKey])}`);
          const pathD = points.reduce((acc, pt, i) => (i === 0 ? `M ${pt}` : `${acc} L ${pt}`), '');
          const areaD = `${pathD} L ${getX(data.length - 1)},${padding.top + chartH} L ${getX(0)},${padding.top + chartH} Z`;
          return (
            <g key={lineIdx}>
              <defs><linearGradient id={`gradient-${lineIdx}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={line.color} stopOpacity="0.15" /><stop offset="100%" stopColor={line.color} stopOpacity="0" /></linearGradient></defs>
              <path d={areaD} fill={`url(#gradient-${lineIdx})`} />
              <path d={pathD} fill="none" stroke={line.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {data.map((item, i) => (<circle key={i} cx={getX(i)} cy={getY(item[line.dataKey])} r={tooltip?.idx === i ? 5 : 3} fill="white" stroke={line.color} strokeWidth="2" className="transition-all duration-150 cursor-pointer" onMouseEnter={() => setTooltip({ idx: i, x: getX(i), y: getY(item[line.dataKey]) })} onMouseLeave={() => setTooltip(null)} />))}
            </g>
          );
        })}
        {tooltip && (
          <g>
            <line x1={tooltip.x} y1={padding.top} x2={tooltip.x} y2={padding.top + chartH} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4" />
            <rect x={tooltip.x - 45} y={tooltip.y - 34} width="90" height="26" rx="6" fill="#1e293b" />
            <text x={tooltip.x} y={tooltip.y - 17} textAnchor="middle" fill="white" fontSize="11" fontWeight="600">{data[tooltip.idx]?.[xKey]}: {lines.map(l => data[tooltip.idx]?.[l.dataKey]).join(', ')}</text>
          </g>
        )}
      </svg>
    </div>
  );
};

export default LineChart;
