import { useState, useEffect } from 'react';

/** Detects WebGL 2.0 (fallback to 1.0) support at runtime */
export function useWebGL(): boolean {
  const [supported, setSupported] = useState<boolean>(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      setSupported(!!gl);
    } catch {
      setSupported(false);
    }
  }, []);

  return supported;
}
