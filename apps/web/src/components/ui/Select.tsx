import React from 'react';
import { cn } from '../../lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, children, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-xl border-2',
            'bg-white text-gray-900',
            'focus:outline-none focus:ring-2 focus:ring-brand-orange-400 focus:border-transparent',
            'transition-all',
            'cursor-pointer',
            error
              ? 'border-red-300 focus:ring-red-400'
              : 'border-gray-200 hover:border-gray-300',
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
