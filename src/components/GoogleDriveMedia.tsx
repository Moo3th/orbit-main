'use client';

import { useState } from 'react';

interface GoogleDriveMediaProps {
  src: string;
  alt?: string;
  className?: string;
  type?: 'image' | 'video';
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

export default function GoogleDriveMedia({ 
  src, 
  alt, 
  className = '', 
  type = 'image',
  objectFit = 'contain'
}: GoogleDriveMediaProps) {
  const [error, setError] = useState(false);
  const [fallbackIndex, setFallbackIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Extract file ID from Google Drive URL
  const extractFileId = (url: string): string | null => {
    const patterns = [
      /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
      /drive\.google\.com\/thumbnail\?id=([a-zA-Z0-9_-]+)/,
      /drive\.google\.com\/uc\?.*id=([a-zA-Z0-9_-]+)/,
      /[?&]id=([a-zA-Z0-9_-]+)/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && url.includes('drive.google.com')) return match[1];
    }
    return null;
  };

  const fileId = extractFileId(src);
  const isGoogleDrive = !!fileId;

  // Handle image errors with fallback URLs
  const handleImageError = () => {
    if (!isGoogleDrive) {
      setError(true);
      return;
    }
    
    // Try alternative Google Drive URL formats
    if (fileId && fallbackIndex < 2) {
      setFallbackIndex(fallbackIndex + 1);
    } else {
      setError(true);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Map objectFit to Tailwind classes
  const objectFitClasses: Record<string, string> = {
    contain: 'object-contain',
    cover: 'object-cover',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down',
  };
  
  const objectFitClass = objectFitClasses[objectFit] || 'object-contain';

  if (isGoogleDrive && fileId) {
    // Try multiple Google Drive URL formats for best compatibility
    const fallbackUrls = [
      `https://drive.google.com/thumbnail?id=${fileId}&sz=w1920-h1080`, // Thumbnail API (most reliable)
      `https://drive.google.com/uc?export=view&id=${fileId}`, // Direct view
      `https://lh3.googleusercontent.com/d/${fileId}`, // Googleusercontent CDN
    ];
    
    const imageUrl = fallbackUrls[fallbackIndex] || fallbackUrls[0];
    
    return (
      <div className={`relative w-full h-full flex items-center justify-center bg-black/20 ${className.includes('aspect') ? '' : 'min-h-full'}`}>
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <img
          src={imageUrl}
          alt={alt || 'Google Drive Media'}
          className={`${className} ${objectFitClass} transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="lazy"
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
      </div>
    );
  }

  // Regular image rendering for non-Google Drive URLs
  return (
    <div className={`relative w-full h-full flex items-center justify-center bg-black/20 ${className.includes('aspect') ? '' : 'min-h-full'}`}>
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt || 'Media'}
        className={`${className} ${objectFitClass} transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        onError={() => setError(true)}
        onLoad={handleImageLoad}
        loading="lazy"
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      />
    </div>
  );
}

