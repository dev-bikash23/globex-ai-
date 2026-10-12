// =============================================================================
// Phase 6 — Trip Builder Types
// NOTE: These represent PLANNED trips, not confirmed bookings
// =============================================================================

export type TripStatus = 'PLANNING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'ARCHIVED';
export type TravelerType = 'ADULT' | 'CHILD' | 'INFANT';
export type OfferStatus = 'SELECTED' | 'EXPIRED' | 'REMOVED';
export type ActivityStatus = 'PLANNED' | 'REMOVED' | 'EXPIRED';
export type ItemType = 'FLIGHT' | 'HOTEL' | 'ACTIVITY' | 'MEAL' | 'TRANSPORT' | 'FREE_TIME' | 'OTHER';
export type ExpenseCategory = 'FLIGHT' | 'HOTEL' | 'ACTIVITY' | 'FOOD' | 'TRANSPORT' | 'SHOPPING' | 'MISCELLANEOUS';

export interface DestinationInfo {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  cityName?: string;
  countryName?: string;
}

export interface Trip {
  id: string;
  userId: string;
  destinationId?: string;
  destination?: DestinationInfo;
  title: string;
  description?: string;
  startDate: string;   // YYYY-MM-DD
  endDate: string;     // YYYY-MM-DD
  status: TripStatus;
  currency: string;
  budgetLimit?: number;
  coverImageUrl?: string;
  durationDays: number;
  travelerCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TripSummary {
  id: string;
  title: string;
  destinationName?: string;
  destinationSlug?: string;
  destinationImageUrl?: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
  currency: string;
  budgetLimit?: number;
  travelerCount: number;
  flightCount: number;
  hotelCount: number;
  activityCount: number;
  itineraryDayCount: number;
  plannedTotal: number;
  actualTotal: number;
}

export interface TripListResponse {
  upcoming: TripSummary[];
  planning: TripSummary[];
  past: TripSummary[];
  totalCount: number;
}

export interface TripTraveler {
  id: string;
  tripId: string;
  firstName?: string;
  lastName?: string;
  travelerType: TravelerType;
  createdAt: string;
}

export interface TripFlight {
  id: string;
  tripId: string;
  provider: string;
  providerOfferId: string;
  origin: string;
  destination: string;
  departureTime?: string;
  arrivalTime?: string;
  airline?: string;
  cabinClass?: string;
  priceAmount: number;
  currency: string;
  status: OfferStatus;
  statusNote: string;
  lastValidatedAt?: string;
  createdAt: string;
}

export interface TripHotel {
  id: string;
  tripId: string;
  provider: string;
  providerOfferId: string;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  roomType?: string;
  priceAmount: number;
  currency: string;
  status: OfferStatus;
  statusNote: string;
  lastValidatedAt?: string;
  createdAt: string;
}

export interface TripActivity {
  id: string;
  tripId: string;
  provider?: string;
  providerOfferId?: string;
  activityName: string;
  activityDate?: string;
  startTime?: string;
  durationMinutes?: number;
  priceAmount: number;
  currency: string;
  category?: string;
  status: ActivityStatus;
  createdAt: string;
}

export interface ItineraryItem {
  id: string;
  dayId: string;
  title: string;
  description?: string;
  itemType: ItemType;
  startTime?: string;
  endTime?: string;
  locationName?: string;
  latitude?: number;
  longitude?: number;
  estimatedCost: number;
  currency: string;
  sortOrder: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ItineraryDay {
  id: string;
  tripId: string;
  dayNumber: number;
  date: string;
  title?: string;
  notes?: string;
  items: ItineraryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ItineraryResponse {
  tripId: string;
  totalDays: number;
  days: ItineraryDay[];
}

export interface TripExpense {
  id: string;
  tripId: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  currency: string;
  expenseDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetSummary {
  tripId: string;
  currency: string;
  budgetLimit?: number;
  plannedFlights: number;
  plannedHotels: number;
  plannedActivities: number;
  plannedTotal: number;
  actualTotal: number;
  remaining?: number;
  actualByCategory: Record<string, number>;
  isOverBudget: boolean;
  currencyNote: string;
}

// ── Request shapes ────────────────────────────────────────────────────────────
export interface CreateTripRequest {
  destinationId?: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  currency: string;
  budgetLimit?: number;
}

export interface UpdateTripRequest extends CreateTripRequest {
  coverImageUrl?: string;
}

export interface AddTravelerRequest {
  firstName?: string;
  lastName?: string;
  travelerType: TravelerType;
}

export interface AttachFlightRequest {
  provider: string;
  providerOfferId: string;
  origin: string;
  destination: string;
  departureTime?: string;
  arrivalTime?: string;
  airline?: string;
  cabinClass?: string;
  priceAmount: number;
  currency: string;
}

export interface AttachHotelRequest {
  provider: string;
  providerOfferId: string;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  roomType?: string;
  priceAmount: number;
  currency: string;
}

export interface AttachActivityRequest {
  provider?: string;
  providerOfferId?: string;
  activityName: string;
  activityDate?: string;
  startTime?: string;
  durationMinutes?: number;
  priceAmount?: number;
  currency?: string;
  category?: string;
}

export interface CreateItineraryDayRequest {
  dayNumber: number;
  date: string;
  title?: string;
  notes?: string;
}

export interface CreateItineraryItemRequest {
  title: string;
  description?: string;
  itemType: ItemType;
  startTime?: string;
  endTime?: string;
  locationName?: string;
  latitude?: number;
  longitude?: number;
  estimatedCost?: number;
  currency?: string;
  sortOrder?: number;
  notes?: string;
}

export interface CreateExpenseRequest {
  category: ExpenseCategory;
  description: string;
  amount: number;
  currency: string;
  expenseDate?: string;
  notes?: string;
}
