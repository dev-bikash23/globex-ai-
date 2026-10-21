import { useState, useCallback } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import LocationAutocomplete from '../../components/search/LocationAutocomplete';
import TravelerSelector from '../../components/search/TravelerSelector';
import FlightResultsList from '../../components/flights/FlightResultsList';
import FlightFilters from '../../components/flights/FlightFilters';
import HotelResultsList from '../../components/hotels/HotelResultsList';
import ActivityResultsList from '../../components/activities/ActivityResultsList';
import { useFlightSearch } from '../../hooks/useFlightSearch';
import { useHotelSearch } from '../../hooks/useHotelSearch';
import { useActivitySearch } from '../../hooks/useActivitySearch';
import type { LocationSuggestion, FlightOffer, CabinClass } from '../../types/phase5.types';

type Tab = 'flights' | 'hotels' | 'activities';

const today = () => new Date().toISOString().split('T')[0];
const inDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
};

const TAB_CONFIG = [
  { key: 'flights' as Tab,    icon: '✈️', label: 'Flights' },
  { key: 'hotels' as Tab,     icon: '🏨', label: 'Hotels' },
  { key: 'activities' as Tab, icon: '🎟️', label: 'Activities' },
];

/** Reusable label style for the light search page */
const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'var(--color-slate)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: '0.4rem',
};

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState<Tab>('flights');

  // ── Flight form state ────────────────────────────────────────────
  const [origin, setOrigin]                     = useState('');
  const [, setOriginSugg]                       = useState<LocationSuggestion | null>(null);
  const [dest, setDest]                         = useState('');
  const [, setDestSugg]                         = useState<LocationSuggestion | null>(null);
  const [depDate, setDepDate]                   = useState(inDays(14));
  const [retDate, setRetDate]                   = useState('');
  const [isRound, setIsRound]                   = useState(false);
  const [adults, setAdults]                     = useState(1);
  const [children, setChildren]                 = useState(0);
  const [infants, setInfants]                   = useState(0);
  const [cabinClass, setCabinClass]             = useState<CabinClass>('ECONOMY');
  const [flightSort, setFlightSort]             = useState('CHEAPEST');
  const [stopFilter, setStopFilter]             = useState<number[]>([]);
  const [airlineFilter, setAirlineFilter]       = useState<string[]>([]);
  const [maxPriceFilter, setMaxPriceFilter]     = useState(99999);
  const [filtersInitialized, setFiltersInitialized] = useState(false);

  // ── Hotel form state ─────────────────────────────────────────────
  const [hotelDest, setHotelDest]   = useState('');
  const [checkIn, setCheckIn]       = useState(inDays(14));
  const [checkOut, setCheckOut]     = useState(inDays(17));
  const [hotelAdults, setHotelAdults] = useState(2);
  const [hotelRooms, setHotelRooms]   = useState(1);
  const [hotelSort, setHotelSort]     = useState('RECOMMENDED');

  // ── Activity form state ──────────────────────────────────────────
  const [actDest, setActDest]               = useState('');
  const [actCategory, setActCategory]       = useState('ALL');
  const [actParticipants, setActParticipants] = useState(2);

  // ── Hooks ────────────────────────────────────────────────────────
  const flightSearch = useFlightSearch();
  const hotelSearch  = useHotelSearch();
  const actSearch    = useActivitySearch();

  const handleFlightSearch = useCallback(() => {
    if (!origin || !dest || !depDate) return;
    setStopFilter([]);
    setAirlineFilter([]);
    setFiltersInitialized(false);
    flightSearch.search({
      origin, destination: dest,
      departureDate: depDate,
      returnDate: isRound && retDate ? retDate : undefined,
      adults, children, infants,
      cabinClass, currency: 'USD', sortBy: flightSort,
    }).then(() => {});
  }, [origin, dest, depDate, retDate, isRound, adults, children, infants, cabinClass, flightSort, flightSearch]);

  const fr = flightSearch.response;
  if (fr && fr.availableFilters && !filtersInitialized) {
    setMaxPriceFilter(Math.ceil(fr.availableFilters.maxPrice));
    setFiltersInitialized(true);
  }

  const filteredOffers: FlightOffer[] = fr?.offers?.filter(o => {
    const price     = Number(o.totalPrice.amount);
    const passStops   = stopFilter.length === 0 || stopFilter.includes(o.stops);
    const passAirline = airlineFilter.length === 0 || airlineFilter.includes(o.airline);
    const passPrice   = price <= maxPriceFilter;
    return passStops && passAirline && passPrice;
  }) ?? [];

  const toggleStop    = (s: number) => setStopFilter(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const toggleAirline = (a: string) => setAirlineFilter(p => p.includes(a) ? p.filter(x => x !== a) : [...p, a]);

  const handleHotelSearch = useCallback(() => {
    if (!hotelDest || !checkIn || !checkOut) return;
    hotelSearch.search({ destination: hotelDest, checkIn, checkOut, adults: hotelAdults, children: 0, rooms: hotelRooms, currency: 'USD', sortBy: hotelSort });
  }, [hotelDest, checkIn, checkOut, hotelAdults, hotelRooms, hotelSort, hotelSearch]);

  const handleActSearch = useCallback(() => {
    if (!actDest) return;
    actSearch.search({ destination: actDest, latitude: 0, longitude: 0, category: actCategory === 'ALL' ? undefined : actCategory, participants: actParticipants, currency: 'USD', sortBy: 'RATING' });
  }, [actDest, actCategory, actParticipants, actSearch]);

  /* ── Shared input style for light theme ───────────────────────── */
  const fieldInput: React.CSSProperties = {
    width: '100%',
    background: 'var(--color-surface)',
    border: '1.5px solid var(--color-border-strong)',
    borderRadius: 'var(--radius-md)',
    padding: '0.75rem 1rem',
    color: 'var(--color-text)',
    fontSize: '0.9375rem',
    fontFamily: 'var(--font-sans)',
    outline: 'none',
    transition: 'border-color 0.15s',
    colorScheme: 'light',
  };

  const searchBtnStyle = (color: string): React.CSSProperties => ({
    width: '100%',
    padding: '0.875rem',
    borderRadius: 'var(--radius-md)',
    background: color,
    color: '#fff',
    border: 'none',
    fontWeight: 700,
    fontSize: '0.9375rem',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    marginTop: '0.25rem',
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-ivory)' }}>
      <Navbar variant="solid" />

      {/* padding for fixed nav */}
      <div style={{ paddingTop: 'var(--nav-height)' }}>

        {/* ── Page Hero ─────────────────────────────────────────── */}
        <section style={{ background: 'var(--color-navy)', padding: '3rem 0 2.5rem', color: '#fff' }}>
          <div className="gx-container">
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Travel Search
            </p>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 600, marginBottom: '0.5rem' }}>
              Search Travel Worldwide
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', maxWidth: '480px' }}>
              Find flights, hotels, and activities for your next adventure.
            </p>

            {/* Tab switcher inside hero */}
            <div style={{ display: 'flex', gap: '0.25rem', marginTop: '2rem', background: 'rgba(255,255,255,0.08)', borderRadius: 'var(--radius-lg)', padding: '0.25rem', width: 'fit-content' }}>
              {TAB_CONFIG.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.6rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    background: activeTab === tab.key ? 'var(--color-teal)' : 'transparent',
                    color: activeTab === tab.key ? '#fff' : 'rgba(255,255,255,0.6)',
                    fontWeight: 600, fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Search Forms & Results ─────────────────────────────── */}
        <div className="gx-container" style={{ padding: '2rem 1.5rem 4rem' }}>

          {/* ════════ FLIGHTS TAB ════════ */}
          {activeTab === 'flights' && (
            <div>
              {/* Form */}
              <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.75rem', marginBottom: '2rem', boxShadow: 'var(--shadow-md)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <LocationAutocomplete id="flight-origin" label="From" placeholder="City or airport (e.g. DEL)"
                    value={origin} onChange={(code, s) => { setOrigin(code); setOriginSugg(s); }} />
                  <LocationAutocomplete id="flight-dest" label="To" placeholder="City or airport (e.g. LHR)"
                    value={dest} onChange={(code, s) => { setDest(code); setDestSugg(s); }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label style={labelStyle}>Departure</label>
                    <input type="date" value={depDate} min={today()} onChange={e => setDepDate(e.target.value)} style={fieldInput} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <label style={{ ...labelStyle, marginBottom: 0 }}>Return</label>
                      <button type="button" onClick={() => setIsRound(!isRound)}
                        style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '9999px', border: `1px solid ${isRound ? 'var(--color-teal)' : 'var(--color-border-strong)'}`, background: isRound ? 'rgba(60,147,137,0.08)' : 'transparent', color: isRound ? 'var(--color-teal)' : 'var(--color-muted)', cursor: 'pointer', fontWeight: 600 }}>
                        {isRound ? 'Round' : '+ Return'}
                      </button>
                    </div>
                    <input type="date" value={retDate} min={depDate} disabled={!isRound} onChange={e => setRetDate(e.target.value)} style={{ ...fieldInput, opacity: isRound ? 1 : 0.4 }} />
                  </div>
                  <TravelerSelector adults={adults} children={children} infants={infants}
                    onChange={(a, c, i) => { setAdults(a); setChildren(c); setInfants(i); }} />
                  <div>
                    <label style={labelStyle}>Cabin</label>
                    <select value={cabinClass} onChange={e => setCabinClass(e.target.value as CabinClass)} style={{ ...fieldInput, cursor: 'pointer', colorScheme: 'light' }}>
                      <option value="ECONOMY">Economy</option>
                      <option value="PREMIUM_ECONOMY">Premium Economy</option>
                      <option value="BUSINESS">Business</option>
                      <option value="FIRST">First</option>
                    </select>
                  </div>
                </div>

                <button onClick={handleFlightSearch} disabled={!origin || !dest || !depDate || flightSearch.isLoading}
                  style={{ ...searchBtnStyle('var(--color-ocean)'), opacity: (!origin || !dest || !depDate || flightSearch.isLoading) ? 0.5 : 1, cursor: (!origin || !dest || !depDate || flightSearch.isLoading) ? 'not-allowed' : 'pointer' }}>
                  {flightSearch.isLoading
                    ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><span className="spinner" style={{ width: '1rem', height: '1rem', borderWidth: '2px', borderColor: 'rgba(255,255,255,0.4)', borderTopColor: '#fff' }} /> Searching flights…</span>
                    : '✈️  Search Flights'}
                </button>
              </div>

              {/* Results + Filters */}
              {(!!fr || flightSearch.isLoading || flightSearch.error) && (
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                  {fr?.availableFilters && (
                    <div style={{ width: 240, flexShrink: 0, display: 'none' }} className="lg-block">
                      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', position: 'sticky', top: 88 }}>
                        <h3 style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: '0.9rem', marginBottom: '1rem' }}>Filters</h3>
                        <FlightFilters filters={fr.availableFilters} selectedStops={stopFilter} selectedAirlines={airlineFilter}
                          maxPriceFilter={maxPriceFilter} onStopToggle={toggleStop} onAirlineToggle={toggleAirline} onMaxPriceChange={setMaxPriceFilter} />
                      </div>
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <FlightResultsList response={fr} isLoading={flightSearch.isLoading} error={flightSearch.error}
                      sortBy={flightSort} onSortChange={setFlightSort} filteredOffers={fr ? filteredOffers : undefined} />
                  </div>
                </div>
              )}

              {!fr && !flightSearch.isLoading && !flightSearch.error && (
                <FlightResultsList response={null} isLoading={false} error={null} sortBy={flightSort} onSortChange={setFlightSort} />
              )}
            </div>
          )}

          {/* ════════ HOTELS TAB ════════ */}
          {activeTab === 'hotels' && (
            <div>
              <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.75rem', marginBottom: '2rem', boxShadow: 'var(--shadow-md)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={labelStyle}>Destination</label>
                    <input type="text" value={hotelDest} onChange={e => setHotelDest(e.target.value)}
                      placeholder="City, e.g. London, Paris…" style={fieldInput} />
                  </div>
                  <div>
                    <label style={labelStyle}>Check-in</label>
                    <input type="date" value={checkIn} min={today()} onChange={e => setCheckIn(e.target.value)} style={fieldInput} />
                  </div>
                  <div>
                    <label style={labelStyle}>Check-out</label>
                    <input type="date" value={checkOut} min={checkIn} onChange={e => setCheckOut(e.target.value)} style={fieldInput} />
                  </div>
                  <div>
                    <label style={labelStyle}>Adults</label>
                    <input type="number" value={hotelAdults} min={1} max={20} onChange={e => setHotelAdults(Number(e.target.value))} style={fieldInput} />
                  </div>
                  <div>
                    <label style={labelStyle}>Rooms</label>
                    <input type="number" value={hotelRooms} min={1} max={9} onChange={e => setHotelRooms(Number(e.target.value))} style={fieldInput} />
                  </div>
                </div>
                <button onClick={handleHotelSearch} disabled={!hotelDest || !checkIn || !checkOut || hotelSearch.isLoading}
                  style={{ ...searchBtnStyle('var(--color-ocean)'), opacity: (!hotelDest || !checkIn || !checkOut || hotelSearch.isLoading) ? 0.5 : 1, cursor: (!hotelDest || !checkIn || !checkOut || hotelSearch.isLoading) ? 'not-allowed' : 'pointer' }}>
                  {hotelSearch.isLoading
                    ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><span className="spinner" style={{ width: '1rem', height: '1rem', borderWidth: '2px', borderColor: 'rgba(255,255,255,0.4)', borderTopColor: '#fff' }} /> Searching hotels…</span>
                    : '🏨  Search Hotels'}
                </button>
              </div>
              <HotelResultsList response={hotelSearch.response} isLoading={hotelSearch.isLoading} error={hotelSearch.error} sortBy={hotelSort} onSortChange={setHotelSort} />
            </div>
          )}

          {/* ════════ ACTIVITIES TAB ════════ */}
          {activeTab === 'activities' && (
            <div>
              <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.75rem', marginBottom: '2rem', boxShadow: 'var(--shadow-md)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Destination</label>
                    <input type="text" value={actDest} onChange={e => setActDest(e.target.value)}
                      placeholder="City, e.g. London, Tokyo…" style={fieldInput} />
                  </div>
                  <div>
                    <label style={labelStyle}>Participants</label>
                    <input type="number" value={actParticipants} min={1} max={50} onChange={e => setActParticipants(Number(e.target.value))} style={fieldInput} />
                  </div>
                </div>
                <button onClick={handleActSearch} disabled={!actDest || actSearch.isLoading}
                  style={{ ...searchBtnStyle('var(--color-teal)'), opacity: (!actDest || actSearch.isLoading) ? 0.5 : 1, cursor: (!actDest || actSearch.isLoading) ? 'not-allowed' : 'pointer' }}>
                  {actSearch.isLoading
                    ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><span className="spinner" style={{ width: '1rem', height: '1rem', borderWidth: '2px', borderColor: 'rgba(255,255,255,0.4)', borderTopColor: '#fff' }} /> Searching activities…</span>
                    : '🎟️  Search Activities'}
                </button>
              </div>
              <ActivityResultsList response={actSearch.response} isLoading={actSearch.isLoading} error={actSearch.error} activeCategory={actCategory} onCategoryChange={setActCategory} />
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
