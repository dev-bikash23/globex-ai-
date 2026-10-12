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
  const inp = "w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500";
  const TYPES: ItemType[] = ['FLIGHT','HOTEL','ACTIVITY','MEAL','TRANSPORT','FREE_TIME','OTHER'];
  return (
    <form onSubmit={submit} className="space-y-3 p-3 bg-slate-800/80 border border-slate-700 rounded-xl">
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

export function ItineraryTimeline({ days, onAddItem, onDeleteItem, onDeleteDay, onMoveItem }: Props) {
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
        <div key={day.id} className="bg-slate-800/50 border border-slate-700/60 rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-700/30" onClick={() => toggle(day.id)}>
            <span className="text-blue-400 font-bold text-sm min-w-[3rem]">Day {day.dayNumber}</span>
            <span className="text-slate-200 text-sm font-medium flex-1">{day.title ?? day.date}</span>
            <span className="text-slate-500 text-xs">{day.date}</span>
            <span className="text-slate-500 text-xs">{collapsed.has(day.id) ? '▸' : '▾'}</span>
          </div>
          {!collapsed.has(day.id) && (
            <div className="px-3 pb-3 space-y-2 border-t border-slate-700/40 pt-2">
              {day.items.length === 0 && <p className="text-slate-600 text-xs py-2 text-center">No items yet</p>}
              {day.items.map((item, idx) => (
                <div key={item.id} className="flex items-start gap-2 py-1.5 px-2 bg-slate-700/30 rounded-lg group">
                  <span className="text-base mt-0.5">{TYPE_EMOJI[item.itemType]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">{item.title}</p>
                    <p className="text-xs text-slate-400">{item.startTime ? `${item.startTime}${item.endTime ? ` – ${item.endTime}` : ''}` : ''} {item.locationName ? `· ${item.locationName}` : ''}</p>
                    {item.estimatedCost > 0 && <p className="text-xs text-slate-400">{item.currency} {item.estimatedCost.toLocaleString()}</p>}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => moveUp(day, item)} disabled={idx === 0} className="p-1 text-slate-500 hover:text-slate-300 disabled:opacity-30 text-xs" title="Move up" aria-label="Move item up">▲</button>
                    <button onClick={() => moveDown(day, item)} disabled={idx === day.items.length-1} className="p-1 text-slate-500 hover:text-slate-300 disabled:opacity-30 text-xs" title="Move down" aria-label="Move item down">▼</button>
                    <button onClick={() => onDeleteItem(day.id, item.id)} className="p-1 text-slate-500 hover:text-red-400 text-xs" aria-label="Delete item">✕</button>
                  </div>
                </div>
              ))}
              {addingTo === day.id
                ? <ItemForm onSubmit={async req => { await onAddItem(day.id, req); setAddingTo(null); }} onCancel={() => setAddingTo(null)} />
                : <button onClick={() => setAddingTo(day.id)} className="w-full text-xs text-slate-500 hover:text-blue-400 py-2 border border-dashed border-slate-700 rounded-lg hover:border-blue-500/40 transition-colors">+ Add item to Day {day.dayNumber}</button>
              }
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
