import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-full font-medium transition-all',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          
          // Variants
          variant === 'primary' && [
            'bg-gradient-to-r from-brand-orange-400 to-brand-pink-400',
            'text-white shadow-lg',
            'hover:shadow-xl hover:scale-105',
          ],
          variant === 'secondary' && [
            'bg-white border-2 border-brand-orange-200',
            'text-gray-700',
            'hover:border-brand-orange-300 hover:shadow-md',
          ],
          variant === 'outline' && [
            'bg-transparent border-2 border-white',
            'text-white',
            'hover:bg-white/10',
          ],
          
          // Sizes
          size === 'sm' && 'px-4 py-2 text-sm',
          size === 'md' && 'px-6 py-3 text-base',
          size === 'lg' && 'px-8 py-4 text-lg',
          
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export default Button;
