import React, { forwardRef } from 'react';

interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: boolean | string;
}

const FloatingLabelInput = forwardRef<HTMLInputElement, FloatingLabelInputProps>(
    ({ label, error, className = "", id, ...props }, ref) => {
        // Generar un ID si no se proporciona, necesario para el htmlFor del label
        const inputId = id || `floating-input-${label.replace(/\s+/g, '-').toLowerCase()}`;
        const isError = Boolean(error);

        return (
            <div className="relative">
                <input
                    ref={ref}
                    id={inputId}
                    {...props}
                    placeholder=" " // Crucial para la detección de :placeholder-shown
                    className={`
                        peer
                        block
                        w-full
                        rounded-lg
                        border
                        bg-primary
                        pl-2.5
                        pb-2.5
                        pt-5
                        pr-2.5
                        text-sm
                        text-primary
                        outline-none
                        transition-all
                        focus:ring-2
                        focus:ring-opacity-50
                        ${isError
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-themed focus:border-accent focus:ring-accent/20'
                        }
                        ${className}
                    `}
                />
                <label
                    htmlFor={inputId}
                    className={`
                        absolute
                        left-1
                        top-1
                        z-10
                        origin-left
                        translate-y-0
                        scale-75
                        cursor-text
                        px-2
                        text-sm
                        transition-all
                        duration-300
                        ease-in-out
                        peer-placeholder-shown:top-1/2
                        peer-placeholder-shown:-translate-y-1/2
                        peer-placeholder-shown:scale-100
                        peer-focus:top-1
                        peer-focus:translate-y-0
                        peer-focus:scale-75
                        ${isError
                            ? 'text-red-500 peer-focus:text-red-500'
                            : 'text-secondary peer-hover:text-accent peer-focus:text-accent'
                        }
                    `}
                >
                    {label}
                </label>

                {/* Mensaje de error debajo del input */}
                {typeof error === 'string' && error && (
                    <span className="absolute -bottom-4 left-2 text-[10px] font-medium text-red-500 animate-fade-in animate-duration-300">
                        {error}
                    </span>
                )}
            </div>
        );
    }
);

FloatingLabelInput.displayName = 'FloatingLabelInput';

export default FloatingLabelInput;
