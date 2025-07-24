import React from 'react';

type CardProps = {
    className?: string;
    children: React.ReactNode;
};

const Card: React.FC<CardProps> = ({
    children,
    className = '',
}) => {
    return (
        <div className={className}>
            {children }
        </div>
    );
};

export default Card;