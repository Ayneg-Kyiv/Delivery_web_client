import React, { useEffect, useRef } from 'react';

type TextAreaGroupProps = {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    className?: string;
    required?: boolean;
    textareaClassName?: string;
    labelClassName?: string;
    placeholder?: string;
    minHeight?: string;
    error?: boolean;
    id?: string;
};

const TextAreaGroup: React.FC<TextAreaGroupProps> = ({
    label,
    value,
    onChange,
    className = '',
    textareaClassName = '',
    required = true,
    labelClassName = '',
    placeholder = '',
    minHeight = '150px',
    error = false,
    id,
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    // Auto-resize function
    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };
    
    // Adjust height on initial render and when value changes
    useEffect(() => {
        adjustHeight();
    }, [value]);

    // Generate unique ID if not provided
    const uniqueId = id || `textarea-${label.toLowerCase().replace(/\s+/g, '-')}`;
    
    return (
        <div className={`floating-input-group flex flex-col ${className}`}>
            <div className="relative w-full">
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => {
                        onChange(e);
                        adjustHeight();
                    }}
                    className={`floating-input w-full ${error ? 'floating-input-error' : ''} ${textareaClassName}`}
                    placeholder={placeholder}
                    id={uniqueId}
                    required={required}
                    style={{ height: 'auto', resize: 'none', paddingTop: '1.5rem', minHeight }}
                    onFocus={adjustHeight}
                />
                <label 
                    htmlFor={uniqueId} 
                    className={`floating-label ${value ? ' filled' : ''} ${error ? ' floating-label-error' : ''} ${labelClassName}`}
                >
                    {label}
                </label>
            </div>
        </div>
    );
};

export default TextAreaGroup;
