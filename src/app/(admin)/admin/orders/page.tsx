'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { ShoppingBag, Loader2, Truck, CheckCircle, Package, X } from 'lucide-react';

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  bookType: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerId: string | null;
  guestEmail: string | null;
  guestName: string | null;
  status: string;
  totalAmount: number;
  trackingNumber: string | null;
  createdAt: string;
  customer: { name: string | null; email: string | null } | null;
  items: OrderItem[];
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-status-warning/10 text-status-warning',
  CONFIRMED: 'bg-status-info/10 text-status-info',
  PROCESSING: 'bg-brand-primary/10 text-brand-primary',
  SHIPPED: 'bg-brand-accent/10 text-brand-accent',
  DELIVERED: 'bg-status-success/10 text-status-success',
  CANCELLED: 'bg-status-danger/10 text-status-danger',
  REFUNDED: 'bg-surface-muted text-text-muted',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [trackingInput, setTrackingInput] = useState<Record<string, string>>({});
  const [showTrackingFor, setShowTrackingFor] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/orders');
      const json = await res.json();
      setOrders(json.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (orderId: string, status: string, trackingNumber?: string) => {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, trackingNumber }),
      });
      if (res.ok) {
        const json = await res.json();
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: json.data.status, trackingNumber: json.data.trackingNumber } : o))
        );
        setShowTrackingFor(null);
      }
    } finally {
      setUpdating(null);
    }
  };

  const getBuyerInfo = (order: Order) => {
    if (order.customer) {
      return { name: order.customer.name || 'Unknown', email: order.customer.email || '' };
    }
    return { name: order.guestName || 'Guest', email: order.guestEmail || '' };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 skeleton" />
        <div className="h-96 skeleton" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-display-sm text-text-primary">Orders</h1>
        <p className="mt-1 text-body-md text-text-secondary">
          {orders.length} total order{orders.length !== 1 ? 's' : ''}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <ShoppingBag className="size-12 text-text-muted/40 mb-4" />
          <p className="text-body-lg font-semibold text-text-primary">No orders yet</p>
          <p className="mt-1 text-body-sm text-text-muted">
            Orders will appear here when customers place them.
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-surface-muted">
                  <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted">
                    Order #
                  </th>
                  <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted">
                    Buyer
                  </th>
                  <th className="hidden px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted sm:table-cell">
                    Items
                  </th>
                  <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted">
                    Total
                  </th>
                  <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted">
                    Status
                  </th>
                  <th className="hidden px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted md:table-cell">
                    Date
                  </th>
                  <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-muted">
                {orders.map((order) => {
                  const buyer = getBuyerInfo(order);
                  return (
                    <tr key={order.id} className="transition-colors hover:bg-surface-muted/50">
                      <td className="px-5 py-4">
                        <p className="text-body-sm font-semibold font-mono text-text-primary">
                          {order.orderNumber}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-body-sm font-semibold text-text-primary">
                          {buyer.name}
                        </p>
                        <p className="text-caption text-text-muted">{buyer.email}</p>
                      </td>
                      <td className="hidden px-5 py-4 text-body-sm text-text-secondary sm:table-cell">
                        {order.items.length}
                      </td>
                      <td className="px-5 py-4 text-body-sm font-semibold text-text-primary">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            'badge text-xs',
                            statusColors[order.status] || 'bg-surface-muted text-text-muted'
                          )}
                        >
                          {order.status}
                        </span>
                        {order.trackingNumber && (
                          <p className="mt-1 text-caption text-text-muted font-mono">
                            #{order.trackingNumber}
                          </p>
                        )}
                      </td>
                      <td className="hidden px-5 py-4 text-body-sm text-text-muted md:table-cell">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1.5">
                          {order.status === 'PENDING' && (
                            <ActionButton
                              onClick={() => updateStatus(order.id, 'CONFIRMED')}
                              loading={updating === order.id}
                              icon={CheckCircle}
                              label="Confirm"
                              className="bg-status-success/10 text-status-success hover:bg-status-success/20"
                            />
                          )}
                          {order.status === 'CONFIRMED' && (
                            <ActionButton
                              onClick={() => updateStatus(order.id, 'PROCESSING')}
                              loading={updating === order.id}
                              icon={Package}
                              label="Process"
                              className="bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20"
                            />
                          )}
                          {order.status === 'PROCESSING' && (
                            <>
                              {showTrackingFor === order.id ? (
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="text"
                                    placeholder="Tracking #"
                                    value={trackingInput[order.id] || ''}
                                    onChange={(e) =>
                                      setTrackingInput((prev) => ({
                                        ...prev,
                                        [order.id]: e.target.value,
                                      }))
                                    }
                                    className="w-28 rounded border border-border bg-surface-background px-2 py-1 text-caption text-text-primary placeholder:text-text-muted focus:border-brand-primary focus:outline-none"
                                  />
                                  <button
                                    onClick={() =>
                                      updateStatus(order.id, 'SHIPPED', trackingInput[order.id])
                                    }
                                    disabled={updating === order.id}
                                    className="rounded bg-brand-accent px-2 py-1 text-caption font-semibold text-text-inverse hover:bg-brand-accent-hover disabled:opacity-50"
                                  >
                                    {updating === order.id ? '…' : 'Ship'}
                                  </button>
                                  <button
                                    onClick={() => setShowTrackingFor(null)}
                                    className="rounded p-1 text-text-muted hover:bg-surface-muted"
                                  >
                                    <X className="size-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <ActionButton
                                  onClick={() => setShowTrackingFor(order.id)}
                                  loading={false}
                                  icon={Truck}
                                  label="Ship"
                                  className="bg-brand-accent/10 text-brand-accent hover:bg-brand-accent/20"
                                />
                              )}
                            </>
                          )}
                          {order.status === 'SHIPPED' && (
                            <ActionButton
                              onClick={() => updateStatus(order.id, 'DELIVERED')}
                              loading={updating === order.id}
                              icon={CheckCircle}
                              label="Delivered"
                              className="bg-status-success/10 text-status-success hover:bg-status-success/20"
                            />
                          )}
                          {['DELIVERED', 'CANCELLED', 'REFUNDED'].includes(order.status) && (
                            <span className="text-caption text-text-muted">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionButton({
  onClick,
  loading,
  icon: Icon,
  label,
  className,
}: {
  onClick: () => void;
  loading: boolean;
  icon: typeof CheckCircle;
  label: string;
  className: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-caption font-semibold transition-colors disabled:opacity-50',
        className
      )}
    >
      {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Icon className="size-3.5" />}
      {label}
    </button>
  );
}
