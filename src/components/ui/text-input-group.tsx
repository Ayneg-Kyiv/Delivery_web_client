import React from 'react';

type TextInputGroupProps = {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    inputClassName?: string;
    labelClassName?: string;
    type?: string;
    placeholder?: string;
};

const TextInputGroup: React.FC<TextInputGroupProps> = ({
    label,
    value,
    onChange,
    className = '',
    inputClassName = '',
    labelClassName = '',
    type = 'text',
    placeholder = '',
}) => {
    return (
        <div className={`floating-input-group flex flex-col ${className}`}>
            <input
            type={type}
            value={value}
            onChange={onChange}
            className={`floating-input ${inputClassName}`}
            required
            id={label}
            autoComplete={type}
            placeholder={placeholder}
            />
            <label htmlFor={label} className={`floating-label ${labelClassName}${value ? ' filled' : ''}`}>
                {label}
            </label>
        </div>
    );
};

export default TextInputGroup;