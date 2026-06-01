import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'accent' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles: Record<string, string> = {
  default:
    'bg-brand-primary text-text-inverse hover:bg-brand-primary-hover focus:ring-border-focus',
  accent:
    'bg-brand-accent text-brand-dark hover:bg-brand-accent-hover hover:shadow-gold focus:ring-border-accent',
  outline:
    'border border-border bg-transparent text-text-primary hover:bg-surface-muted focus:ring-border-focus',
  ghost:
    'bg-transparent text-text-secondary hover:bg-surface-muted hover:text-text-primary focus:ring-border-focus',
  danger:
    'bg-status-danger text-text-inverse hover:bg-status-danger/90 focus:ring-status-danger',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-1.5 text-body-sm',
  md: 'px-5 py-2.5 text-body-md',
  lg: 'px-6 py-3 text-body-lg',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-body font-semibold',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-60',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';

export { Button };
