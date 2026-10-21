interface Props {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}
export function DeleteConfirmModal({ isOpen, title='Delete', message='Are you sure? This cannot be undone.', confirmLabel='Delete', onConfirm, onCancel, danger=true }: Props) {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)' }} onClick={onCancel}>
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', maxWidth: '24rem', width: '100%', margin: '0 1rem', boxShadow: 'var(--shadow-xl)' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ color: 'var(--color-navy)', fontWeight: 700, fontSize: '1.125rem', marginBottom: '0.5rem' }}>{title}</h3>
        <p style={{ color: 'var(--color-slate)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{message}</p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', color: 'var(--color-slate)', background: 'var(--color-sand)', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: 600, color: '#fff', background: danger ? '#DC2626' : 'var(--color-navy)', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
