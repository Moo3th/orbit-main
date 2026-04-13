/**
 * Device detection utilities for iOS-specific optimizations
 */

export const isIOS = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
};

export const isSafari = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const ua = navigator.userAgent;
  return /^((?!chrome|android).)*safari/i.test(ua);
};

export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const isAndroid = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android/i.test(navigator.userAgent);
};

export const isSamsung = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Samsung|SM-/i.test(navigator.userAgent);
};

export const isLowPowerMode = (): boolean => {
  // iOS doesn't provide a direct API, but we can estimate based on reduced performance
  if (typeof window === 'undefined') return false;
  
  // Check if device has limited resources
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isLowMemory = (navigator as any).deviceMemory ? (navigator as any).deviceMemory <= 4 : false;
  
  return isReducedMotion || isLowMemory || (isIOS() && isMobile());
};

export const shouldReduceAnimations = (): boolean => {
  return isIOS() || isMobile() || isLowPowerMode();
};

export const getPerformanceLevel = (): 'high' | 'medium' | 'low' => {
  if (typeof window === 'undefined') return 'medium';
  
  // iOS always gets 'low' for heavy animations
  if (isIOS()) return 'low';
  
  // Check reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 'low';
  }
  
  // Check device memory (if available)
  const deviceMemory = (navigator as any).deviceMemory;
  if (deviceMemory) {
    if (deviceMemory <= 4) return 'low';
    if (deviceMemory <= 8) return 'medium';
    return 'high';
  }
  
  // Mobile devices get medium by default
  if (isMobile()) return 'medium';
  
  // Default to high for desktop
  return 'high';
};

