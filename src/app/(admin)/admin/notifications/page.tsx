'use client';

import { useState, useEffect, useCallback } from 'react';
import { Trophy, ShoppingBag, CheckCircle, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const TYPE_CONFIG: Record<string, { icon: typeof Trophy; bgClass: string; iconClass: string }> = {
  CHALLENGE_BOOKS_READY: {
    icon: Trophy,
    bgClass: 'bg-status-warning/10',
    iconClass: 'text-status-warning',
  },
  NEW_ORDER: {
    icon: ShoppingBag,
    bgClass: 'bg-status-success/10',
    iconClass: 'text-status-success',
  },
  CHALLENGE_COMPLETED: {
    icon: CheckCircle,
    bgClass: 'bg-status-info/10',
    iconClass: 'text-status-info',
  },
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/notifications');
      const json = await res.json();
      setNotifications(json.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    setMarking(id);
    await fetch('/api/admin/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: [id] }),
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setMarking(null);
  };

  const markAllAsRead = async () => {
    setMarking('all');
    await fetch('/api/admin/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ all: true }),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setMarking(null);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 skeleton" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 skeleton" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-display-sm text-text-primary">
            Notifications
          </h1>
          <p className="mt-1 text-body-md text-text-secondary">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
              : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            disabled={marking === 'all'}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2.5 text-body-sm font-semibold text-text-inverse transition-colors hover:bg-brand-primary-hover disabled:opacity-50"
          >
            <CheckCircle className="size-4" />
            {marking === 'all' ? 'Marking…' : 'Mark All as Read'}
          </button>
        )}
      </div>

      {/* Notification list */}
      {notifications.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <Bell className="size-12 text-text-muted/40 mb-4" />
          <p className="text-body-lg font-semibold text-text-primary">No notifications</p>
          <p className="mt-1 text-body-sm text-text-muted">
            You&apos;ll see notifications here when there are updates.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.CHALLENGE_COMPLETED;
            const Icon = config.icon;
            return (
              <div
                key={n.id}
                className={cn(
                  'card flex items-start gap-4 px-5 py-4 transition-all',
                  !n.isRead && 'border-l-4 border-l-brand-primary'
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    'flex size-10 shrink-0 items-center justify-center rounded-full',
                    config.bgClass
                  )}
                >
                  <Icon className={cn('size-5', config.iconClass)} />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p
                        className={cn(
                          'text-body-sm font-body',
                          n.isRead
                            ? 'font-medium text-text-secondary'
                            : 'font-semibold text-text-primary'
                        )}
                      >
                        {n.title}
                      </p>
                      <p className="mt-0.5 text-body-sm text-text-muted line-clamp-2">
                        {n.message}
                      </p>
                    </div>
                    <span className="shrink-0 text-caption text-text-muted">
                      {timeAgo(n.createdAt)}
                    </span>
                  </div>
                  {!n.isRead && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      disabled={marking === n.id}
                      className="mt-2 text-caption font-semibold text-brand-primary hover:text-brand-primary-hover transition-colors disabled:opacity-50"
                    >
                      {marking === n.id ? 'Marking…' : 'Mark as Read'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
