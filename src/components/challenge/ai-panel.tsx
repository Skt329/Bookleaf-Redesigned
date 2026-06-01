'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ImageUpload } from './image-upload';
import {
  X,
  Loader2,
  SpellCheck,
  MessageSquareText,
  PenTool,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Eye,
  Palette,
  Music,
} from 'lucide-react';

interface AIPanelProps {
  isOpen: boolean;
  onClose: () => void;
  poemText: string;
  poemTitle: string;
  onApplyGrammarFix: (correctedText: string) => void;
  onInsertTranscription: (text: string) => void;
}

type Tab = 'grammar' | 'feedback' | 'handwriting';

interface GrammarResult {
  corrected: string;
  changes: Array<{ original: string; fixed: string; reason: string }>;
}

interface FeedbackResult {
  overall: string;
  tone: string;
  imagery: string;
  rhythm: string;
  suggestions: string[];
}

export function AIPanel({
  isOpen,
  onClose,
  poemText,
  poemTitle,
  onApplyGrammarFix,
  onInsertTranscription,
}: AIPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('grammar');
  const [grammarLoading, setGrammarLoading] = useState(false);
  const [grammarResult, setGrammarResult] = useState<GrammarResult | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackResult, setFeedbackResult] = useState<FeedbackResult | null>(null);
  const [transcribeLoading, setTranscribeLoading] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGrammarFix = useCallback(async () => {
    if (!poemText.trim()) return;
    setGrammarLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/writing-challenge/ai/grammar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: poemText }),
      });
      const data = await res.json();
      if (data.success) {
        setGrammarResult(data.data);
      } else {
        setError(data.error || 'Grammar check failed');
      }
    } catch {
      setError('Failed to connect to AI service');
    } finally {
      setGrammarLoading(false);
    }
  }, [poemText]);

  const handleFeedback = useCallback(async () => {
    if (!poemText.trim()) return;
    setFeedbackLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/writing-challenge/ai/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: poemTitle, text: poemText }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackResult(data.data);
      } else {
        setError(data.error || 'Feedback generation failed');
      }
    } catch {
      setError('Failed to connect to AI service');
    } finally {
      setFeedbackLoading(false);
    }
  }, [poemText, poemTitle]);

  const handleImageSelect = useCallback((file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    setTranscription(null);
  }, []);

  const handleTranscribe = useCallback(async () => {
    if (!selectedFile) return;
    setTranscribeLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      const res = await fetch('/api/writing-challenge/ai/transcribe', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setTranscription(data.data.transcription);
      } else {
        setError(data.error || 'Transcription failed');
      }
    } catch {
      setError('Failed to connect to AI service');
    } finally {
      setTranscribeLoading(false);
    }
  }, [selectedFile]);

  const tabs: Array<{ id: Tab; label: string; icon: typeof SpellCheck }> = [
    { id: 'grammar', label: 'Grammar', icon: SpellCheck },
    { id: 'feedback', label: 'Feedback', icon: MessageSquareText },
    { id: 'handwriting', label: 'Handwriting', icon: PenTool },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 z-40 flex h-full w-[400px] flex-col border-l border-border bg-surface-card shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="font-display text-heading-sm text-text-primary">
          AI Assistant
        </h2>
        <button
          onClick={onClose}
          className="flex size-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface-muted hover:text-text-primary"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setError(null);
            }}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 py-3 text-body-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'border-b-2 border-brand-accent text-brand-accent'
                : 'text-text-muted hover:text-text-primary',
            )}
          >
            <tab.icon className="size-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-status-danger/10 px-3 py-2 text-body-sm text-status-danger">
            <AlertCircle className="size-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Grammar Tab */}
        {activeTab === 'grammar' && (
          <div className="space-y-4">
            <p className="text-body-sm text-text-secondary">
              AI will fix grammar, spelling, and punctuation while preserving
              your poetic voice.
            </p>
            <button
              onClick={handleGrammarFix}
              disabled={grammarLoading || !poemText.trim()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-accent px-4 py-2.5 text-body-sm font-semibold text-brand-dark transition-all hover:bg-brand-accent-hover disabled:opacity-40"
            >
              {grammarLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <SpellCheck className="size-4" />
              )}
              {grammarLoading ? 'Analyzing...' : 'Fix Grammar'}
            </button>

            {grammarResult && (
              <div className="space-y-3">
                {grammarResult.changes.length === 0 ? (
                  <div className="flex items-center gap-2 rounded-lg bg-status-success/10 px-3 py-3 text-body-sm text-status-success">
                    <CheckCircle2 className="size-4" />
                    No grammar issues found!
                  </div>
                ) : (
                  <>
                    <p className="text-caption font-medium uppercase tracking-wider text-text-muted">
                      {grammarResult.changes.length} issue
                      {grammarResult.changes.length !== 1 ? 's' : ''} found
                    </p>
                    {grammarResult.changes.map((change, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-border bg-surface-muted/50 p-3"
                      >
                        <div className="flex items-start gap-2">
                          <span className="mt-0.5 line-through text-caption text-status-danger">
                            {change.original}
                          </span>
                          <ArrowRight className="mt-0.5 size-3 shrink-0 text-text-muted" />
                          <span className="text-caption font-medium text-status-success">
                            {change.fixed}
                          </span>
                        </div>
                        <p className="mt-1.5 text-caption text-text-muted">
                          {change.reason}
                        </p>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        onApplyGrammarFix(grammarResult.corrected);
                        setGrammarResult(null);
                      }}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-status-success/10 px-4 py-2.5 text-body-sm font-semibold text-status-success transition-colors hover:bg-status-success/20"
                    >
                      <CheckCircle2 className="size-4" />
                      Apply All Fixes
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Feedback Tab */}
        {activeTab === 'feedback' && (
          <div className="space-y-4">
            <p className="text-body-sm text-text-secondary">
              Get constructive feedback on your poem&apos;s tone, imagery,
              rhythm, and more.
            </p>
            <button
              onClick={handleFeedback}
              disabled={feedbackLoading || !poemText.trim()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-accent px-4 py-2.5 text-body-sm font-semibold text-brand-dark transition-all hover:bg-brand-accent-hover disabled:opacity-40"
            >
              {feedbackLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <MessageSquareText className="size-4" />
              )}
              {feedbackLoading ? 'Analyzing...' : 'Get Feedback'}
            </button>

            {feedbackResult && (
              <div className="space-y-3">
                {/* Overall */}
                <div className="rounded-lg border border-border p-3">
                  <div className="mb-1.5 flex items-center gap-2 text-body-sm font-semibold text-text-primary">
                    <Eye className="size-4 text-brand-accent" />
                    Overall Impression
                  </div>
                  <p className="text-body-sm text-text-secondary">
                    {feedbackResult.overall}
                  </p>
                </div>

                {/* Tone */}
                {feedbackResult.tone && (
                  <div className="rounded-lg border border-border p-3">
                    <div className="mb-1.5 flex items-center gap-2 text-body-sm font-semibold text-text-primary">
                      <Palette className="size-4 text-status-info" />
                      Tone & Mood
                    </div>
                    <p className="text-body-sm text-text-secondary">
                      {feedbackResult.tone}
                    </p>
                  </div>
                )}

                {/* Imagery */}
                {feedbackResult.imagery && (
                  <div className="rounded-lg border border-border p-3">
                    <div className="mb-1.5 flex items-center gap-2 text-body-sm font-semibold text-text-primary">
                      <Eye className="size-4 text-status-success" />
                      Imagery
                    </div>
                    <p className="text-body-sm text-text-secondary">
                      {feedbackResult.imagery}
                    </p>
                  </div>
                )}

                {/* Rhythm */}
                {feedbackResult.rhythm && (
                  <div className="rounded-lg border border-border p-3">
                    <div className="mb-1.5 flex items-center gap-2 text-body-sm font-semibold text-text-primary">
                      <Music className="size-4 text-status-warning" />
                      Rhythm & Flow
                    </div>
                    <p className="text-body-sm text-text-secondary">
                      {feedbackResult.rhythm}
                    </p>
                  </div>
                )}

                {/* Suggestions */}
                {feedbackResult.suggestions.length > 0 && (
                  <div className="rounded-lg border border-border p-3">
                    <div className="mb-2 flex items-center gap-2 text-body-sm font-semibold text-text-primary">
                      <Lightbulb className="size-4 text-brand-accent" />
                      Suggestions
                    </div>
                    <ul className="space-y-1.5">
                      {feedbackResult.suggestions.map((s, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-body-sm text-text-secondary"
                        >
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-accent" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Handwriting Tab */}
        {activeTab === 'handwriting' && (
          <div className="space-y-4">
            <p className="text-body-sm text-text-secondary">
              Upload a photo of handwritten text. AI will transcribe it
              (Hindi &amp; English supported).
            </p>

            <ImageUpload
              onImageSelect={handleImageSelect}
              preview={imagePreview}
              isLoading={transcribeLoading}
              onClear={() => {
                setImagePreview(null);
                setSelectedFile(null);
                setTranscription(null);
              }}
            />

            {imagePreview && !transcription && (
              <button
                onClick={handleTranscribe}
                disabled={transcribeLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-accent px-4 py-2.5 text-body-sm font-semibold text-brand-dark transition-all hover:bg-brand-accent-hover disabled:opacity-40"
              >
                {transcribeLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <PenTool className="size-4" />
                )}
                {transcribeLoading ? 'Transcribing...' : 'Transcribe Text'}
              </button>
            )}

            {transcription && (
              <div className="space-y-3">
                <p className="text-caption font-medium uppercase tracking-wider text-text-muted">
                  Transcribed Text
                </p>
                <div className="rounded-lg border border-border bg-surface-muted/50 p-3">
                  <p className="whitespace-pre-wrap text-body-sm text-text-primary">
                    {transcription}
                  </p>
                </div>
                <button
                  onClick={() => {
                    onInsertTranscription(transcription);
                    setTranscription(null);
                    setImagePreview(null);
                    setSelectedFile(null);
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-status-success/10 px-4 py-2.5 text-body-sm font-semibold text-status-success transition-colors hover:bg-status-success/20"
                >
                  <CheckCircle2 className="size-4" />
                  Insert into Editor
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
