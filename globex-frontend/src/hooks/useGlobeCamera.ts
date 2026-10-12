import { useState, useCallback } from 'react';

export interface CameraTarget {
  lat: number;
  lng: number;
  label?: string;
}

/**
 * Controls globe camera animation.
 * focusOn() sets a target — GlobeControls lerps the camera toward it.
 * reset() clears the target — camera is free again.
 */
export function useGlobeCamera() {
  const [target, setTarget] = useState<CameraTarget | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const focusOn = useCallback((lat: number, lng: number, label?: string) => {
    setIsAnimating(true);
    setTarget({ lat, lng, label });
    // GlobeControls lerps over ~1.5s at 0.05 lerp factor per frame
    const timer = setTimeout(() => setIsAnimating(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const reset = useCallback(() => {
    setTarget(null);
    setIsAnimating(false);
  }, []);

  return { target, isAnimating, focusOn, reset };
}
