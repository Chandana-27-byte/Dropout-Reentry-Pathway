import React from 'react';

const Card = ({ children, title, subtitle, action, className = '', padding = true, onClick, ...props }) => {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm ${onClick ? 'cursor-pointer' : ''} ${className}`} onClick={onClick} {...props}>
      {(title || subtitle || action) && (
        <div className={`flex items-start justify-between ${padding ? 'px-6 pt-6 pb-4' : 'px-6 pt-6 pb-4'}`}>
          <div>
            {title && <h3 className="text-base font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={padding ? (title ? 'px-6 pb-6' : 'p-6') : ''}>{children}</div>
    </div>
  );
};

export default Card;
