import React from 'react';
import Image from 'next/image';

interface CardContentProps {
    source: string;
    className?: string;
    width?: number;
    height?: number;
}

const CardContent: React.FC<CardContentProps> = ({ source, className = '', width = 500, height = 500 }) => {
    return (
        <Image src={source} className={`${className}`} alt="" width={width} height={height} />
    );
};

export default CardContent;