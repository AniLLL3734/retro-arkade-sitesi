
import React from 'react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'border-arkade-blue' }) => {
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-12 w-12',
        lg: 'h-24 w-24'
    };
    return (
        <div className="flex justify-center items-center">
            <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-t-transparent ${color}`}></div>
        </div>
    );
};

export default Spinner;
