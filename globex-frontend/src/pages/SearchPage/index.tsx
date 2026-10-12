import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import LocationAutocomplete from '../../components/search/LocationAutocomplete';
import TravelerSelector from '../../components/search/TravelerSelector';
import FlightResultsList from '../../components/flights/FlightResultsList';
import FlightFilters from '../../components/flights/FlightFilters';
import HotelResultsList from '../../components/hotels/HotelResultsList';
import ActivityResultsList from '../../components/activities/ActivityResultsList';
import { useFlightSearch } from '../../hooks/useFlightSearch';
import { useHotelSearch } from '../../hooks/useHotelSearch';
import { useActivitySearch } from '../../hooks/useActivitySearch';
import type {
  LocationSuggestion,
  FlightOffer,
  CabinClass,
} from '../../types/phase5.types';

type Tab = 'flights' | 'hotels' | 'activities';

const today = () => new Date().toISOString().split('T')[0];
const inDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
};

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState<Tab>('flights');

  // ── Flight form state ─────────────────────────────────────────────────────
  const [origin, setOrigin] = useState('');
  const [originSugg, setOriginSugg] = useState<LocationSuggestion | null>(null);
  const [dest, setDest] = useState('');
  const [destSugg, setDestSugg] = useState<LocationSuggestion | null>(null);
  const [depDate, setDepDate] = useState(inDays(14));
  const [retDate, setRetDate] = useState('');
  const [isRound, setIsRound] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabinClass, setCabinClass] = useState<CabinClass>('ECONOMY');
  const [flightSort, setFlightSort] = useState('CHEAPEST');
  const [stopFilter, setStopFilter] = useState<number[]>([]);
  const [airlineFilter, setAirlineFilter] = useState<string[]>([]);
  const [maxPriceFilter, setMaxPriceFilter] = useState(99999);
  const [filtersInitialized, setFiltersInitialized] = useState(false);

  // ── Hotel form state ───────────────────────────────────────────────────────
  const [hotelDest, setHotelDest] = useState('');
  const [checkIn, setCheckIn] = useState(inDays(14));
  const [checkOut, setCheckOut] = useState(inDays(17));
  const [hotelAdults, setHotelAdults] = useState(2);
  const [hotelRooms, setHotelRooms] = useState(1);
  const [hotelSort, setHotelSort] = useState('RECOMMENDED');

  // ── Activity form state ────────────────────────────────────────────────────
  const [actDest, setActDest] = useState('');
  const [actCategory, setActCategory] = useState('ALL');
  const [actParticipants, setActParticipants] = useState(2);

  // ── Hooks ─────────────────────────────────────────────────────────────────
  const flightSearch = useFlightSearch();
  const hotelSearch  = useHotelSearch();
  const actSearch    = useActivitySearch();

  // ── Flight search submit ──────────────────────────────────────────────────
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

  // Initialize price filter when results arrive
  const fr = flightSearch.response;
  if (fr && fr.availableFilters && !filtersInitialized) {
    setMaxPriceFilter(Math.ceil(fr.availableFilters.maxPrice));
    setFiltersInitialized(true);
  }

  // Client-side filtering of flight offers
  const filteredOffers: FlightOffer[] = fr?.offers?.filter(o => {
    const price = Number(o.totalPrice.amount);
    const passStops = stopFilter.length === 0 || stopFilter.includes(o.stops);
    const passAirline = airlineFilter.length === 0 || airlineFilter.includes(o.airline);
    const passPrice = price <= maxPriceFilter;
    return passStops && passAirline && passPrice;
  }) ?? [];

  const toggleStop = (s: number) =>
    setStopFilter(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const toggleAirline = (a: string) =>
    setAirlineFilter(p => p.includes(a) ? p.filter(x => x !== a) : [...p, a]);

  // ── Hotel search submit ───────────────────────────────────────────────────
  const handleHotelSearch = useCallback(() => {
    if (!hotelDest || !checkIn || !checkOut) return;
    hotelSearch.search({
      destination: hotelDest, checkIn, checkOut,
      adults: hotelAdults, children: 0, rooms: hotelRooms,
      currency: 'USD', sortBy: hotelSort,
    });
  }, [hotelDest, checkIn, checkOut, hotelAdults, hotelRooms, hotelSort, hotelSearch]);

  // ── Activity search submit ────────────────────────────────────────────────
  const handleActSearch = useCallback(() => {
    if (!actDest) return;
    actSearch.search({
      destination: actDest,
      latitude: destSugg?.iataCode ? 0 : 0,
      longitude: 0,
      category: actCategory === 'ALL' ? undefined : actCategory,
      participants: actParticipants,
      currency: 'USD', sortBy: 'RATING',
    });
  }, [actDest, actCategory, actParticipants, actSearch, destSugg]);

  const TAB_CONFIG = [
    { key: 'flights' as Tab,    icon: '✈️', label: 'Flights' },
    { key: 'hotels' as Tab,     icon: '🏨', label: 'Hotels' },
    { key: 'activities' as Tab, icon: '🎟️', label: 'Activities' },
  ];

  const hasFlightResults = !!fr;
  const hasHotelResults  = !!hotelSearch.response;
  const hasActResults    = !!actSearch.response;

  return (
    <div className="min-h-screen" style={{ background: '#080c14' }}>
      {/* Top Nav */}
      <nav className="sticky top-0 z-30 border-b border-white/5 px-6 py-3"
           style={{ background: 'rgba(8,12,20,0.92)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400
                            flex items-center justify-center text-sm font-bold text-white shadow-lg">
              G
            </div>
            <span className="font-bold text-white text-lg">GlobeX <span className="text-blue-400">AI</span></span>
          </Link>
          <Link to="/" className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-1">
            ← Back to Destinations
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative py-14 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-cyan-600/15 blur-3xl" />
        </div>
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30
                          bg-blue-500/10 text-blue-400 text-xs font-semibold mb-5">
            ✈️ Real Flight Search · 🏨 Hotel Discovery · 🎟️ Activity Finder
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Search
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent"> Travel </span>
            Worldwide
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Find flights, hotels, and activities for your next adventure — all in one place.
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="px-6 max-w-7xl mx-auto mb-6">
        <div className="flex gap-1 p-1.5 rounded-2xl bg-white/4 border border-white/8 w-fit">
          {TAB_CONFIG.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                          transition-all duration-300
                ${activeTab === tab.key
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pb-16 max-w-7xl mx-auto">

        {/* ── FLIGHTS TAB ── */}
        {activeTab === 'flights' && (
          <div>
            {/* Search Form */}
            <div className="rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm p-5 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <LocationAutocomplete
                  id="flight-origin"
                  label="From"
                  placeholder="City or airport (e.g. DEL)"
                  value={origin}
                  onChange={(code, s) => { setOrigin(code); setOriginSugg(s); }}
                />
                <LocationAutocomplete
                  id="flight-dest"
                  label="To"
                  placeholder="City or airport (e.g. LHR)"
                  value={dest}
                  onChange={(code, s) => { setDest(code); setDestSugg(s); }}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">
                    Departure
                  </label>
                  <input
                    type="date"
                    value={depDate}
                    min={today()}
                    onChange={e => setDepDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm
                               focus:outline-none focus:border-blue-500/60 transition-all"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Return</label>
                    <button
                      type="button"
                      onClick={() => setIsRound(!isRound)}
                      className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                        isRound ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                                : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'
                      }`}
                    >
                      {isRound ? 'Round' : '+ Return'}
                    </button>
                  </div>
                  <input
                    type="date"
                    value={retDate}
                    min={depDate}
                    disabled={!isRound}
                    onChange={e => setRetDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm
                               disabled:opacity-40 focus:outline-none focus:border-blue-500/60 transition-all"
                  />
                </div>
                <TravelerSelector
                  adults={adults} children={children} infants={infants}
                  onChange={(a, c, i) => { setAdults(a); setChildren(c); setInfants(i); }}
                />
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Cabin</label>
                  <select
                    value={cabinClass}
                    onChange={e => setCabinClass(e.target.value as CabinClass)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm
                               focus:outline-none focus:border-blue-500/60 transition-all cursor-pointer"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="ECONOMY">Economy</option>
                    <option value="PREMIUM_ECONOMY">Premium Economy</option>
                    <option value="BUSINESS">Business</option>
                    <option value="FIRST">First</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleFlightSearch}
                disabled={!origin || !dest || !depDate || flightSearch.isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600
                           hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-base
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-300 shadow-lg shadow-blue-500/20"
              >
                {flightSearch.isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Searching Duffel...
                  </span>
                ) : '✈️ Search Flights'}
              </button>
            </div>

            {/* Results + Filters */}
            {(hasFlightResults || flightSearch.isLoading || flightSearch.error) && (
              <div className="flex gap-6">
                {/* Filters Sidebar */}
                {fr && fr.availableFilters && (
                  <div className="hidden lg:block w-60 shrink-0">
                    <div className="rounded-2xl border border-white/8 bg-white/3 p-4 sticky top-20">
                      <h2 className="text-sm font-bold text-white mb-4">🔧 Filters</h2>
                      <FlightFilters
                        filters={fr.availableFilters}
                        selectedStops={stopFilter}
                        selectedAirlines={airlineFilter}
                        maxPriceFilter={maxPriceFilter}
                        onStopToggle={toggleStop}
                        onAirlineToggle={toggleAirline}
                        onMaxPriceChange={setMaxPriceFilter}
                      />
                    </div>
                  </div>
                )}

                {/* Results */}
                <div className="flex-1 min-w-0">
                  <FlightResultsList
                    response={fr}
                    isLoading={flightSearch.isLoading}
                    error={flightSearch.error}
                    sortBy={flightSort}
                    onSortChange={setFlightSort}
                    filteredOffers={fr ? filteredOffers : undefined}
                  />
                </div>
              </div>
            )}

            {!hasFlightResults && !flightSearch.isLoading && !flightSearch.error && (
              <FlightResultsList
                response={null} isLoading={false} error={null}
                sortBy={flightSort} onSortChange={setFlightSort}
              />
            )}
          </div>
        )}

        {/* ── HOTELS TAB ── */}
        {activeTab === 'hotels' && (
          <div>
            <div className="rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm p-5 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Destination</label>
                  <input
                    type="text"
                    value={hotelDest}
                    onChange={e => setHotelDest(e.target.value)}
                    placeholder="City, e.g. London, Paris, Delhi..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white
                               placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/60 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Check-in</label>
                  <input
                    type="date" value={checkIn} min={today()}
                    onChange={e => setCheckIn(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm
                               focus:outline-none focus:border-blue-500/60 transition-all"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Check-out</label>
                  <input
                    type="date" value={checkOut} min={checkIn}
                    onChange={e => setCheckOut(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm
                               focus:outline-none focus:border-blue-500/60 transition-all"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Adults</label>
                  <input
                    type="number" value={hotelAdults} min={1} max={20}
                    onChange={e => setHotelAdults(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm
                               focus:outline-none focus:border-blue-500/60 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Rooms</label>
                  <input
                    type="number" value={hotelRooms} min={1} max={9}
                    onChange={e => setHotelRooms(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm
                               focus:outline-none focus:border-blue-500/60 transition-all"
                  />
                </div>
              </div>
              <button
                onClick={handleHotelSearch}
                disabled={!hotelDest || !checkIn || !checkOut || hotelSearch.isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600
                           hover:from-blue-500 hover:to-violet-500 text-white font-bold text-base
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-300 shadow-lg shadow-blue-500/20"
              >
                {hotelSearch.isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Searching hotels...
                  </span>
                ) : '🏨 Search Hotels'}
              </button>
            </div>

            <HotelResultsList
              response={hotelSearch.response}
              isLoading={hotelSearch.isLoading}
              error={hotelSearch.error}
              sortBy={hotelSort}
              onSortChange={setHotelSort}
            />
          </div>
        )}

        {/* ── ACTIVITIES TAB ── */}
        {activeTab === 'activities' && (
          <div>
            <div className="rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm p-5 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Destination</label>
                  <input
                    type="text"
                    value={actDest}
                    onChange={e => setActDest(e.target.value)}
                    placeholder="City, e.g. London, Tokyo, Dubai, Delhi..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white
                               placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/60 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Participants</label>
                  <input
                    type="number" value={actParticipants} min={1} max={50}
                    onChange={e => setActParticipants(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm
                               focus:outline-none focus:border-blue-500/60 transition-all"
                  />
                </div>
              </div>
              <button
                onClick={handleActSearch}
                disabled={!actDest || actSearch.isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600
                           hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-base
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-300 shadow-lg shadow-blue-500/20"
              >
                {actSearch.isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Searching activities...
                  </span>
                ) : '🎟️ Search Activities'}
              </button>
            </div>

            <ActivityResultsList
              response={actSearch.response}
              isLoading={actSearch.isLoading}
              error={actSearch.error}
              activeCategory={actCategory}
              onCategoryChange={setActCategory}
            />
          </div>
        )}
      </div>
    </div>
  );
}
