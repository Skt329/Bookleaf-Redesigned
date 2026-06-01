import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs: Breadcrumb[];
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  className,
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        'bg-brand-cream border-b border-border py-10 md:py-14',
        className,
      )}
    >
      <div className="container-bookleaf">
        {/* Breadcrumb navigation */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex flex-wrap items-center gap-1.5 text-body-sm font-body">
            {breadcrumbs.map((crumb, i) => {
              const isLast = i === breadcrumbs.length - 1;

              return (
                <li key={crumb.label} className="flex items-center gap-1.5">
                  {i > 0 && (
                    <ChevronRight
                      className="size-3.5 shrink-0 text-text-muted"
                      aria-hidden="true"
                    />
                  )}

                  {isLast || !crumb.href ? (
                    <span
                      className="text-text-primary font-medium"
                      aria-current={isLast ? 'page' : undefined}
                    >
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="text-text-muted transition-colors hover:text-text-link"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Title */}
        <h1 className="font-display text-display-sm md:text-display-md text-text-primary">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="mt-3 max-w-2xl text-body-lg text-text-secondary">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
