'use client';

import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Upload, Image as ImageIcon, X, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  preview?: string | null;
  isLoading?: boolean;
  onClear?: () => void;
}

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

export function ImageUpload({
  onImageSelect,
  preview,
  isLoading,
  onClear,
}: ImageUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = useCallback((file: File): boolean => {
    if (!ALLOWED.includes(file.type)) {
      setError('Only JPG, PNG, and WebP images are supported.');
      return false;
    }
    if (file.size > MAX_SIZE) {
      setError('Image must be under 5MB.');
      return false;
    }
    setError(null);
    return true;
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      if (validate(file)) onImageSelect(file);
    },
    [validate, onImageSelect],
  );

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      {!preview && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-colors',
            dragOver
              ? 'border-brand-accent bg-brand-accent/5'
              : 'border-border hover:border-brand-accent/40 hover:bg-surface-muted/50',
          )}
        >
          <div className="flex size-12 items-center justify-center rounded-xl bg-surface-muted">
            <Upload className="size-5 text-text-muted" />
          </div>
          <div className="text-center">
            <p className="text-body-sm font-medium text-text-primary">
              Drop your handwritten image here
            </p>
            <p className="mt-1 text-caption text-text-muted">
              JPG, PNG, or WebP · Max 5MB
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = '';
            }}
          />
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div className="relative overflow-hidden rounded-xl border border-border">
          <img
            src={preview}
            alt="Handwritten text preview"
            className="max-h-48 w-full object-contain bg-surface-muted"
          />
          {!isLoading && onClear && (
            <button
              onClick={onClear}
              className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-surface-card/90 text-text-muted shadow-sm backdrop-blur-sm transition-colors hover:text-text-primary"
            >
              <X className="size-4" />
            </button>
          )}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-surface-card/70 backdrop-blur-sm">
              <Loader2 className="size-6 animate-spin text-brand-accent" />
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-caption text-status-danger">{error}</p>
      )}
    </div>
  );
}
