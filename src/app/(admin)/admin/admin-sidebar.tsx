'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Wallet,
  LifeBuoy,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  ChevronRight,
  Trophy,
  ShoppingBag,
  Bell,
} from 'lucide-react';

/* -----------------------------------------------------------------------
   Navigation Links
   ----------------------------------------------------------------------- */

const NAV_LINKS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/authors', label: 'Authors', icon: Users },
  { href: '/admin/books', label: 'Books', icon: BookOpen },
  { href: '/admin/challenges', label: 'Challenges', icon: Trophy },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/royalties', label: 'Royalties', icon: Wallet },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/tickets', label: 'Tickets', icon: LifeBuoy },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

/* -----------------------------------------------------------------------
   Component
   ----------------------------------------------------------------------- */

interface AdminSidebarProps {
  user: { name?: string | null; email?: string | null };
  unreadNotifications?: number;
}

export function AdminSidebar({ user, unreadNotifications = 0 }: AdminSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-border">
        <div className="flex size-9 items-center justify-center rounded-lg bg-brand-primary">
          <Shield className="size-5 text-text-inverse" />
        </div>
        <div>
          <p className="font-display text-body-lg font-bold text-text-primary">
            Admin Panel
          </p>
          <p className="text-caption text-text-muted">BookLeaf Publishing</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_LINKS.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-body-sm font-medium font-body transition-all duration-200',
                active
                  ? 'bg-brand-primary text-text-inverse shadow-sm'
                  : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
              )}
            >
              <Icon className="size-[18px]" />
              {link.label}
              {link.label === 'Notifications' && unreadNotifications > 0 && (
                <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-status-danger text-text-inverse text-[10px] font-bold">
                  {unreadNotifications > 99 ? '99+' : unreadNotifications}
                </span>
              )}
              {active && link.label !== 'Notifications' && <ChevronRight className="ml-auto size-4" />}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-brand-accent/20 text-brand-accent font-bold text-body-sm">
            {user.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="min-w-0">
            <p className="truncate text-body-sm font-semibold text-text-primary">
              {user.name || 'Admin'}
            </p>
            <p className="truncate text-caption text-text-muted">
              {user.email}
            </p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-body-sm text-text-secondary hover:bg-status-danger/10 hover:text-status-danger transition-colors font-body"
        >
          <LogOut className="size-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-header flex size-10 items-center justify-center rounded-lg bg-surface-card border border-border shadow-sm lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="size-5 text-text-primary" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-modal bg-brand-dark/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-modal w-64 transform bg-surface-card border-r border-border transition-transform duration-300 lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-5 rounded-lg p-1 text-text-muted hover:bg-surface-muted"
        >
          <X className="size-5" />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-sidebar lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-border lg:bg-surface-card">
        {sidebarContent}
      </aside>
    </>
  );
}
