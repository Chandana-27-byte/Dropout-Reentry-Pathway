import React from 'react';

const Loading = ({ fullScreen = false, text = 'Loading...' }) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative">
        <div className="w-10 h-10 rounded-full border-4 border-gray-200" />
        <div className="absolute inset-0 w-10 h-10 rounded-full border-4 border-transparent border-t-primary-600" style={{ animation: 'spin 0.8s linear infinite' }} />
      </div>
      <p className="text-sm text-gray-500 font-medium">{text}</p>
    </div>
  );

  if (fullScreen) return <div className="flex items-center justify-center min-h-[60vh]">{spinner}</div>;
  return spinner;
};

export default Loading;
