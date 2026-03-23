import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'orange' | 'pink' | 'purple' | 'gray';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'orange', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
          'border-2 backdrop-blur-sm',
          
          // Variants
          variant === 'orange' && [
            'bg-brand-orange-50 border-brand-orange-200',
            'text-brand-orange-700',
          ],
          variant === 'pink' && [
            'bg-brand-pink-50 border-brand-pink-200',
            'text-brand-pink-600',
          ],
          variant === 'purple' && [
            'bg-brand-purple-50 border-brand-purple-200',
            'text-brand-purple-600',
          ],
          variant === 'gray' && [
            'bg-gray-100 border-gray-200',
            'text-gray-700',
          ],
          
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
