import React from 'react';
import { cn } from '@/lib/utils';

const StatusBadge = ({ 
  status, 
  label, 
  className,
  size = 'md'
}) => {
  const statusStyles = {
    success: 'bg-green-50 text-green-700 border border-green-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    error: 'bg-red-50 text-red-700 border border-red-200',
    info: 'bg-blue-50 text-blue-700 border border-blue-200',
    pending: 'bg-gray-50 text-gray-700 border border-gray-200',
    premium: 'bg-purple-50 text-purple-700 border border-purple-200',
    frozen: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    locked: 'bg-orange-50 text-orange-700 border border-orange-200',
  };

  const dotColors = {
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    pending: 'bg-gray-500',
    premium: 'bg-purple-500',
    frozen: 'bg-indigo-500',
    locked: 'bg-orange-500',
  };

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        statusStyles[status],
        sizeClasses[size],
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5', dotColors[status])} />
      {label}
    </span>
  );
};

export default StatusBadge; 