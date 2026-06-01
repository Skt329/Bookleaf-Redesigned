'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Truck, CreditCard, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface CartItem {
  bookId: string;
  title: string;
  mrp: number;
  quantity: number;
  bookType: 'PAPERBACK' | 'EBOOK';
  coverImageUrl?: string | null;
}

type CheckoutStep = 'details' | 'review' | 'processing' | 'success';

export function CheckoutForm() {
  const router = useRouter();
  const [step, setStep] = useState<CheckoutStep>('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [error, setError] = useState('');

  // Guest details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  // Cart items from localStorage
  const [cartItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('bookleaf-cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.mrp ?? 0) * item.quantity,
    0,
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    setStep('processing');

    try {
      const res = await fetch('/api/bookstore/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: name,
          guestEmail: email,
          guestPhone: phone,
          shippingAddress: { address, city, state, pincode },
          items: cartItems.map((item) => ({
            bookId: item.bookId,
            quantity: item.quantity,
            unitPrice: item.mrp,
            bookType: item.bookType,
          })),
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Checkout failed');
      }

      setOrderNumber(data.data.orderNumber);
      setStep('success');

      // Clear cart
      localStorage.removeItem('bookleaf-cart');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStep('details');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (cartItems.length === 0 && step !== 'success') {
    return (
      <div className="card p-12 text-center">
        <ShoppingBag className="mx-auto size-12 text-text-muted mb-4" />
        <h2 className="font-display text-heading-md text-text-primary mb-2">
          Your cart is empty
        </h2>
        <p className="text-body-md text-text-secondary mb-6">
          Browse our bookstore to find your next great read.
        </p>
        <button
          onClick={() => router.push('/bookstore')}
          className="btn-primary px-6 py-2.5"
        >
          Browse Books
        </button>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="card p-12 text-center max-w-lg mx-auto">
        <div className="flex size-16 items-center justify-center rounded-full bg-status-success/10 mx-auto mb-6">
          <CheckCircle2 className="size-8 text-status-success" />
        </div>
        <h2 className="font-display text-heading-lg text-text-primary mb-2">
          Order Placed!
        </h2>
        <p className="text-body-md text-text-secondary mb-4">
          Thank you for your purchase. Your order number is:
        </p>
        <p className="font-mono text-heading-md text-brand-primary font-bold mb-6">
          {orderNumber}
        </p>
        <p className="text-body-sm text-text-muted mb-8">
          We&apos;ve sent a confirmation email to <strong>{email}</strong>. You
          can track your order using your order number and email.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() =>
              router.push(
                `/bookstore/order-tracking?order=${orderNumber}&email=${email}`,
              )
            }
            className="btn-primary px-6 py-2.5"
          >
            Track Order
          </button>
          <button
            onClick={() => router.push('/bookstore')}
            className="btn-outline px-6 py-2.5"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    { key: 'details', label: 'Details', icon: Truck },
    { key: 'review', label: 'Review', icon: CreditCard },
  ] as const;

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Main form */}
      <div className="lg:col-span-2">
        {/* Step indicator */}
        <div className="flex items-center gap-4 mb-8">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isActive =
              s.key === step || (step === 'processing' && s.key === 'review');
            const isPast =
              steps.findIndex((x) => x.key === step) > i ||
              step === 'processing';
            return (
              <div key={s.key} className="flex items-center gap-2">
                <div
                  className={`flex size-8 items-center justify-center rounded-full text-body-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-brand-primary text-text-inverse'
                      : isPast
                        ? 'bg-status-success/20 text-status-success'
                        : 'bg-surface-muted text-text-muted'
                  }`}
                >
                  {isPast && !isActive ? (
                    <CheckCircle2 className="size-4" />
                  ) : (
                    <Icon className="size-4" />
                  )}
                </div>
                <span
                  className={`text-body-sm font-medium ${isActive ? 'text-text-primary' : 'text-text-muted'}`}
                >
                  {s.label}
                </span>
                {i < steps.length - 1 && (
                  <div className="h-px w-8 bg-border" />
                )}
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSubmit}>
          {step === 'details' && (
            <div className="card p-6 space-y-6">
              <h2 className="font-display text-heading-sm text-text-primary">
                Shipping Details
              </h2>

              {error && (
                <div className="rounded-lg bg-status-error/10 border border-status-error/30 p-3 text-body-sm text-status-error">
                  {error}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="checkout-name"
                    className="block text-body-sm font-medium text-text-primary mb-1.5"
                  >
                    Full Name *
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input w-full"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="checkout-email"
                    className="block text-body-sm font-medium text-text-primary mb-1.5"
                  >
                    Email Address *
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input w-full"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="checkout-phone"
                  className="block text-body-sm font-medium text-text-primary mb-1.5"
                >
                  Phone Number *
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input w-full"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-address"
                  className="block text-body-sm font-medium text-text-primary mb-1.5"
                >
                  Street Address *
                </label>
                <textarea
                  id="checkout-address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="input w-full min-h-[80px] resize-none"
                  placeholder="House no., Street, Locality"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="checkout-city"
                    className="block text-body-sm font-medium text-text-primary mb-1.5"
                  >
                    City *
                  </label>
                  <input
                    id="checkout-city"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="input w-full"
                  />
                </div>
                <div>
                  <label
                    htmlFor="checkout-state"
                    className="block text-body-sm font-medium text-text-primary mb-1.5"
                  >
                    State *
                  </label>
                  <input
                    id="checkout-state"
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="input w-full"
                  />
                </div>
                <div>
                  <label
                    htmlFor="checkout-pincode"
                    className="block text-body-sm font-medium text-text-primary mb-1.5"
                  >
                    PIN Code *
                  </label>
                  <input
                    id="checkout-pincode"
                    type="text"
                    required
                    pattern="[0-9]{6}"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="input w-full"
                    placeholder="110001"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!name || !email || !phone || !address || !city || !state || !pincode) {
                    setError('Please fill in all required fields');
                    return;
                  }
                  setError('');
                  setStep('review');
                }}
                className="btn-primary w-full py-3"
              >
                Review Order
              </button>
            </div>
          )}

          {(step === 'review' || step === 'processing') && (
            <div className="card p-6 space-y-6">
              <h2 className="font-display text-heading-sm text-text-primary">
                Review Your Order
              </h2>

              {/* Shipping summary */}
              <div className="rounded-lg bg-surface-muted p-4">
                <h3 className="text-body-sm font-semibold text-text-primary mb-2">
                  Shipping To
                </h3>
                <p className="text-body-sm text-text-secondary">{name}</p>
                <p className="text-body-sm text-text-muted">{address}</p>
                <p className="text-body-sm text-text-muted">
                  {city}, {state} — {pincode}
                </p>
                <p className="text-body-sm text-text-muted">{email} · {phone}</p>
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="text-body-sm text-brand-primary hover:underline mt-2"
                >
                  Edit details
                </button>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.bookId}
                    className="flex items-center gap-4 rounded-lg border border-border p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm font-semibold text-text-primary truncate">
                        {item.title}
                      </p>
                      <p className="text-caption text-text-muted">
                        {item.bookType} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-body-sm font-semibold text-text-primary">
                      {formatCurrency((item.mrp ?? 0) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-3 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="size-4 border-2 border-text-inverse/30 border-t-text-inverse rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  `Place Order — ${formatCurrency(totalAmount)}`
                )}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Order summary sidebar */}
      {(step === 'details' || step === 'review' || step === 'processing') && (
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h3 className="font-display text-heading-sm text-text-primary mb-4">
              Order Summary
            </h3>
            <div className="space-y-3 border-b border-border pb-4 mb-4">
              {cartItems.map((item) => (
                <div key={item.bookId} className="flex justify-between text-body-sm">
                  <span className="text-text-secondary truncate mr-2">
                    {item.title} × {item.quantity}
                  </span>
                  <span className="text-text-primary font-medium whitespace-nowrap">
                    {formatCurrency((item.mrp ?? 0) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-body-sm mb-2">
              <span className="text-text-secondary">Shipping</span>
              <span className="text-status-success font-medium">Free</span>
            </div>
            <div className="flex justify-between text-heading-sm font-display pt-3 border-t border-border">
              <span className="text-text-primary">Total</span>
              <span className="text-brand-primary">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
