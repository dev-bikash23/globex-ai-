interface Props {
  isFavorited: boolean;
  onToggle: () => void;
  disabled?: boolean;
  isAuthenticated: boolean;
}

export function FavoriteButton({ isFavorited, onToggle, disabled, isAuthenticated }: Props) {
  if (!isAuthenticated) {
    return (
      <button className="favorite-btn" disabled title="Sign in to save destinations">
        <span>♡</span> Save
      </button>
    );
  }

  return (
    <button
      className={`favorite-btn${isFavorited ? ' favorite-btn--active' : ''}`}
      onClick={onToggle}
      disabled={disabled}
      aria-label={isFavorited ? 'Remove from favorites' : 'Save to favorites'}
      aria-pressed={isFavorited}
    >
      <span>{isFavorited ? '♥' : '♡'}</span>
      {isFavorited ? 'Saved' : 'Save'}
    </button>
  );
}
