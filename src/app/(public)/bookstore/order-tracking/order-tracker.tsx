'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Package,
  CheckCircle2,
  Truck,
  MapPin,
  Clock,
  XCircle,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface OrderData {
  orderNumber: string;
  status: string;
  totalAmount: number;
  guestName: string;
  trackingNumber: string | null;
  createdAt: string;
  updatedAt: string;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: {
    id: string;
    bookTitle: string;
    quantity: number;
    unitPrice: number;
    bookType: string;
  }[];
}

const STATUS_STEPS = [
  { key: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'PROCESSING', label: 'Processing', icon: Package },
  { key: 'SHIPPED', label: 'Shipped', icon: Truck },
  { key: 'DELIVERED', label: 'Delivered', icon: MapPin },
] as const;

export function OrderTracker() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(
    searchParams.get('order') ?? '',
  );
  const [email, setEmail] = useState(searchParams.get('email') ?? '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<OrderData | null>(null);

  // Auto-search if URL params are present
  useEffect(() => {
    if (searchParams.get('order') && searchParams.get('email')) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();
    if (!orderNumber.trim() || !email.trim()) return;

    setIsLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch('/api/bookstore/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: orderNumber.trim(),
          email: email.trim().toLowerCase(),
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Order not found');
        return;
      }

      setOrder(data.data);
    } catch {
      setError('Failed to look up order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const currentStepIndex = order
    ? STATUS_STEPS.findIndex((s) => s.key === order.status)
    : -1;

  const isCancelled =
    order?.status === 'CANCELLED' || order?.status === 'REFUNDED';

  return (
    <div className="space-y-8">
      {/* Search form */}
      <form onSubmit={handleSearch} className="card p-6 space-y-4">
        <div>
          <label
            htmlFor="track-order-number"
            className="block text-body-sm font-medium text-text-primary mb-1.5"
          >
            Order Number
          </label>
          <input
            id="track-order-number"
            type="text"
            required
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="input w-full"
            placeholder="BL-2025-001234"
          />
        </div>
        <div>
          <label
            htmlFor="track-email"
            className="block text-body-sm font-medium text-text-primary mb-1.5"
          >
            Email Address
          </label>
          <input
            id="track-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input w-full"
            placeholder="you@example.com"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full py-3 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="size-4 border-2 border-text-inverse/30 border-t-text-inverse rounded-full animate-spin" />
              Looking up...
            </>
          ) : (
            <>
              <Search className="size-4" />
              Track Order
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="card p-6 border-status-error/30 bg-status-error/5 text-center">
          <XCircle className="size-8 text-status-error mx-auto mb-3" />
          <p className="text-body-md text-text-primary font-medium">{error}</p>
          <p className="text-body-sm text-text-muted mt-1">
            Please check your order number and email address.
          </p>
        </div>
      )}

      {order && (
        <div className="space-y-6">
          {/* Status tracker */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-heading-sm text-text-primary">
                  Order {order.orderNumber}
                </h2>
                <p className="text-body-sm text-text-muted">
                  Placed on{' '}
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <span
                className={`badge text-xs px-3 py-1 ${
                  isCancelled
                    ? 'bg-status-error/10 text-status-error'
                    : currentStepIndex === 3
                      ? 'bg-status-success/10 text-status-success'
                      : 'bg-status-info/10 text-status-info'
                }`}
              >
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>

            {!isCancelled && (
              <div className="relative">
                {/* Progress bar */}
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-border">
                  <div
                    className="h-full bg-brand-primary transition-all duration-500"
                    style={{
                      width: `${Math.max(0, (currentStepIndex / (STATUS_STEPS.length - 1)) * 100)}%`,
                    }}
                  />
                </div>

                <div className="relative flex justify-between">
                  {STATUS_STEPS.map((step, i) => {
                    const Icon = step.icon;
                    const isCompleted = i <= currentStepIndex;
                    const isActive = i === currentStepIndex;
                    return (
                      <div
                        key={step.key}
                        className="flex flex-col items-center"
                      >
                        <div
                          className={`flex size-8 items-center justify-center rounded-full border-2 transition-colors ${
                            isCompleted
                              ? 'border-brand-primary bg-brand-primary'
                              : 'border-border bg-surface-card'
                          } ${isActive ? 'ring-4 ring-brand-primary/20' : ''}`}
                        >
                          <Icon
                            className={`size-4 ${isCompleted ? 'text-text-inverse' : 'text-text-muted'}`}
                          />
                        </div>
                        <span
                          className={`text-caption mt-2 ${isCompleted ? 'text-text-primary font-medium' : 'text-text-muted'}`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {order.trackingNumber && (
              <div className="mt-6 rounded-lg bg-surface-muted p-3 flex items-center gap-2">
                <Truck className="size-4 text-brand-primary shrink-0" />
                <span className="text-body-sm text-text-secondary">
                  Tracking Number:{' '}
                  <strong className="text-text-primary font-mono">
                    {order.trackingNumber}
                  </strong>
                </span>
              </div>
            )}
          </div>

          {/* Order items */}
          <div className="card p-6">
            <h3 className="font-display text-heading-sm text-text-primary mb-4">
              Items
            </h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div>
                    <p className="text-body-sm font-semibold text-text-primary">
                      {item.bookTitle}
                    </p>
                    <p className="text-caption text-text-muted">
                      {item.bookType} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-body-sm font-semibold text-text-primary">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 pt-4 border-t border-border font-display text-heading-sm">
              <span className="text-text-primary">Total</span>
              <span className="text-brand-primary">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>

          {/* Shipping address */}
          <div className="card p-6">
            <h3 className="font-display text-heading-sm text-text-primary mb-3">
              Shipping Address
            </h3>
            <div className="flex items-start gap-3">
              <MapPin className="size-5 text-text-muted shrink-0 mt-0.5" />
              <div className="text-body-sm text-text-secondary">
                <p className="font-medium text-text-primary">
                  {order.guestName}
                </p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} —{' '}
                  {order.shippingAddress.pincode}
                </p>
              </div>
            </div>
          </div>

          {/* Estimated delivery */}
          {!isCancelled && order.status !== 'DELIVERED' && (
            <div className="card p-4 flex items-center gap-3 bg-brand-accent/5 border-brand-accent/20">
              <Clock className="size-5 text-brand-accent shrink-0" />
              <p className="text-body-sm text-text-secondary">
                Estimated delivery:{' '}
                <strong className="text-text-primary">5-7 business days</strong>{' '}
                from order confirmation
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
