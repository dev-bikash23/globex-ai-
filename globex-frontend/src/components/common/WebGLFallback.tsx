interface Props {
  message?: string;
}

export function WebGLFallback({ message }: Props) {
  return (
    <div className="webgl-fallback">
      <div className="webgl-fallback__icon">🌐</div>
      <h3 className="webgl-fallback__title">3D Globe Unavailable</h3>
      <p className="webgl-fallback__msg">
        {message ?? 'Your browser does not support WebGL. Please try a modern browser like Chrome, Firefox, or Edge.'}
      </p>
    </div>
  );
}
