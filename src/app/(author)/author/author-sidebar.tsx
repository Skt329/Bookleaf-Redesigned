'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Wallet,
  BarChart3,
  LifeBuoy,
  User,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthorSidebarProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

const sidebarLinks = [
  { label: 'Dashboard', href: '/author/dashboard', icon: LayoutDashboard },
  { label: 'My Books', href: '/author/books', icon: BookOpen },
  { label: 'Royalties', href: '/author/royalties', icon: Wallet },
  { label: 'Sales', href: '/author/sales', icon: BarChart3 },
  { label: 'Challenge', href: '/author/challenge', icon: Sparkles },
  { label: 'Support', href: '/author/tickets', icon: LifeBuoy },
  { label: 'Profile', href: '/author/profile', icon: User },
];

export function AuthorSidebar({ user }: AuthorSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === '/author/dashboard')
      return pathname === '/author/dashboard' || pathname === '/author';
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    const { signOut } = await import('next-auth/react');
    await signOut({ callbackUrl: '/login', redirect: true });
  };

  const sidebarContent = (
    <>
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 border-b border-border px-5 py-6">
        <div className="flex size-10 items-center justify-center rounded-xl bg-brand-accent font-display text-heading-sm text-text-inverse">
          B
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="truncate text-body-sm font-semibold text-text-primary">
              BookLeaf
            </p>
            <p className="text-caption text-text-muted">Author Portal</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {sidebarLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-body-sm font-medium transition-all duration-200',
                    active
                      ? 'bg-brand-primary text-text-inverse shadow-sm'
                      : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary',
                    collapsed && 'justify-center px-2',
                  )}
                  title={collapsed ? link.label : undefined}
                >
                  <link.icon
                    className={cn(
                      'size-5 shrink-0',
                      active ? 'text-text-inverse' : 'text-text-muted',
                    )}
                  />
                  {!collapsed && <span>{link.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User section */}
      <div className="border-t border-border p-4">
        <div
          className={cn(
            'mb-3 flex items-center gap-3',
            collapsed && 'justify-center',
          )}
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-primary-light text-body-sm font-semibold text-text-inverse">
            {user.name.charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="truncate text-body-sm font-medium text-text-primary">
                {user.name}
              </p>
              <p className="truncate text-caption text-text-muted">
                {user.email}
              </p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className={cn(
            'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-body-sm font-medium',
            'text-status-danger transition-colors hover:bg-surface-muted',
            collapsed && 'justify-center px-2',
          )}
        >
          <LogOut className="size-4" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-sticky flex h-14 items-center justify-between border-b border-border bg-surface-card px-4 lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex size-10 items-center justify-center rounded-lg transition-colors hover:bg-surface-muted"
          aria-label="Open menu"
        >
          <Menu className="size-5 text-text-primary" />
        </button>
        <span className="font-display text-body-md font-semibold text-text-primary">
          BookLeaf
        </span>
        <div className="size-10" />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-modal bg-surface-overlay lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-modal flex w-72 flex-col border-r border-border bg-surface-card transition-transform duration-300 lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-5 flex size-8 items-center justify-center rounded-lg hover:bg-surface-muted"
          aria-label="Close menu"
        >
          <X className="size-5 text-text-muted" />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          'relative hidden shrink-0 flex-col border-r border-border bg-surface-card transition-all duration-300 lg:flex',
          collapsed ? 'w-[72px]' : 'w-64',
        )}
      >
        {sidebarContent}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 bottom-20 hidden size-6 items-center justify-center rounded-full border border-border bg-surface-card shadow-sm transition-colors hover:bg-surface-muted lg:flex"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft
            className={cn(
              'size-3.5 text-text-muted transition-transform',
              collapsed && 'rotate-180',
            )}
          />
        </button>
      </aside>
    </>
  );
}
