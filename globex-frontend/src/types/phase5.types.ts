// ─────────────────────────────────────────────────────────────────────────────
// Phase 5 TypeScript types — Flight, Hotel, Activity search
// ─────────────────────────────────────────────────────────────────────────────

export interface OfferPrice {
  amount: number;
  currency: string;
}

// ─── Flights ─────────────────────────────────────────────────────────────────

export interface FlightSegment {
  departureAirportCode: string;
  departureAirportName: string;
  departureCityName: string;
  arrivalAirportCode: string;
  arrivalAirportName: string;
  arrivalCityName: string;
  departureTime: string;   // ISO-8601
  arrivalTime: string;
  durationMinutes: number;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  aircraft: string | null;
}

export interface FlightOffer {
  offerId: string;
  provider: string;
  airline: string;
  airlineCode: string;
  airlineLogoUrl: string | null;
  totalPrice: OfferPrice;
  baseFare: OfferPrice;
  taxAmount: OfferPrice;
  cabinClass: string;
  cabinClassDisplay: string;
  stops: number;
  totalDurationMinutes: number;
  outboundSegments: FlightSegment[];
  returnSegments: FlightSegment[] | null;
  baggageAllowance: string;
  refundable: boolean;
  changeable: boolean;
  fareConditions: string;
  retrievedAt: string;
  isTestData: boolean;
}

export interface FlightSearchFilters {
  minPrice: number;
  maxPrice: number;
  priceCurrency: string;
  minDurationMinutes: number;
  maxDurationMinutes: number;
  airlines: string[];
  stopCounts: number[];
  cabinClasses: string[];
}

export interface FlightSearchResponse {
  searchId: string;
  provider: string;
  isTestData: boolean;
  dataNotice: string | null;
  totalResults: number;
  sortBy: string;
  offers: FlightOffer[];
  searchedAt: string;
  availableFilters: FlightSearchFilters;
}

export interface FlightSearchRequest {
  origin: string;
  destination: string;
  departureDate: string;       // YYYY-MM-DD
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  cabinClass: string;
  currency: string;
  sortBy: string;
  maxPrice?: number;
}

// ─── Hotels ──────────────────────────────────────────────────────────────────

export interface HotelOffer {
  hotelId: string;
  provider: string;
  name: string;
  description: string;
  stars: number;
  guestRating: number | null;
  location: string;
  address: string;
  latitude: number;
  longitude: number;
  amenities: string[];
  mainImageUrl: string | null;
  additionalImages: string[];
  roomType: string;
  pricePerNight: OfferPrice;
  totalPrice: OfferPrice;
  cancellationPolicy: string;
  freeCancellation: boolean;
  breakfastIncluded: boolean;
  checkIn: string;
  checkOut: string;
  nights: number;
  retrievedAt: string;
  isTestData: boolean;
}

export interface HotelSearchFilters {
  minPricePerNight: number;
  maxPricePerNight: number;
  priceCurrency: string;
  minStars: number;
  maxStars: number;
  amenities: string[];
  hasFreeBreakfast: boolean;
  hasFreeCancellation: boolean;
}

export interface HotelSearchResponse {
  searchId: string;
  provider: string;
  isTestData: boolean;
  dataNotice: string | null;
  totalResults: number;
  sortBy: string;
  hotels: HotelOffer[];
  searchedAt: string;
  availableFilters: HotelSearchFilters;
}

export interface HotelSearchRequest {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
  currency: string;
  sortBy: string;
  minStars?: number;
  maxPrice?: number;
}

// ─── Activities ──────────────────────────────────────────────────────────────

export interface ActivityOffer {
  activityId: string;
  provider: string;
  name: string;
  shortDescription: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  durationDisplay: string;
  durationMinutes: number;
  pricePerPerson: OfferPrice;
  rating: number | null;
  reviewCount: number;
  bookingLink: string;
  pictures: string[];
  cancellationPolicy: string;
  freeCancellation: boolean;
  inclusions: string[];
  exclusions: string[];
  lastUpdated: string;
  isTestData: boolean;
}

export interface ActivitySearchResponse {
  searchId: string;
  provider: string;
  isTestData: boolean;
  dataNotice: string | null;
  totalResults: number;
  sortBy: string;
  activities: ActivityOffer[];
  searchedAt: string;
}

export interface ActivitySearchRequest {
  destination: string;
  latitude: number;
  longitude: number;
  category?: string;
  participants: number;
  currency: string;
  sortBy: string;
}

// ─── Location Autocomplete ────────────────────────────────────────────────────

export interface LocationSuggestion {
  iataCode: string;
  name: string;
  cityName: string;
  countryCode: string;
  countryName: string;
  type: string;
}

// ─── Search History ───────────────────────────────────────────────────────────

export interface SearchHistoryItem {
  id: string;
  userId: string;
  searchType: 'FLIGHT' | 'HOTEL' | 'ACTIVITY';
  origin: string | null;
  destination: string;
  searchParams: Record<string, unknown>;
  resultCount: number;
  provider: string;
  createdAt: string;
}

export type SortOption = 'CHEAPEST' | 'FASTEST' | 'BEST' | 'EARLIEST' | 'RATING' | 'PRICE_ASC' | 'PRICE_DESC' | 'RECOMMENDED';
export type CabinClass = 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
export type ActivityCategory = 'ALL' | 'SIGHTSEEING' | 'TOURS' | 'FOOD' | 'ADVENTURE' | 'MUSEUMS' | 'NATURE' | 'CULTURAL' | 'WELLNESS' | 'FAMILY' | 'HISTORICAL';
