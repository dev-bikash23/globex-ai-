interface Props {
  count?: number;
  height?: string;
  borderRadius?: string;
}

export function LoadingSkeleton({ count = 1, height = '80px', borderRadius = '12px' }: Props) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="loading-skeleton"
          style={{ height, borderRadius }}
        />
      ))}
    </>
  );
}
