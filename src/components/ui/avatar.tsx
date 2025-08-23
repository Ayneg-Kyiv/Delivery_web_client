import React from 'react';

interface AvatarProps {
  className?: string;
  children?: React.ReactNode;
}

interface AvatarFallbackProps {
  className?: string;
  children?: React.ReactNode;
}

export const Avatar: React.FC<AvatarProps> = ({ className = '', children }) => {
  return (
    <div className={`relative overflow-hidden rounded-full ${className}`}>
      {children}
    </div>
  );
};

export const AvatarFallback: React.FC<AvatarFallbackProps> = ({ className = '', children }) => {
  return (
    <div className={`flex items-center justify-center w-full h-full ${className}`}>
      {children}
    </div>
  );
};
