'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import {
  Save,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Loader2,
  Sparkles,
  PenLine,
} from 'lucide-react';

// Dynamic import for Tiptap (SSR-unsafe)
const PoemEditor = dynamic(
  () =>
    import('@/components/challenge/poem-editor').then((m) => ({
      default: m.PoemEditor,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[500px] items-center justify-center rounded-xl border border-border bg-surface-card">
        <Loader2 className="size-6 animate-spin text-brand-accent" />
      </div>
    ),
  },
);

// Dynamic import for AI panel
const AIPanel = dynamic(
  () =>
    import('@/components/challenge/ai-panel').then((m) => ({
      default: m.AIPanel,
    })),
  { ssr: false },
);

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

const AUTO_SAVE_DELAY = 30_000; // 30 seconds

export default function PoemsPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dayParam = searchParams.get('day');

  const [registration, setRegistration] = useState<Registration | null>(null);
  const [poems, setPoems] = useState<Poem[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(
    dayParam ? parseInt(dayParam, 10) : 1,
  );
  const [title, setTitle] = useState('');
  const [editorContent, setEditorContent] = useState<any>(null);
  const [wordCount, setWordCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentRef = useRef<any>(null);
  const titleRef = useRef<string>('');

  // Keep refs in sync
  useEffect(() => {
    contentRef.current = editorContent;
    titleRef.current = title;
  }, [editorContent, title]);

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
      setEditorContent(poem.content || null);
      setWordCount(poem.wordCount);
      setLastSaved(poem.lastSavedAt);
    } else {
      setTitle(`Poem for Day ${selectedDay}`);
      setEditorContent(null);
      setWordCount(0);
      setLastSaved(null);
    }
    setHasUnsavedChanges(false);
  }, [selectedDay, poems]);

  const totalDays = registration?.challenge.durationDays ?? 21;
  const startDate = registration?.personalStartDate
    ? new Date(registration.personalStartDate)
    : new Date();
  const todayDayNumber = Math.min(
    totalDays,
    Math.max(
      1,
      Math.ceil((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
    ),
  );

  // Max navigable day = max of todayDayNumber and highest poem day
  const highestPoemDay = poems.length
    ? Math.max(...poems.map((p) => p.dayNumber))
    : 0;
  const maxDay = Math.max(todayDayNumber, highestPoemDay);

  // Save function
  const savePoem = useCallback(async (isAutoSave = false) => {
    const currentTitle = titleRef.current;
    const currentContent = contentRef.current;

    if (!currentTitle?.trim()) return;
    if (isAutoSave && !currentContent) return;

    setSaving(true);
    try {
      const text = extractTextFromContent(currentContent);
      const wc = text
        .trim()
        .split(/\s+/)
        .filter((w: string) => w.length > 0).length;

      const res = await fetch('/api/writing-challenge/poems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayNumber: selectedDay,
          title: currentTitle,
          content: currentContent || { type: 'doc', content: [] },
          wordCount: wc,
          isDraft: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLastSaved(new Date().toISOString());
        setHasUnsavedChanges(false);
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
  }, [selectedDay]);

  // Auto-save
  useEffect(() => {
    if (!autoSaveEnabled || !hasUnsavedChanges) return;

    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      savePoem(true);
    }, AUTO_SAVE_DELAY);

    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [hasUnsavedChanges, autoSaveEnabled, savePoem]);

  // Editor change handler
  const handleEditorUpdate = useCallback((json: any, wc: number) => {
    setEditorContent(json);
    setWordCount(wc);
    setHasUnsavedChanges(true);
  }, []);

  // Navigate to day
  const goToDay = useCallback(
    (day: number) => {
      if (day >= 1 && day <= maxDay) {
        setSelectedDay(day);
        router.replace(`/challenge/poems?day=${day}`, { scroll: false });
      }
    },
    [maxDay, router],
  );

  // AI callbacks
  const handleApplyGrammarFix = useCallback(
    (correctedText: string) => {
      // Build Tiptap JSON from corrected text
      const json = {
        type: 'doc',
        content: correctedText.split('\n').map((line: string) => ({
          type: 'paragraph',
          content: line ? [{ type: 'text', text: line }] : [],
        })),
      };
      setEditorContent(json);
      setHasUnsavedChanges(true);
    },
    [],
  );

  const handleInsertTranscription = useCallback(
    (text: string) => {
      // Append transcribed text to existing content
      const paragraphs = text.split('\n').map((line: string) => ({
        type: 'paragraph',
        content: line ? [{ type: 'text', text: line }] : [],
      }));

      setEditorContent((prev: any) => {
        if (!prev?.content?.length) {
          return { type: 'doc', content: paragraphs };
        }
        return {
          type: 'doc',
          content: [...prev.content, ...paragraphs],
        };
      });
      setHasUnsavedChanges(true);
    },
    [],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-brand-accent" />
      </div>
    );
  }

  const poemText = extractTextFromContent(editorContent);

  return (
    <div className="flex gap-0">
      {/* Main editor area */}
      <div className={cn('flex-1 space-y-5 transition-all', aiPanelOpen && 'mr-[400px]')}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-display-sm text-text-primary">
              My Poems
            </h1>
            <p className="mt-0.5 text-body-sm text-text-secondary">
              Day {selectedDay} of {totalDays}
              {hasUnsavedChanges && (
                <span className="ml-2 text-status-warning">· Unsaved changes</span>
              )}
              {!hasUnsavedChanges && lastSaved && (
                <span className="ml-2 text-status-success">
                  · Saved{' '}
                  {new Date(lastSaved).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* AI Assistant */}
            <button
              onClick={() => setAiPanelOpen(!aiPanelOpen)}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-3 py-2 text-body-sm font-medium transition-colors',
                aiPanelOpen
                  ? 'border-brand-accent bg-brand-accent/10 text-brand-accent'
                  : 'border-border text-text-secondary hover:bg-surface-muted',
              )}
              id="poems-ai-toggle"
            >
              <Sparkles className="size-4" />
              <span className="hidden sm:inline">AI Assistant</span>
            </button>

            {/* Day nav */}
            <button
              onClick={() => goToDay(selectedDay - 1)}
              disabled={selectedDay <= 1}
              className="flex size-9 items-center justify-center rounded-lg border border-border bg-surface-card text-text-secondary transition-colors hover:bg-surface-muted disabled:opacity-40"
              aria-label="Previous day"
            >
              <ArrowLeft className="size-4" />
            </button>
            <span className="min-w-[72px] text-center text-body-sm font-semibold text-text-primary">
              Day {selectedDay}
            </span>
            <button
              onClick={() => goToDay(selectedDay + 1)}
              disabled={selectedDay >= maxDay}
              className="flex size-9 items-center justify-center rounded-lg border border-border bg-surface-card text-text-secondary transition-colors hover:bg-surface-muted disabled:opacity-40"
              aria-label="Next day"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>

        {/* Day pills — scrollable */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {Array.from({ length: maxDay }, (_, i) => {
            const day = i + 1;
            const poem = poems.find((p) => p.dayNumber === day);
            const hasSaved = !!poem;

            return (
              <button
                key={day}
                onClick={() => goToDay(day)}
                className={cn(
                  'flex size-9 shrink-0 items-center justify-center rounded-lg border text-caption font-bold transition-all',
                  selectedDay === day &&
                    'border-brand-accent bg-brand-accent text-brand-dark shadow-gold',
                  selectedDay !== day &&
                    hasSaved &&
                    'border-status-success/50 bg-status-success/10 text-status-success hover:bg-status-success/20',
                  selectedDay !== day &&
                    !hasSaved &&
                    'border-border bg-surface-muted text-text-muted hover:border-brand-accent/40 hover:bg-surface-card',
                )}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* Title */}
        <div className="rounded-xl border border-border bg-surface-card p-4 shadow-card">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setHasUnsavedChanges(true);
            }}
            placeholder="Poem title..."
            className="w-full bg-transparent font-display text-heading-md text-text-primary placeholder:text-text-muted focus:outline-none"
            id="poem-title-input"
          />
        </div>

        {/* Editor */}
        <PoemEditor
          content={editorContent}
          onUpdate={handleEditorUpdate}
          placeholder="Start writing your poem…"
        />

        {/* Save bar */}
        <div className="flex items-center justify-between rounded-xl border border-border bg-surface-card px-5 py-3 shadow-card">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-body-sm text-text-secondary">
              <input
                type="checkbox"
                checked={autoSaveEnabled}
                onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                className="size-4 rounded border-border accent-brand-accent"
              />
              Auto-save
            </label>
            {saving && (
              <span className="flex items-center gap-1.5 text-caption text-text-muted">
                <Loader2 className="size-3 animate-spin" />
                Saving...
              </span>
            )}
          </div>
          <button
            onClick={() => savePoem(false)}
            disabled={saving || !title.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-accent px-5 py-2.5 text-body-sm font-semibold text-brand-dark shadow-gold transition-all hover:bg-brand-accent-hover disabled:opacity-40"
            id="poem-save"
          >
            {saving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            Save Poem
          </button>
        </div>
      </div>

      {/* AI Panel */}
      {aiPanelOpen && (
        <AIPanel
          isOpen={aiPanelOpen}
          onClose={() => setAiPanelOpen(false)}
          poemText={poemText}
          poemTitle={title}
          onApplyGrammarFix={handleApplyGrammarFix}
          onInsertTranscription={handleInsertTranscription}
        />
      )}
    </div>
  );
}

/** Extract plain text from Tiptap JSON */
function extractTextFromContent(content: any): string {
  if (!content?.content) return '';
  return content.content
    .map((node: any) => {
      if (node.content) {
        return node.content
          .map((child: any) => child.text || '')
          .join('');
      }
      return '';
    })
    .join('\n');
}
