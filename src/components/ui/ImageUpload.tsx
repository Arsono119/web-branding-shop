'use client';

import { useState, useRef, useCallback } from 'react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
}

export function ImageUpload({ value, onChange, label, placeholder }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) {
        onChange(data.url);
      } else {
        setError(data.error || 'Gagal upload');
      }
    } catch {
      setError('Gagal upload gambar');
    }
    setUploading(false);
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      upload(file);
    } else {
      setError('File harus berupa gambar');
    }
  }, [upload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
  }, [upload]);

  return (
    <div>
      {label && <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>}

      {value ? (
        <div className="relative group">
          <img src={value} alt="" className="w-full h-40 object-cover rounded-lg border border-border" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <button
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-foreground rounded-lg text-sm font-medium hover:bg-gray-100"
            >
              Ganti
            </button>
            <button
              onClick={() => { onChange(''); setError(''); }}
              className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
            >
              Hapus
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging ? 'border-brand-500 bg-brand-50' : 'border-border hover:border-brand-300 hover:bg-surface-dim'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-muted">Mengupload...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <p className="text-sm font-medium text-foreground">Drag & drop gambar di sini</p>
              <p className="text-xs text-muted">atau klik untuk browse file</p>
              <p className="text-xs text-muted">JPG, PNG, WebP, GIF (maks 5MB)</p>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-error mt-1">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {!value && (
        <input
          type="text"
          value=""
          placeholder={placeholder || "Atau ketik URL gambar manual"}
          className="mt-2 w-full h-9 px-3 rounded-lg border border-border bg-surface text-foreground text-xs placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500"
          onChange={(e) => {
            const v = e.target.value.trim();
            if (v) onChange(v);
          }}
        />
      )}
    </div>
  );
}
