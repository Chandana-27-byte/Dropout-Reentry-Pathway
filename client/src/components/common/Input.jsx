import React from 'react';

const Input = ({ label, error, helper, icon: Icon, className = '', required, disabled, ...props }) => {
  return (
    <div className={className}>
      {label && (
        <label className="label">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-4 w-4 text-gray-400" />
          </div>
        )}
        <input className={`input ${Icon ? 'pl-10' : ''} ${error ? 'input-error' : ''}`} disabled={disabled} {...props} />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helper && !error && <p className="mt-1 text-sm text-gray-500">{helper}</p>}
    </div>
  );
};

export default Input;
