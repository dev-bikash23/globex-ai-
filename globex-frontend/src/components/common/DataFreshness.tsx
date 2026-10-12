interface Props {
  updatedAt: string | null;
  freshness: string;
}

export function DataFreshness({ updatedAt, freshness }: Props) {
  if (freshness === 'UNAVAILABLE') {
    return <span className="data-freshness data-freshness--unavailable">Data unavailable</span>;
  }

  let label = '';
  if (updatedAt) {
    try {
      const d = new Date(updatedAt);
      const diffMs = Date.now() - d.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      if (diffMin < 1) label = 'Just updated';
      else if (diffMin < 60) label = `Updated ${diffMin}m ago`;
      else {
        const diffH = Math.floor(diffMin / 60);
        label = `Updated ${diffH}h ago`;
      }
    } catch {
      label = `Updated ${updatedAt}`;
    }
  }

  return (
    <span className={`data-freshness data-freshness--${freshness === 'REAL_TIME' ? 'live' : 'cached'}`}>
      {freshness === 'REAL_TIME' ? '🟢' : '🔵'} {label}
    </span>
  );
}
