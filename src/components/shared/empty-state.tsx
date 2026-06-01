import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateAction {
  label: string;
  href: string;
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: EmptyStateAction;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-6 py-16 text-center',
        className,
      )}
    >
      <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-surface-muted">
        <Icon className="size-8 text-text-muted" strokeWidth={1.5} />
      </div>

      <h3 className="font-display text-heading-sm text-text-primary">
        {title}
      </h3>

      <p className="mt-2 max-w-sm text-body-md text-text-secondary">
        {description}
      </p>

      {action && (
        <Link
          href={action.href}
          className={cn(
            'mt-6 inline-flex items-center justify-center rounded-lg px-6 py-2.5',
            'bg-brand-primary text-text-inverse font-medium text-body-sm',
            'transition-colors hover:bg-brand-primary-hover',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus',
          )}
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
