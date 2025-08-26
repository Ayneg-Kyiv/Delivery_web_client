import React from 'react';

interface SeparatorProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const Separator: React.FC<SeparatorProps> = ({ 
  className = '', 
  orientation = 'horizontal' 
}) => {
  const baseClasses = orientation === 'horizontal' 
    ? 'border-t border-gray-300' 
    : 'border-l border-gray-300';
    
  return <div className={`${baseClasses} ${className}`} />;
};
