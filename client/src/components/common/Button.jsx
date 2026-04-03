import React from 'react';

const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm shadow-primary-200',
  secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-200',
  outline: 'bg-transparent text-primary-600 border border-primary-200 hover:bg-primary-50',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
};

const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2.5 text-sm', lg: 'px-6 py-3 text-base' };

const Button = ({ children, variant = 'primary', size = 'md', icon: Icon, loading = false, disabled = false, className = '', type = 'button', ...props }) => {
  return (
    <button type={type} disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}>
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : Icon ? <Icon className="w-4 h-4" /> : null}
      {children}
    </button>
  );
};

export default Button;
