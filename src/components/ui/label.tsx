import { forwardRef, type LabelHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'mb-1.5 block font-body text-body-sm font-medium text-text-primary',
          className,
        )}
        {...props}
      />
    );
  },
);

Label.displayName = 'Label';

export { Label };
