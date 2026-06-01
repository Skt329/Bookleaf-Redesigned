'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Palette,
  User,
  FileText,
  Eye,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Loader2,
  Download,
  Send,
} from 'lucide-react';

interface Poem {
  dayNumber: number;
  title: string;
  content: any;
  wordCount: number;
}

interface BookCompilerProps {
  poems: Poem[];
  totalDays: number;
  allSaved: boolean;
  savedCount: number;
  authorName: string;
  bookTitle?: string | null;
  bookSubtitle?: string | null;
  coverTemplate?: string | null;
  dedication?: string | null;
  acknowledgments?: string | null;
  authorBio?: string | null;
  registrationId: string;
}

const TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Cream background, serif typography, gold accents',
    bgClass: 'bg-gradient-to-br from-amber-50 to-amber-100',
    textClass: 'text-amber-950',
    accentClass: 'border-amber-600',
    preview: '📜',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Dark background, clean sans-serif, bold accents',
    bgClass: 'bg-gradient-to-br from-gray-900 to-gray-800',
    textClass: 'text-white',
    accentClass: 'border-indigo-400',
    preview: '🌙',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'White space, thin lines, single accent color',
    bgClass: 'bg-white',
    textClass: 'text-gray-800',
    accentClass: 'border-gray-300',
    preview: '✨',
  },
  {
    id: 'botanical',
    name: 'Botanical',
    description: 'Soft green tones, organic feel, nature-inspired',
    bgClass: 'bg-gradient-to-br from-emerald-50 to-teal-100',
    textClass: 'text-emerald-950',
    accentClass: 'border-emerald-500',
    preview: '🌿',
  },
  {
    id: 'gradient',
    name: 'Gradient',
    description: 'Bold gradient, modern typography, striking design',
    bgClass: 'bg-gradient-to-br from-violet-600 via-fuchsia-500 to-pink-400',
    textClass: 'text-white',
    accentClass: 'border-white/40',
    preview: '🎨',
  },
];

const STEPS = [
  { id: 0, label: 'Template', icon: Palette },
  { id: 1, label: 'Author', icon: User },
  { id: 2, label: 'Book Details', icon: FileText },
  { id: 3, label: 'Preview', icon: Eye },
];

export function BookCompiler({
  poems,
  totalDays,
  allSaved,
  savedCount,
  authorName,
  bookTitle: initialTitle,
  bookSubtitle: initialSubtitle,
  coverTemplate: initialTemplate,
  dedication: initialDedication,
  acknowledgments: initialAck,
  authorBio: initialBio,
  registrationId,
}: BookCompilerProps) {
  const [step, setStep] = useState(0);
  const [template, setTemplate] = useState(initialTemplate || 'classic');
  const [title, setTitle] = useState(initialTitle || 'My Poetry Collection');
  const [subtitle, setSubtitle] = useState(initialSubtitle || '#TheWriteAngle — 21 Days of Poetry');
  const [name, setName] = useState(authorName);
  const [bio, setBio] = useState(initialBio || '');
  const [dedication, setDedication] = useState(initialDedication || '');
  const [acknowledgments, setAcknowledgments] = useState(initialAck || '');
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Not ready — show progress
  if (!allSaved) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <BookOpen className="size-7 text-brand-accent" />
          <h1 className="font-display text-display-sm text-text-primary">
            My Book
          </h1>
        </div>
        <div className="card p-8 text-center">
          <Lock className="mx-auto size-12 text-text-muted/40" />
          <h2 className="mt-4 font-display text-heading-lg text-text-primary">
            Complete Your Challenge First
          </h2>
          <p className="mx-auto mt-2 max-w-md text-body-md text-text-secondary">
            Save all {totalDays} poems to unlock book compilation. You&apos;ve
            saved {savedCount} of {totalDays} so far.
          </p>
          <div className="mx-auto mt-5 h-3 w-64 overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-accent transition-all"
              style={{ width: `${Math.round((savedCount / totalDays) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  const selectedTemplate = TEMPLATES.find((t) => t.id === template) || TEMPLATES[0];

  const handleSaveBookDetails = async () => {
    setSaving(true);
    try {
      await fetch('/api/writing-challenge/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationId,
          bookTitle: title,
          bookSubtitle: subtitle,
          coverTemplate: template,
          authorBioForBook: bio,
          dedication,
          acknowledgments,
        }),
      });
    } catch (err) {
      console.error('Save book details failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForPublishing = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/writing-challenge/book/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId }),
      });
      const data = await res.json();
      if (data.success) setSubmitted(true);
    } catch (err) {
      console.error('Submit failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadPDF = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/writing-challenge/book/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/\s+/g, '_')}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setGenerating(false);
    }
  };

  /** Extract text from Tiptap JSON */
  const extractText = (content: any): string => {
    if (!content?.content) return '';
    return content.content
      .map((node: any) =>
        node.content?.map((c: any) => c.text || '').join('') ?? '',
      )
      .join('\n');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BookOpen className="size-7 text-brand-accent" />
        <h1 className="font-display text-display-sm text-text-primary">
          My Book
        </h1>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setStep(s.id)}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-body-sm font-medium transition-all',
              step === s.id
                ? 'bg-brand-accent text-brand-dark shadow-gold'
                : step > s.id
                  ? 'bg-status-success/10 text-status-success'
                  : 'bg-surface-muted text-text-muted',
            )}
          >
            <s.icon className="size-4" />
            {s.label}
          </button>
        ))}
      </div>

      {/* Step 0: Template Selection */}
      {step === 0 && (
        <div className="space-y-5">
          <div>
            <h2 className="font-display text-heading-md text-text-primary">
              Choose Your Cover Template
            </h2>
            <p className="mt-1 text-body-sm text-text-secondary">
              Select a design that matches your poetry&apos;s mood.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className={cn(
                  'group relative overflow-hidden rounded-xl border-2 transition-all',
                  template === t.id
                    ? 'border-brand-accent shadow-gold'
                    : 'border-border hover:border-brand-accent/40',
                )}
              >
                {/* Cover preview */}
                <div
                  className={cn(
                    'flex aspect-[3/4] flex-col items-center justify-center p-6',
                    t.bgClass,
                  )}
                >
                  <span className="text-4xl">{t.preview}</span>
                  <p
                    className={cn(
                      'mt-3 text-center font-display text-body-md font-bold',
                      t.textClass,
                    )}
                  >
                    {title || 'Your Title'}
                  </p>
                  <div
                    className={cn('my-2 h-px w-12 border-t', t.accentClass)}
                  />
                  <p className={cn('text-caption', t.textClass, 'opacity-70')}>
                    {name}
                  </p>
                </div>

                {/* Label */}
                <div className="bg-surface-card p-3 text-center">
                  <p className="text-body-sm font-semibold text-text-primary">
                    {t.name}
                  </p>
                  <p className="text-caption text-text-muted">
                    {t.description}
                  </p>
                </div>

                {/* Selected badge */}
                {template === t.id && (
                  <div className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-brand-accent shadow-gold">
                    <CheckCircle2 className="size-4 text-brand-dark" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-accent px-5 py-2.5 text-body-sm font-semibold text-brand-dark shadow-gold transition-all hover:bg-brand-accent-hover"
            >
              Next: Author Details <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 1: Author Details */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <h2 className="font-display text-heading-md text-text-primary">
              Author Details
            </h2>
            <p className="mt-1 text-body-sm text-text-secondary">
              This info appears on your book cover and author page.
            </p>
          </div>

          <div className="card space-y-4 p-6">
            <div>
              <label className="mb-1.5 block text-body-sm font-medium text-text-primary">
                Author Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface-card px-4 py-2.5 text-body-sm text-text-primary focus:border-brand-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-body-sm font-medium text-text-primary">
                Author Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                placeholder="A short bio about yourself..."
                className="w-full resize-none rounded-lg border border-border bg-surface-card px-4 py-2.5 text-body-sm text-text-primary placeholder:text-text-muted focus:border-brand-accent focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(0)}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-body-sm font-medium text-text-secondary hover:bg-surface-muted"
            >
              <ArrowLeft className="size-4" /> Back
            </button>
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-accent px-5 py-2.5 text-body-sm font-semibold text-brand-dark shadow-gold transition-all hover:bg-brand-accent-hover"
            >
              Next: Book Details <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Book Details */}
      {step === 2 && (
        <div className="space-y-5">
          <div>
            <h2 className="font-display text-heading-md text-text-primary">
              Book Details
            </h2>
            <p className="mt-1 text-body-sm text-text-secondary">
              Set your book title, dedication, and acknowledgments.
            </p>
          </div>

          <div className="card space-y-4 p-6">
            <div>
              <label className="mb-1.5 block text-body-sm font-medium text-text-primary">
                Book Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface-card px-4 py-2.5 text-body-sm text-text-primary focus:border-brand-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-body-sm font-medium text-text-primary">
                Subtitle
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface-card px-4 py-2.5 text-body-sm text-text-primary focus:border-brand-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-body-sm font-medium text-text-primary">
                Dedication{' '}
                <span className="text-text-muted">(optional)</span>
              </label>
              <textarea
                value={dedication}
                onChange={(e) => setDedication(e.target.value)}
                rows={3}
                placeholder="To my family, who believed in me..."
                className="w-full resize-none rounded-lg border border-border bg-surface-card px-4 py-2.5 text-body-sm text-text-primary placeholder:text-text-muted focus:border-brand-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-body-sm font-medium text-text-primary">
                Acknowledgments{' '}
                <span className="text-text-muted">(optional)</span>
              </label>
              <textarea
                value={acknowledgments}
                onChange={(e) => setAcknowledgments(e.target.value)}
                rows={3}
                placeholder="I would like to thank..."
                className="w-full resize-none rounded-lg border border-border bg-surface-card px-4 py-2.5 text-body-sm text-text-primary placeholder:text-text-muted focus:border-brand-accent focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-body-sm font-medium text-text-secondary hover:bg-surface-muted"
            >
              <ArrowLeft className="size-4" /> Back
            </button>
            <button
              onClick={async () => {
                await handleSaveBookDetails();
                setStep(3);
              }}
              disabled={saving || !title.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-accent px-5 py-2.5 text-body-sm font-semibold text-brand-dark shadow-gold transition-all hover:bg-brand-accent-hover disabled:opacity-40"
            >
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Eye className="size-4" />
              )}
              Preview Book <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Preview & Actions */}
      {step === 3 && (
        <div className="space-y-5">
          <div>
            <h2 className="font-display text-heading-md text-text-primary">
              Book Preview
            </h2>
            <p className="mt-1 text-body-sm text-text-secondary">
              Review your book and download or submit for publishing.
            </p>
          </div>

          {/* Cover Preview */}
          <div className="mx-auto max-w-sm">
            <div
              className={cn(
                'flex aspect-[3/4] flex-col items-center justify-center rounded-xl p-10 shadow-xl',
                selectedTemplate.bgClass,
              )}
            >
              <p
                className={cn(
                  'text-center font-display text-heading-lg font-bold',
                  selectedTemplate.textClass,
                )}
              >
                {title}
              </p>
              {subtitle && (
                <p
                  className={cn(
                    'mt-2 text-center text-body-sm',
                    selectedTemplate.textClass,
                    'opacity-70',
                  )}
                >
                  {subtitle}
                </p>
              )}
              <div
                className={cn(
                  'my-4 h-px w-16 border-t',
                  selectedTemplate.accentClass,
                )}
              />
              <p
                className={cn(
                  'text-center text-body-md font-medium',
                  selectedTemplate.textClass,
                  'opacity-80',
                )}
              >
                {name}
              </p>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="card p-6">
            <h3 className="mb-3 font-display text-heading-sm text-text-primary">
              Table of Contents
            </h3>
            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              {poems.map((p) => (
                <div
                  key={p.dayNumber}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-body-sm transition-colors hover:bg-surface-muted"
                >
                  <span className="text-text-primary">{p.title}</span>
                  <span className="text-text-muted">
                    Day {p.dayNumber} · {p.wordCount} words
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-body-sm font-medium text-text-secondary hover:bg-surface-muted"
            >
              <ArrowLeft className="size-4" /> Edit Details
            </button>

            <div className="flex gap-3">
              <button
                onClick={handleDownloadPDF}
                disabled={generating}
                className="inline-flex items-center gap-2 rounded-lg border border-brand-accent px-5 py-2.5 text-body-sm font-semibold text-brand-accent transition-all hover:bg-brand-accent/10 disabled:opacity-40"
              >
                {generating ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Download className="size-4" />
                )}
                Download PDF
              </button>

              {!submitted ? (
                <button
                  onClick={handleSubmitForPublishing}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-accent px-5 py-2.5 text-body-sm font-semibold text-brand-dark shadow-gold transition-all hover:bg-brand-accent-hover disabled:opacity-40"
                >
                  {submitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                  Submit for Publishing
                </button>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-lg bg-status-success/10 px-5 py-2.5 text-body-sm font-semibold text-status-success">
                  <CheckCircle2 className="size-4" />
                  Submitted for Publishing
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
