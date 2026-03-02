'use client';

import React, { useState, useRef, useCallback } from 'react';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  className?: string;
  compact?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  folder = 'uploads',
  label,
  className = '',
  compact = false,
}: ImageUploadProps) {
  const [mode, setMode] = useState<'upload' | 'url'>(value && !value.includes('supabase') ? 'url' : 'upload');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [urlInput, setUrlInput] = useState(value || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Invalid file type. Allowed: JPEG, PNG, GIF, WebP`;
    }
    if (file.size > MAX_SIZE) {
      return `File too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max 10MB.`;
    }
    return null;
  };

  const uploadFile = useCallback(async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      formData.append('bucket', 'media');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      onChange(data.url);
      setUrlInput(data.url);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [folder, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  }, [uploadFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [uploadFile]);

  const handleUrlSubmit = () => {
    setError('');
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    } else {
      onChange('');
    }
  };

  const handleRemove = () => {
    onChange('');
    setUrlInput('');
    setError('');
  };

  const hasImage = !!value;
  const isImageUrl = value && /\.(jpg|jpeg|png|gif|webp|svg)/i.test(value);

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
      )}

      {/* Mode Toggle */}
      <div className="flex gap-1 mb-2">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`px-3 py-1 text-[11px] font-medium rounded-md transition-all ${
            mode === 'upload'
              ? 'bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-500/30'
              : 'text-gray-500 hover:text-gray-300 bg-white/[0.03]'
          }`}
        >
          ⬆ Upload
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`px-3 py-1 text-[11px] font-medium rounded-md transition-all ${
            mode === 'url'
              ? 'bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-500/30'
              : 'text-gray-500 hover:text-gray-300 bg-white/[0.03]'
          }`}
        >
          🔗 URL
        </button>
      </div>

      {/* Upload Mode */}
      {mode === 'upload' && !hasImage && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl transition-all cursor-pointer ${
            compact ? 'p-4' : 'p-6'
          } ${
            dragActive
              ? 'border-cyan-400 bg-cyan-400/10 scale-[1.01]'
              : error
              ? 'border-red-500/40 bg-red-500/5 hover:border-red-500/60'
              : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
              <p className="text-xs text-cyan-400 font-medium">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-center">
              <div className={`${compact ? 'text-xl' : 'text-2xl'} ${dragActive ? 'scale-110' : ''} transition-transform`}>
                {dragActive ? '📥' : '🖼️'}
              </div>
              <div>
                <p className="text-xs text-gray-300 font-medium">
                  {dragActive ? 'Drop image here' : 'Drag & drop or click to browse'}
                </p>
                <p className="text-[10px] text-gray-600 mt-0.5">
                  JPEG, PNG, GIF, WebP • Max 10MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* URL Mode */}
      {mode === 'url' && !hasImage && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleUrlSubmit())}
            placeholder="https://example.com/image.jpg"
            className={`admin-input text-sm flex-1 ${error ? 'border-red-500/40' : ''}`}
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="px-3 py-1.5 text-xs font-medium bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors border border-white/10"
          >
            Set
          </button>
        </div>
      )}

      {/* Preview */}
      {hasImage && (
        <div className="relative group">
          <div className={`rounded-xl overflow-hidden bg-black/30 border border-white/[0.06] ${compact ? 'max-w-[100px]' : 'max-w-[200px]'}`}>
            {isImageUrl || value.includes('supabase') ? (
              <img
                src={value}
                alt="Preview"
                className="w-full h-auto object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="p-3 flex items-center gap-2">
                <span className="text-lg">🔗</span>
                <span className="text-xs text-gray-400 truncate">{value}</span>
              </div>
            )}
          </div>

          {/* Remove / Replace buttons */}
          <div className="flex gap-1.5 mt-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 text-[10px] font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-md transition-colors border border-white/10"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-2.5 py-1 text-[10px] font-medium text-red-400/70 hover:text-red-400 bg-red-500/5 hover:bg-red-500/10 rounded-md transition-colors border border-red-500/10"
            >
              Remove
            </button>
          </div>

          {/* Hidden file input for replace */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* Upload progress for replace */}
      {hasImage && uploading && (
        <div className="mt-2 flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
          <span className="text-xs text-cyan-400">Uploading replacement...</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-[11px] text-red-400 mt-1.5 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}

      {/* Current URL display */}
      {hasImage && (
        <p className="text-[10px] text-gray-600 mt-1 truncate font-mono" title={value}>
          {value}
        </p>
      )}
    </div>
  );
}

// ─── Gallery Upload Component ────────────────────────────

interface GalleryImage {
  image_url: string;
  caption?: string;
  alt?: string;
}

interface GalleryUploadProps {
  value: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  folder?: string;
}

export function GalleryUpload({ value, onChange, folder = 'gallery' }: GalleryUploadProps) {
  const images: GalleryImage[] = Array.isArray(value) ? value : [];
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFiles = useCallback(async (files: FileList) => {
    setError('');
    setUploading(true);

    const newImages: GalleryImage[] = [];

    for (const file of Array.from(files)) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(`Skipped ${file.name}: invalid type`);
        continue;
      }
      if (file.size > MAX_SIZE) {
        setError(`Skipped ${file.name}: too large`);
        continue;
      }

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);
        formData.append('bucket', 'media');

        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error);

        newImages.push({
          image_url: data.url,
          caption: '',
          alt: file.name.replace(/\.[^/.]+$/, ''),
        });
      } catch (err: any) {
        setError(`Failed to upload ${file.name}: ${err.message}`);
      }
    }

    if (newImages.length > 0) {
      onChange([...images, ...newImages]);
    }
    setUploading(false);
  }, [folder, images, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  }, [uploadFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [uploadFiles]);

  const addUrlImage = () => {
    onChange([...images, { image_url: '', caption: '', alt: '' }]);
  };

  const updateImage = (idx: number, key: string, val: string) => {
    const updated = images.map((img, i) => (i === idx ? { ...img, [key]: val } : img));
    onChange(updated);
  };

  const removeImage = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  return (
    <div>
      {/* Existing images */}
      {images.length > 0 && (
        <div className="space-y-3 mb-3">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg border border-white/[0.06] bg-white/[0.01] space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Image {idx + 1}</span>
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* If image has URL, show preview + URL; otherwise show upload for this slot */}
              {img.image_url ? (
                <>
                  <div className="flex items-start gap-3">
                    {img.image_url.match(/\.(jpg|jpeg|png|gif|webp)/i) && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                        <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <input
                      type="url"
                      value={img.image_url}
                      onChange={(e) => updateImage(idx, 'image_url', e.target.value)}
                      placeholder="Image URL"
                      className="admin-input w-full text-sm flex-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={img.caption || ''}
                      onChange={(e) => updateImage(idx, 'caption', e.target.value)}
                      placeholder="Caption"
                      className="admin-input text-sm"
                    />
                    <input
                      type="text"
                      value={img.alt || ''}
                      onChange={(e) => updateImage(idx, 'alt', e.target.value)}
                      placeholder="Alt text"
                      className="admin-input text-sm"
                    />
                  </div>
                </>
              ) : (
                <input
                  type="url"
                  value={img.image_url}
                  onChange={(e) => updateImage(idx, 'image_url', e.target.value)}
                  placeholder="Paste image URL here..."
                  className="admin-input w-full text-sm"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Drop zone for multiple uploads */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-4 transition-all cursor-pointer text-center ${
          dragActive
            ? 'border-cyan-400 bg-cyan-400/10'
            : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        {uploading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
            <span className="text-xs text-cyan-400">Uploading images...</span>
          </div>
        ) : (
          <div>
            <p className="text-xs text-gray-300 font-medium">
              {dragActive ? '📥 Drop images here' : '⬆ Upload images or drag & drop'}
            </p>
            <p className="text-[10px] text-gray-600 mt-0.5">
              Multiple files supported • JPEG, PNG, GIF, WebP • Max 10MB each
            </p>
          </div>
        )}
      </div>

      {/* Add URL button */}
      <button
        type="button"
        onClick={addUrlImage}
        className="mt-2 text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1 py-1"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add image by URL
      </button>

      {error && (
        <p className="text-[11px] text-red-400 mt-1.5 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
