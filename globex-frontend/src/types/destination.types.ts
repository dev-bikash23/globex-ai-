export interface Country {
  id: string;
  code: string;
  name: string;
  officialName?: string;
  continent: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  currencyCode?: string;
  primaryLanguage?: string;
  flagEmoji?: string;
}

export interface City {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  country: Country;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  description?: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  featured: boolean;
  city: City;
  country: Country;
}

export interface DestinationSummary {
  id: string;
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
  featured: boolean;
  countryName: string;
  countryCode: string;
  flagEmoji?: string;
}

export interface FavoriteResponse {
  id: string;
  destinationId: string;
  destinationName: string;
  destinationSlug: string;
  latitude: number;
  longitude: number;
  countryName: string;
  flagEmoji?: string;
  imageUrl?: string;
  savedAt: string;
}

export interface ApiPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
