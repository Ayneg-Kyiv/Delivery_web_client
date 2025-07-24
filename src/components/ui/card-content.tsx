import React from 'react';

interface CardContentProps {
    source ?: string;
    className?: string;
}

const CardContent: React.FC<CardContentProps> = ({ source, className = '' }) => {
    return (
        <img src={source} className={`${className}`} alt="" />
    );
};

export default CardContent;