/**
 * Converts Google Drive URLs to playable format for videos
 * Supports formats like:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=drive_link
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/open?id=FILE_ID
 */
export function convertGoogleDriveVideoUrl(url: string): string {
  if (!url || !url.includes('drive.google.com')) {
    return url;
  }

  // Extract file ID from various Google Drive URL formats
  let fileId: string | null = null;

  // Format 1: https://drive.google.com/file/d/FILE_ID/view?usp=...
  const driveFormat1 = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveFormat1) {
    fileId = driveFormat1[1];
  }

  // Format 2: https://drive.google.com/open?id=FILE_ID
  if (!fileId) {
    const driveFormat2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (driveFormat2 && url.includes('drive.google.com')) {
      fileId = driveFormat2[1];
    }
  }

  // Format 3: Already converted Google Drive format
  if (!fileId) {
    const driveFormat3 = url.match(/drive\.google\.com\/uc\?.*id=([a-zA-Z0-9_-]+)/);
    if (driveFormat3) {
      return url; // Already converted
    }
  }

  // If we have a file ID, convert to preview format for videos
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }

  // If already in preview format, return as is
  if (url.includes('/preview')) {
    return url;
  }

  // Fallback: return original URL
  return url;
}

/**
 * Checks if a URL is a Google Drive video URL
 */
export function isGoogleDriveVideo(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  return url.includes('drive.google.com');
}

