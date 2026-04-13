'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/business/ui/button';

interface UploadedImage {
  id: string;
  filename: string;
  url: string;
  originalName: string;
}

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  isAr?: boolean;
  label?: string;
  aspectRatio?: 'square' | 'video' | 'auto';
}

export function ImageUploader({
  value,
  onChange,
  folder = 'general',
  isAr = true,
  label,
  aspectRatio = 'auto'
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);

  const handleUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError(isAr ? 'يرجى اختيار ملف صورة' : 'Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(isAr ? 'حجم الملف كبير جداً (الحد الأقصى 10MB)' : 'File too large (max 10MB)');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      onChange(data.upload.url);
      setPreviewUrl(data.upload.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : (isAr ? 'فشل الرفع' : 'Upload failed'));
    } finally {
      setUploading(false);
    }
  }, [folder, isAr, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }, [handleUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  }, [handleUpload]);

  const handleRemove = useCallback(async () => {
    if (value?.startsWith('/api/uploads/')) {
      try {
        const filename = value.replace('/api/uploads/', '');
        await fetch(`/api/uploads?filename=${encodeURIComponent(filename)}`, {
          method: 'DELETE',
        });
      } catch (err) {
        console.error('Failed to delete image:', err);
      }
    }
    onChange('');
    setPreviewUrl(null);
  }, [value, onChange]);

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    auto: 'aspect-auto min-h-[200px]',
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div
        className={`relative border-2 border-dashed rounded-xl transition-all ${
          dragOver
            ? 'border-[#104E8B] bg-[#104E8B]/5'
            : 'border-gray-300 hover:border-gray-400'
        } ${aspectRatioClasses[aspectRatio]}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="relative w-full h-full">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain rounded-lg"
            />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              title={isAr ? 'حذف الصورة' : 'Remove image'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : uploading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <Loader2 className="w-8 h-8 text-[#104E8B] animate-spin" />
            <p className="text-sm text-gray-500">
              {isAr ? 'جارِ الرفع...' : 'Uploading...'}
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center justify-center w-full h-full gap-3 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              {dragOver ? (
                <Upload className="w-6 h-6 text-[#104E8B]" />
              ) : (
                <ImageIcon className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {isAr ? 'اسحب الصورة هنا أو' : 'Drag image here or'}
                <span className="text-[#104E8B] font-medium mx-1">
                  {isAr ? 'اختر ملف' : 'browse'}
                </span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {isAr ? 'PNG, JPG, GIF, WebP (حد أقصى 10MB)' : 'PNG, JPG, GIF, WebP (max 10MB)'}
              </p>
            </div>
          </button>
        )}
        
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      {value && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setPreviewUrl(e.target.value);
            }}
            placeholder={isAr ? 'رابط الصورة' : 'Image URL'}
            className="flex-1 text-xs border border-gray-200 rounded-md px-2 py-1.5"
            dir="ltr"
          />
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#104E8B] hover:underline"
          >
            {isAr ? 'معاينة' : 'Preview'}
          </a>
        </div>
      )}
    </div>
  );
}
