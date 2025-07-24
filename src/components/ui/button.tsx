import React from 'react';

type ButtonProps = {
    onClick: () => void;
    text: string;
    className?: string;
    disabled?: boolean;
    children?: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({
    onClick,
    text,
    className = '',
    disabled = false,
    children = null
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={className}
            disabled={disabled}
        >
            {children || text}
        </button>
    );
};

export default Button;