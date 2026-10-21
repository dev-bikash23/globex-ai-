import { useState } from 'react';
import type { ItineraryDay, ItineraryItem, CreateItineraryItemRequest, ItemType } from '../types/trip.types';

const TYPE_EMOJI: Record<ItemType, string> = {
  FLIGHT:'✈️', HOTEL:'🏨', ACTIVITY:'🎭', MEAL:'🍜', TRANSPORT:'🚌', FREE_TIME:'☕', OTHER:'📌'
};

interface ItemFormState { title: string; itemType: ItemType; startTime: string; endTime: string; locationName: string; estimatedCost: string; notes: string; }

function ItemForm({ onSubmit, onCancel, initial }: { onSubmit: (r: CreateItineraryItemRequest) => Promise<void>; onCancel: () => void; initial?: Partial<ItemFormState>; }) {
  const [f, setF] = useState<ItemFormState>({ title: initial?.title ?? '', itemType: initial?.itemType ?? 'OTHER', startTime: initial?.startTime ?? '', endTime: initial?.endTime ?? '', locationName: initial?.locationName ?? '', estimatedCost: initial?.estimatedCost ?? '', notes: initial?.notes ?? '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const set = (k: keyof ItemFormState, v: string) => setF(p => ({ ...p, [k]: v }));
  async function submit(e: React.FormEvent) {
    e.preventDefault(); if (!f.title.trim()) { setError('Title required'); return; }
    setLoading(true);
    try { await onSubmit({ title: f.title.trim(), itemType: f.itemType, startTime: f.startTime || undefined, endTime: f.endTime || undefined, locationName: f.locationName || undefined, estimatedCost: f.estimatedCost ? parseFloat(f.estimatedCost) : 0, notes: f.notes || undefined }); }
    catch (err) { setError(err instanceof Error ? err.message : 'Failed'); }
    finally { setLoading(false); }
  }
  const inp = "w-full border border-slate-200 text-slate-800 bg-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-200";
  const TYPES: ItemType[] = ['FLIGHT','HOTEL','ACTIVITY','MEAL','TRANSPORT','FREE_TIME','OTHER'];
  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0.75rem', background: 'var(--color-ivory)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
      <div className="grid grid-cols-2 gap-2">
        <div><label className="text-xs text-slate-400">Title *</label><input value={f.title} onChange={e => set('title',e.target.value)} className={inp} placeholder="e.g. Visit Tokyo Tower" /></div>
        <div><label className="text-xs text-slate-400">Type</label>
          <select value={f.itemType} onChange={e => set('itemType',e.target.value as ItemType)} className={inp}>
            {TYPES.map(t => <option key={t} value={t}>{TYPE_EMOJI[t]} {t}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div><label className="text-xs text-slate-400">Start Time</label><input type="time" value={f.startTime} onChange={e => set('startTime',e.target.value)} className={inp} /></div>
        <div><label className="text-xs text-slate-400">End Time</label><input type="time" value={f.endTime} onChange={e => set('endTime',e.target.value)} className={inp} /></div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div><label className="text-xs text-slate-400">Location</label><input value={f.locationName} onChange={e => set('locationName',e.target.value)} className={inp} placeholder="Place name" /></div>
        <div><label className="text-xs text-slate-400">Est. Cost</label><input type="number" min="0" step="0.01" value={f.estimatedCost} onChange={e => set('estimatedCost',e.target.value)} className={inp} placeholder="0.00" /></div>
      </div>
      <div><label className="text-xs text-slate-400">Notes</label><input value={f.notes} onChange={e => set('notes',e.target.value)} className={inp} placeholder="Optional" /></div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-700 rounded-lg">Cancel</button>
        <button type="submit" disabled={loading} className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50">{loading ? 'Saving…' : 'Add Item'}</button>
      </div>
    </form>
  );
}

interface Props { days: ItineraryDay[]; tripId: string; onAddItem: (dayId: string, req: CreateItineraryItemRequest) => Promise<void>; onDeleteItem: (dayId: string, itemId: string) => Promise<void>; onDeleteDay: (dayId: string) => Promise<void>; onMoveItem: (dayId: string, items: { itemId: string; sortOrder: number }[]) => Promise<void>; }

export function ItineraryTimeline({ days, onAddItem, onDeleteItem, onDeleteDay: _onDeleteDay, onMoveItem }: Props) {
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const toggle = (id: string) => setCollapsed(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const moveUp = async (day: ItineraryDay, item: ItineraryItem) => {
    const idx = day.items.indexOf(item); if (idx === 0) return;
    const reordered = [...day.items]; [reordered[idx-1], reordered[idx]] = [reordered[idx], reordered[idx-1]];
    await onMoveItem(day.id, reordered.map((it, i) => ({ itemId: it.id, sortOrder: i })));
  };
  const moveDown = async (day: ItineraryDay, item: ItineraryItem) => {
    const idx = day.items.indexOf(item); if (idx === day.items.length-1) return;
    const reordered = [...day.items]; [reordered[idx], reordered[idx+1]] = [reordered[idx+1], reordered[idx]];
    await onMoveItem(day.id, reordered.map((it, i) => ({ itemId: it.id, sortOrder: i })));
  };
  if (days.length === 0) return <p className="text-slate-500 text-sm text-center py-8">No itinerary days yet.</p>;
  return (
    <div className="space-y-4">
      {days.map(day => (
        <div key={day.id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', cursor: 'pointer', borderBottom: '1px solid var(--color-border)' }} onClick={() => toggle(day.id)}>
            <span style={{ color: 'var(--color-ocean)', fontWeight: 700, fontSize: '0.875rem', minWidth: '3rem' }}>Day {day.dayNumber}</span>
            <span style={{ color: 'var(--color-navy)', fontSize: '0.875rem', fontWeight: 500, flex: 1 }}>{day.title ?? day.date}</span>
            <span style={{ color: 'var(--color-slate)', fontSize: '0.75rem' }}>{day.date}</span>
            <span style={{ color: 'var(--color-slate)', fontSize: '0.75rem' }}>{collapsed.has(day.id) ? '▸' : '▾'}</span>
          </div>
          {!collapsed.has(day.id) && (
            <div style={{ padding: '0 0.75rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '0.5rem' }}>
              {day.items.length === 0 && <p style={{ color: 'var(--color-slate)', fontSize: '0.75rem', textAlign: 'center', padding: '0.5rem 0' }}>No items yet</p>}
              {day.items.map((item, idx) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', padding: '0.5rem', background: 'var(--color-ivory)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '1rem', marginTop: '0.125rem' }}>{TYPE_EMOJI[item.itemType]}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-navy)' }}>{item.title}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>{item.startTime ? `${item.startTime}${item.endTime ? ` – ${item.endTime}` : ''}` : ''} {item.locationName ? `· ${item.locationName}` : ''}</p>
                    {item.estimatedCost > 0 && <p style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>{item.currency} {item.estimatedCost.toLocaleString()}</p>}
                  </div>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button onClick={() => moveUp(day, item)} disabled={idx === 0} style={{ padding: '0.25rem', color: 'var(--color-slate)', background: 'none', border: 'none', cursor: idx === 0 ? 'not-allowed' : 'pointer', opacity: idx === 0 ? 0.3 : 1, fontSize: '0.75rem' }} title="Move up" aria-label="Move item up">▲</button>
                    <button onClick={() => moveDown(day, item)} disabled={idx === day.items.length-1} style={{ padding: '0.25rem', color: 'var(--color-slate)', background: 'none', border: 'none', cursor: idx === day.items.length-1 ? 'not-allowed' : 'pointer', opacity: idx === day.items.length-1 ? 0.3 : 1, fontSize: '0.75rem' }} title="Move down" aria-label="Move item down">▼</button>
                    <button onClick={() => onDeleteItem(day.id, item.id)} style={{ padding: '0.25rem', color: 'var(--color-slate)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem' }} aria-label="Delete item">✕</button>
                  </div>
                </div>
              ))}
              {addingTo === day.id
                ? <ItemForm onSubmit={async req => { await onAddItem(day.id, req); setAddingTo(null); }} onCancel={() => setAddingTo(null)} />
                : <button onClick={() => setAddingTo(day.id)} style={{ width: '100%', fontSize: '0.75rem', color: 'var(--color-teal)', padding: '0.5rem', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-md)', background: 'none', cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s' }}>+ Add item to Day {day.dayNumber}</button>
              }
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
