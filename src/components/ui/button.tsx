import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    onClick?: () => void;
    text?: string;
    className?: string;
    disabled?: boolean;
    children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    onClick,
    text,
    className = '',
    disabled = false,
    children,
    ...props
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`px-4 py-2 rounded ${className}`}
            disabled={disabled}
            {...props}
        >
            {children || text}
        </button>
    );
};

export default Button;