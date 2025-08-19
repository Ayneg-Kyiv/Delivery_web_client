import React from 'react';

type DateInputGroupProps = {
    label: string;
    value: string; // ISO date string format YYYY-MM-DD
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    inputClassName?: string;
    labelClassName?: string;
    placeholder?: string;
    min?: string; // Optional min date (YYYY-MM-DD)
    max?: string; // Optional max date (YYYY-MM-DD)
};

const DateInputGroup: React.FC<DateInputGroupProps> = ({
    label,
    value,
    onChange,
    className = '',
    inputClassName = '',
    labelClassName = '',
    placeholder = '',
    min,
    max,
}) => {
    return (
        <div className={`floating-input-group flex flex-col ${className}`}>
            <input
                type="date"
                value={value}
                onChange={onChange}
                className={`floating-input ${inputClassName}`}
                required
                id={label}
                placeholder={placeholder}
                min={min}
                max={max}
            />
            <label htmlFor={label} className={`floating-label ${labelClassName}${value ? ' filled' : ''}`}>
                {label}
            </label>
        </div>
    );
};

export default DateInputGroup;