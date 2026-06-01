'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Plus, X, Send } from 'lucide-react';

const CATEGORIES = [
  { value: 'ROYALTY_PAYMENTS', label: 'Royalty Payments' },
  { value: 'ISBN_METADATA', label: 'ISBN & Metadata' },
  { value: 'PRINTING_QUALITY', label: 'Printing Quality' },
  { value: 'DISTRIBUTION', label: 'Distribution' },
  { value: 'BOOK_STATUS', label: 'Book Status' },
  { value: 'GENERAL', label: 'General Inquiry' },
];

export function NewTicketForm() {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/author/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, category, description }),
      });

      if (res.ok) {
        setSubject('');
        setCategory('GENERAL');
        setDescription('');
        setOpen(false);
        router.refresh();
      }
    } catch {
      // handle error
    } finally {
      setSubmitting(false);
    }
  }

  const inputClasses =
    'w-full rounded-lg border border-border bg-surface-background px-4 py-2.5 text-body-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors font-body';

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-5 py-2.5 text-body-sm font-semibold text-text-inverse hover:bg-brand-primary-hover transition-colors font-body"
      >
        <Plus className="size-4" />
        New Ticket
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center bg-brand-dark/50 p-4">
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-lg space-y-5 p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-heading-sm text-text-primary">
            Submit a Ticket
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg p-1 text-text-muted hover:bg-surface-muted transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <div>
          <label className="block text-body-sm font-medium text-text-secondary mb-1">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief description of your issue"
            className={inputClasses}
            required
          />
        </div>

        <div>
          <label className="block text-body-sm font-medium text-text-secondary mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClasses}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-body-sm font-medium text-text-secondary mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your issue in detail..."
            rows={4}
            className={cn(inputClasses, 'resize-none')}
            required
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg px-4 py-2 text-body-sm font-medium text-text-secondary hover:bg-surface-muted transition-colors font-body"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || !subject.trim() || !description.trim()}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-body-sm font-semibold transition-colors font-body',
              submitting
                ? 'bg-surface-muted text-text-muted cursor-not-allowed'
                : 'bg-brand-primary text-text-inverse hover:bg-brand-primary-hover'
            )}
          >
            <Send className="size-4" />
            {submitting ? 'Submitting...' : 'Submit Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
}
