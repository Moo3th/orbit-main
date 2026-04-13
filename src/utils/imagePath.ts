/**
 * Encodes image paths with Arabic or special characters
 * Properly handles URL encoding while preserving path structure
 */
export function encodeImagePath(path: string): string {
  // Split the path into segments
  const segments = path.split('/');
  
  // Encode each segment (except empty segments from leading/trailing slashes)
  const encodedSegments = segments.map(segment => {
    if (!segment) return segment; // Preserve empty segments for slashes
    // Encode the segment, but decode slashes that encodeURIComponent adds
    return encodeURIComponent(segment);
  });
  
  // Join back with slashes
  return encodedSegments.join('/');
}
