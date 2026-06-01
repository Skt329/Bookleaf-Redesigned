'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Pen,
  CheckCircle2,
  Clock,
  Trophy,
  Calendar,
  FileText,
  Save,
  Send,
  Sparkles,
} from 'lucide-react';

/* -----------------------------------------------------------------------
   Types
   ----------------------------------------------------------------------- */

interface Poem {
  id: string;
  dayNumber: number;
  title: string;
  content: unknown;
  wordCount: number;
  isDraft: boolean;
  submittedAt: string | null;
  aiFeedback: string | null;
  lastSavedAt: string;
}

interface Registration {
  id: string;
  challenge: {
    title: string;
    startDate: string;
    endDate: string;
    status: string;
  };
  completedChallenge: boolean;
}

/* -----------------------------------------------------------------------
   Component
   ----------------------------------------------------------------------- */

export default function ChallengeDashboardClient({
  registration,
  poems,
  totalDays,
}: {
  registration: Registration;
  poems: Poem[];
  totalDays: number;
}) {
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedPoems, setSavedPoems] = useState<Poem[]>(poems);

  const submittedCount = savedPoems.filter((p) => !p.isDraft).length;
  const draftCount = savedPoems.filter((p) => p.isDraft).length;
  const progress = totalDays > 0 ? Math.round((submittedCount / totalDays) * 100) : 0;

  const poemMap = new Map(savedPoems.map((p) => [p.dayNumber, p]));

  function openDay(day: number) {
    const existing = poemMap.get(day);
    setActiveDay(day);
    setTitle(existing?.title || '');
    setContent(typeof existing?.content === 'string' ? existing.content : '');
  }

  async function handleSave(isDraft: boolean) {
    if (!activeDay || !title.trim()) return;
    setSaving(true);

    try {
      const res = await fetch('/api/writing-challenge/poems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayNumber: activeDay,
          title: title.trim(),
          content,
          wordCount: content.split(/\s+/).filter(Boolean).length,
          isDraft,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSavedPoems((prev) => {
          const filtered = prev.filter((p) => p.dayNumber !== activeDay);
          return [...filtered, data.data].sort((a, b) => a.dayNumber - b.dayNumber);
        });
        if (!isDraft) setActiveDay(null);
      }
    } catch {
      // handle error
    } finally {
      setSaving(false);
    }
  }

  const inputClasses =
    'w-full rounded-lg border border-border bg-surface-background px-4 py-2.5 text-body-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors font-body';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-display text-display-sm text-text-primary">
          {registration.challenge.title}
        </h1>
        <p className="mt-2 text-body-lg text-text-secondary">
          Your writing journey — one poem at a time
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="card p-5 text-center">
          <Trophy className="size-6 text-brand-accent mx-auto mb-2" />
          <p className="font-display text-heading-md text-text-primary">{progress}%</p>
          <p className="text-caption text-text-muted">Complete</p>
        </div>
        <div className="card p-5 text-center">
          <CheckCircle2 className="size-6 text-status-success mx-auto mb-2" />
          <p className="font-display text-heading-md text-text-primary">{submittedCount}</p>
          <p className="text-caption text-text-muted">Submitted</p>
        </div>
        <div className="card p-5 text-center">
          <FileText className="size-6 text-status-warning mx-auto mb-2" />
          <p className="font-display text-heading-md text-text-primary">{draftCount}</p>
          <p className="text-caption text-text-muted">Drafts</p>
        </div>
        <div className="card p-5 text-center">
          <Calendar className="size-6 text-brand-primary mx-auto mb-2" />
          <p className="font-display text-heading-md text-text-primary">{totalDays}</p>
          <p className="text-caption text-text-muted">Total Days</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-body-sm font-medium text-text-primary">Progress</span>
          <span className="text-body-sm text-text-muted">{submittedCount}/{totalDays} poems</span>
        </div>
        <div className="h-3 rounded-full bg-surface-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-accent transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Day grid */}
      <div>
        <h2 className="font-display text-heading-sm text-text-primary mb-4">Daily Poems</h2>
        <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-2">
          {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
            const poem = poemMap.get(day);
            const isSubmitted = poem && !poem.isDraft;
            const isDraft = poem?.isDraft;

            return (
              <button
                key={day}
                onClick={() => openDay(day)}
                className={cn(
                  'flex flex-col items-center justify-center rounded-lg border p-2.5 text-body-sm font-medium transition-all hover:shadow-sm',
                  activeDay === day && 'ring-2 ring-brand-primary',
                  isSubmitted
                    ? 'bg-status-success/10 border-status-success/30 text-status-success'
                    : isDraft
                    ? 'bg-status-warning/10 border-status-warning/30 text-status-warning'
                    : 'bg-surface-card border-border text-text-muted hover:border-brand-primary/30'
                )}
              >
                {isSubmitted ? (
                  <CheckCircle2 className="size-4 mb-0.5" />
                ) : isDraft ? (
                  <Clock className="size-4 mb-0.5" />
                ) : (
                  <Pen className="size-4 mb-0.5 opacity-40" />
                )}
                <span className="text-xs">Day {day}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor */}
      {activeDay !== null && (
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-heading-sm text-text-primary">
              Day {activeDay} — Write Your Poem
            </h3>
            <button
              onClick={() => setActiveDay(null)}
              className="text-body-sm text-text-muted hover:text-text-primary transition-colors"
            >
              Close
            </button>
          </div>

          <div>
            <label className="block text-body-sm font-medium text-text-secondary mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your poem a title..."
              className={inputClasses}
            />
          </div>

          <div>
            <label className="block text-body-sm font-medium text-text-secondary mb-1">Poem</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your poem here..."
              rows={10}
              className={cn(inputClasses, 'resize-none font-mono leading-relaxed')}
            />
            <p className="mt-1 text-caption text-text-muted">
              {content.split(/\s+/).filter(Boolean).length} words
            </p>
          </div>

          {/* AI Feedback display */}
          {poemMap.get(activeDay)?.aiFeedback && (
            <div className="rounded-lg border border-brand-accent/20 bg-brand-accent/5 p-4">
              <p className="flex items-center gap-2 text-body-sm font-semibold text-brand-accent mb-2">
                <Sparkles className="size-4" /> AI Feedback
              </p>
              <p className="text-body-sm text-text-secondary whitespace-pre-wrap">
                {poemMap.get(activeDay)?.aiFeedback}
              </p>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => handleSave(true)}
              disabled={saving || !title.trim()}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-body-sm font-medium text-text-secondary hover:bg-surface-muted transition-colors font-body disabled:opacity-50"
            >
              <Save className="size-4" />
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={saving || !title.trim() || !content.trim()}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-body-sm font-semibold transition-colors font-body',
                saving || !title.trim() || !content.trim()
                  ? 'bg-surface-muted text-text-muted cursor-not-allowed'
                  : 'bg-brand-primary text-text-inverse hover:bg-brand-primary-hover'
              )}
            >
              <Send className="size-4" />
              {saving ? 'Submitting...' : 'Submit Poem'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
