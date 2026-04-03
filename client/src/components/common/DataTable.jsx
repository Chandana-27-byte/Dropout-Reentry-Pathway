import React from 'react';
import { FiChevronLeft, FiChevronRight, FiInbox } from 'react-icons/fi';

const DataTable = ({ columns = [], data = [], loading = false, pagination, onPageChange, onRowClick, emptyMessage = 'No data found' }) => {
  if (loading) {
    return (
      <div className="overflow-x-auto">
        <table className="table">
          <thead><tr>{columns.map((col, i) => <th key={i}>{col.header}</th>)}</tr></thead>
          <tbody>
            {[...Array(5)].map((_, rowIdx) => (
              <tr key={rowIdx}>{columns.map((_, colIdx) => <td key={colIdx}><div className="skeleton h-5 w-full" style={{ maxWidth: `${60 + Math.random() * 40}%` }} /></td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <FiInbox className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table">
          <thead><tr>{columns.map((col, i) => <th key={i}>{col.header}</th>)}</tr></thead>
          <tbody>
            {data.map((row, rowIdx) => (
              <tr key={rowIdx} onClick={() => onRowClick?.(row)} className={onRowClick ? 'cursor-pointer' : ''}>
                {columns.map((col, colIdx) => (
                  <td key={colIdx}>{col.render ? col.render(row[col.accessor], row) : row[col.accessor] ?? '—'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results</p>
          <div className="flex items-center gap-1">
            <button onClick={() => onPageChange?.(pagination.page - 1)} disabled={pagination.page <= 1} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><FiChevronLeft className="w-4 h-4" /></button>
            {[...Array(Math.min(pagination.totalPages, 5))].map((_, i) => {
              const pageNum = i + 1;
              return <button key={pageNum} onClick={() => onPageChange?.(pageNum)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${pagination.page === pageNum ? 'bg-primary-600 text-white' : 'hover:bg-gray-100 text-gray-600'}`}>{pageNum}</button>;
            })}
            <button onClick={() => onPageChange?.(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><FiChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
