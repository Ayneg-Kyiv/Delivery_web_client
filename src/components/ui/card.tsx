import React from 'react';

interface CardProps {
    className?: string;
    children: React.ReactNode;
}

interface CardContentProps {
    className?: string;
    children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
}) => {
    return (
        <div className={`border rounded-lg shadow-sm ${className}`}>
            {children}
        </div>
    );
};

export const CardContent: React.FC<CardContentProps> = ({ 
    className = '', 
    children 
}) => {
    return (
        <div className={`p-6 ${className}`}>
            {children}
        </div>
    );
};

export default Card;