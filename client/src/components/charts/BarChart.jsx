import React from 'react';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

const BarChart = ({ data = [], xKey, bars = [], height = 300 }) => {
  if (!data.length || !bars.length) return <div className="flex items-center justify-center text-gray-400" style={{ height }}>No data available</div>;

  const maxValue = Math.max(...data.flatMap(item => bars.map(bar => Number(item[bar.dataKey]) || 0)));
  const yMax = Math.ceil(maxValue * 1.1) || 10;

  return (
    <div style={{ height }}>
      <div className="flex items-center gap-4 mb-4">
        {bars.map((bar, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: bar.color || COLORS[i] }} />{bar.name}
          </div>
        ))}
      </div>
      <div className="flex items-end gap-1 h-[calc(100%-60px)] px-2">
        {data.map((item, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-1 min-w-0">
            <div className="flex items-end gap-0.5 w-full justify-center" style={{ height: '100%' }}>
              {bars.map((bar, barIdx) => {
                const val = Number(item[bar.dataKey]) || 0;
                const pct = yMax > 0 ? (val / yMax) * 100 : 0;
                return (
                  <div key={barIdx} className="rounded-t-sm transition-all duration-500 hover:opacity-80 group relative"
                    style={{ height: `${pct}%`, minHeight: val > 0 ? '4px' : '0', backgroundColor: bar.color || COLORS[barIdx], flex: `0 0 ${Math.max(100 / bars.length - 4, 20)}%`, animation: `slideUp 0.5s ease-out ${idx * 0.05}s both` }}
                    title={`${bar.name}: ${val}`} />
                );
              })}
            </div>
            <span className="text-[10px] text-gray-500 truncate w-full text-center mt-1">{item[xKey]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;
