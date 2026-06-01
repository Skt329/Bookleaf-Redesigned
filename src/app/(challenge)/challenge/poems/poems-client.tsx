'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  PenLine,
  Save,
  Send,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Loader2,
} from 'lucide-react';

interface Poem {
  id?: string;
  dayNumber: number;
  title: string;
  content: any;
  wordCount: number;
  isDraft: boolean;
  submittedAt: string | null;
  lastSavedAt: string;
}

interface Registration {
  id: string;
  personalStartDate: string | null;
  personalEndDate: string | null;
  challenge: { durationDays: number; title: string };
}

export default function PoemsPage() {
  const searchParams = useSearchParams();
  const dayParam = searchParams.get('day');

  const [registration, setRegistration] = useState<Registration | null>(null);
  const [poems, setPoems] = useState<Poem[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(
    dayParam ? parseInt(dayParam, 10) : 1,
  );
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch poems
  useEffect(() => {
    async function fetchPoems() {
      try {
        const res = await fetch('/api/writing-challenge/poems');
        const data = await res.json();
        if (data.success) {
          setRegistration(data.data.registration);
          setPoems(data.data.poems);
        }
      } catch (err) {
        console.error('Failed to fetch poems:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPoems();
  }, []);

  // Load poem for selected day
  useEffect(() => {
    const poem = poems.find((p) => p.dayNumber === selectedDay);
    if (poem) {
      setTitle(poem.title);
      // Extract text from Tiptap JSON or use raw string
      if (poem.content?.content) {
        const text = poem.content.content
          .map((node: any) =>
            node.content?.map((c: any) => c.text || '').join('') ?? '',
          )
          .join('\n');
        setContent(text);
      } else {
        setContent('');
      }
      setLastSaved(poem.lastSavedAt);
    } else {
      setTitle(`Poem for Day ${selectedDay}`);
      setContent('');
      setLastSaved(null);
    }
  }, [selectedDay, poems]);

  const totalDays = registration?.challenge.durationDays ?? 21;
  const startDate = registration?.personalStartDate
    ? new Date(registration.personalStartDate)
    : new Date();
  const todayDayNumber = Math.min(
    totalDays,
    Math.max(
      1,
      Math.ceil(
        (Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24),
      ),
    ),
  );

  const wordCount = content
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  const currentPoem = poems.find((p) => p.dayNumber === selectedDay);
  const isSubmitted = currentPoem && !currentPoem.isDraft;

  // Build Tiptap-compatible JSON
  const buildContent = useCallback(
    () => ({
      type: 'doc',
      content: content.split('\n').map((line) => ({
        type: 'paragraph',
        content: line ? [{ type: 'text', text: line }] : [],
      })),
    }),
    [content],
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/writing-challenge/poems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayNumber: selectedDay,
          title,
          content: buildContent(),
          wordCount,
          isDraft: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLastSaved(new Date().toISOString());
        // Update local poems state
        setPoems((prev) => {
          const idx = prev.findIndex((p) => p.dayNumber === selectedDay);
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = data.data;
            return updated;
          }
          return [...prev, data.data];
        });
      }
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() || !title.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/writing-challenge/poems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayNumber: selectedDay,
          title,
          content: buildContent(),
          wordCount,
          isDraft: false,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPoems((prev) => {
          const idx = prev.findIndex((p) => p.dayNumber === selectedDay);
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = data.data;
            return updated;
          }
          return [...prev, data.data];
        });
      }
    } catch (err) {
      console.error('Submit failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-brand-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-display-sm text-text-primary">
            My Poems
          </h1>
          <p className="mt-1 text-body-md text-text-secondary">
            Day {selectedDay} of {totalDays}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedDay(Math.max(1, selectedDay - 1))}
            disabled={selectedDay <= 1}
            className="flex size-9 items-center justify-center rounded-lg border border-border bg-surface-card text-text-secondary transition-colors hover:bg-surface-muted disabled:opacity-40"
            aria-label="Previous day"
          >
            <ArrowLeft className="size-4" />
          </button>
          <span className="min-w-[80px] text-center text-body-sm font-medium text-text-primary">
            Day {selectedDay}
          </span>
          <button
            onClick={() =>
              setSelectedDay(Math.min(todayDayNumber, selectedDay + 1))
            }
            disabled={selectedDay >= todayDayNumber}
            className="flex size-9 items-center justify-center rounded-lg border border-border bg-surface-card text-text-secondary transition-colors hover:bg-surface-muted disabled:opacity-40"
            aria-label="Next day"
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Day pills */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: Math.min(totalDays, todayDayNumber) }, (_, i) => {
          const day = i + 1;
          const poem = poems.find((p) => p.dayNumber === day);
          const submitted = poem && !poem.isDraft;
          const draft = poem?.isDraft;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={cn(
                'flex size-10 items-center justify-center rounded-lg border text-body-sm font-semibold transition-all',
                selectedDay === day &&
                  'border-brand-accent bg-brand-accent text-brand-dark shadow-gold',
                selectedDay !== day && submitted &&
                  'border-status-success/50 bg-status-success/10 text-status-success',
                selectedDay !== day && draft && !submitted &&
                  'border-status-warning/50 bg-status-warning/10 text-status-warning',
                selectedDay !== day && !poem &&
                  'border-border bg-surface-muted text-text-muted hover:border-brand-accent/40',
              )}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Editor */}
      <div className="card p-0 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div className="flex items-center gap-3">
            <PenLine className="size-5 text-brand-accent" />
            <span className="text-body-sm font-medium text-text-primary">
              {isSubmitted ? 'Submitted' : 'Editing'}
            </span>
            {isSubmitted && (
              <span className="inline-flex items-center gap-1 rounded-full bg-status-success/10 px-2.5 py-0.5 text-caption font-medium text-status-success">
                <CheckCircle2 className="size-3" />
                Submitted
              </span>
            )}
            {currentPoem?.isDraft && (
              <span className="inline-flex items-center gap-1 rounded-full bg-status-warning/10 px-2.5 py-0.5 text-caption font-medium text-status-warning">
                <Clock className="size-3" />
                Draft
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-caption text-text-muted">
            <span>{wordCount} words</span>
            {lastSaved && (
              <>
                <span>·</span>
                <span>
                  Saved{' '}
                  {new Date(lastSaved).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Title input */}
        <div className="border-b border-border px-5 py-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Poem title..."
            disabled={isSubmitted}
            className="w-full bg-transparent font-display text-heading-md text-text-primary placeholder:text-text-muted focus:outline-none disabled:opacity-60"
            id="poem-title-input"
          />
        </div>

        {/* Content textarea */}
        <div className="px-5 py-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your poem..."
            disabled={isSubmitted}
            rows={16}
            className="w-full resize-none bg-transparent font-body text-body-md leading-relaxed text-text-primary placeholder:text-text-muted focus:outline-none disabled:opacity-60"
            id="poem-content-input"
          />
        </div>

        {/* Actions */}
        {!isSubmitted && (
          <div className="flex items-center justify-between border-t border-border px-5 py-3">
            <p className="text-caption text-text-muted">
              Save as draft or submit your final poem.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saving || !title.trim()}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-body-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted disabled:opacity-40"
                id="poem-save-draft"
              >
                {saving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                Save Draft
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !content.trim() || !title.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-accent px-4 py-2 text-body-sm font-semibold text-brand-dark transition-all hover:bg-brand-accent-hover hover:shadow-gold disabled:opacity-40"
                id="poem-submit"
              >
                {submitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
                Submit Poem
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
