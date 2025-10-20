/**
 * Flight API Service - Amadeus Travel API Integration
 * Constitutional compliance: Security by design, proper error handling
 */

// API Configuration
const AMADEUS_API_BASE = 'https://test.api.amadeus.com/v2';
const AMADEUS_AUTH_URL = 'https://test.api.amadeus.com/v1/security/oauth2/token';

// Environment variables for API keys (to be set in deployment)
const API_CONFIG = {
  clientId: import.meta.env.VITE_AMADEUS_CLIENT_ID || '',
  clientSecret: import.meta.env.VITE_AMADEUS_CLIENT_SECRET || '',
  isDevelopment: import.meta.env.MODE === 'development'
};

// Types for API responses
export interface FlightOffer {
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: Itinerary[];
  price: Price;
  pricingOptions: PricingOptions;
  validatingAirlineCodes: string[];
  travelerPricings: TravelerPricing[];
}

export interface Itinerary {
  duration: string;
  segments: FlightSegment[];
}

export interface FlightSegment {
  departure: LocationInfo;
  arrival: LocationInfo;
  carrierCode: string;
  number: string;
  aircraft: {
    code: string;
  };
  operating?: {
    carrierCode: string;
  };
  duration: string;
  id: string;
  numberOfStops: number;
  blacklistedInEU: boolean;
}

export interface LocationInfo {
  iataCode: string;
  terminal?: string;
  at: string;
}

export interface Price {
  currency: string;
  total: string;
  base: string;
  fees?: Fee[];
  grandTotal: string;
}

export interface Fee {
  amount: string;
  type: string;
}

export interface PricingOptions {
  fareType: string[];
  includedCheckedBagsOnly: boolean;
}

export interface TravelerPricing {
  travelerId: string;
  fareOption: string;
  travelerType: string;
  price: Price;
  fareDetailsBySegment: FareDetails[];
}

export interface FareDetails {
  segmentId: string;
  cabin: string;
  fareBasis: string;
  brandedFare?: string;
  class: string;
  includedCheckedBags?: {
    quantity: number;
  };
}

export interface FlightSearchParams {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  travelClass?: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  includedAirlineCodes?: string[];
  excludedAirlineCodes?: string[];
  nonStop?: boolean;
  currencyCode?: string;
  maxPrice?: number;
  max?: number;
}

// Authentication token management
let accessToken: string | null = null;
let tokenExpiry: number | null = null;

/**
 * Get or refresh Amadeus access token
 */
async function getAccessToken(): Promise<string> {
  // Check if we have a valid token
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  // If no API credentials, fall back to mock data
  if (!API_CONFIG.clientId || !API_CONFIG.clientSecret) {
    console.warn('Amadeus API credentials not configured, using mock data');
    throw new Error('API_CREDENTIALS_MISSING');
  }

  try {
    const response = await fetch(AMADEUS_AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: API_CONFIG.clientId,
        client_secret: API_CONFIG.clientSecret,
      }),
    });

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.status}`);
    }

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Refresh 1 min early

    return accessToken!;
  } catch (error) {
    console.error('Failed to get access token:', error);
    throw new Error('AUTHENTICATION_FAILED');
  }
}

/**
 * Search for flight offers using Amadeus API
 */
export async function searchFlights(params: FlightSearchParams): Promise<FlightOffer[]> {
  try {
    const token = await getAccessToken();

    const searchParams = new URLSearchParams({
      originLocationCode: params.originLocationCode,
      destinationLocationCode: params.destinationLocationCode,
      departureDate: params.departureDate,
      adults: params.adults.toString(),
      ...(params.returnDate && { returnDate: params.returnDate }),
      ...(params.children && { children: params.children.toString() }),
      ...(params.infants && { infants: params.infants.toString() }),
      ...(params.travelClass && { travelClass: params.travelClass }),
      ...(params.nonStop && { nonStop: params.nonStop.toString() }),
      ...(params.currencyCode && { currencyCode: params.currencyCode }),
      ...(params.maxPrice && { maxPrice: params.maxPrice.toString() }),
      max: (params.max || 10).toString(),
    });

    const response = await fetch(`${AMADEUS_API_BASE}/shopping/flight-offers?${searchParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Flight search failed: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Flight search error:', error);
    
    // Fall back to mock data if API fails
    if (error instanceof Error && 
        (error.message === 'API_CREDENTIALS_MISSING' || 
         error.message === 'AUTHENTICATION_FAILED' ||
         API_CONFIG.isDevelopment)) {
      return getMockFlightData(params);
    }
    
    throw error;
  }
}

/**
 * Enhanced mock data generator for development/fallback
 */
function getMockFlightData(params: FlightSearchParams): FlightOffer[] {
  const airlines = [
    { code: 'AA', name: 'American Airlines' },
    { code: 'DL', name: 'Delta Air Lines' },
    { code: 'UA', name: 'United Airlines' },
    { code: 'BA', name: 'British Airways' },
    { code: 'LH', name: 'Lufthansa' },
  ];

  const mockOffers: FlightOffer[] = [];

  for (let i = 0; i < 5; i++) {
    const airline = airlines[i % airlines.length];
    const basePrice = 200 + Math.random() * 800;
    const departureTime = new Date(params.departureDate);
    departureTime.setHours(6 + i * 3, Math.random() * 60);
    
    const arrivalTime = new Date(departureTime);
    arrivalTime.setHours(arrivalTime.getHours() + 3 + Math.random() * 8);

    mockOffers.push({
      id: `mock-offer-${i}`,
      source: 'GDS',
      instantTicketingRequired: false,
      nonHomogeneous: false,
      oneWay: !params.returnDate,
      lastTicketingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      numberOfBookableSeats: Math.floor(Math.random() * 9) + 1,
      itineraries: [{
        duration: `PT${Math.floor(3 + Math.random() * 8)}H${Math.floor(Math.random() * 60)}M`,
        segments: [{
          departure: {
            iataCode: params.originLocationCode,
            at: departureTime.toISOString(),
          },
          arrival: {
            iataCode: params.destinationLocationCode,
            at: arrivalTime.toISOString(),
          },
          carrierCode: airline.code,
          number: `${Math.floor(Math.random() * 9000) + 1000}`,
          aircraft: {
            code: '32A',
          },
          duration: `PT${Math.floor(3 + Math.random() * 8)}H${Math.floor(Math.random() * 60)}M`,
          id: `mock-segment-${i}`,
          numberOfStops: 0,
          blacklistedInEU: false,
        }],
      }],
      price: {
        currency: params.currencyCode || 'USD',
        total: basePrice.toFixed(2),
        base: (basePrice * 0.8).toFixed(2),
        fees: [{
          amount: (basePrice * 0.1).toFixed(2),
          type: 'SUPPLIER',
        }],
        grandTotal: basePrice.toFixed(2),
      },
      pricingOptions: {
        fareType: ['PUBLISHED'],
        includedCheckedBagsOnly: true,
      },
      validatingAirlineCodes: [airline.code],
      travelerPricings: [{
        travelerId: '1',
        fareOption: 'STANDARD',
        travelerType: 'ADULT',
        price: {
          currency: params.currencyCode || 'USD',
          total: basePrice.toFixed(2),
          base: (basePrice * 0.8).toFixed(2),
          grandTotal: basePrice.toFixed(2),
        },
        fareDetailsBySegment: [{
          segmentId: `mock-segment-${i}`,
          cabin: params.travelClass || 'ECONOMY',
          fareBasis: 'Y',
          class: 'Y',
          includedCheckedBags: {
            quantity: 1,
          },
        }],
      }],
    });
  }

  return mockOffers;
}

// Airport search result type
export interface AirportLocation {
  type: string;
  subType: string;
  name: string;
  detailedName?: string;
  id: string;
  self?: {
    href: string;
    methods: string[];
  };
  timeZoneOffset?: string;
  iataCode: string;
  geoCode?: {
    latitude: number;
    longitude: number;
  };
  address?: {
    cityName: string;
    cityCode?: string;
    countryName: string;
    countryCode: string;
    stateCode?: string;
    regionCode?: string;
  };
  analytics?: {
    travelers: {
      score: number;
    };
  };
}

/**
 * Get airport information (for autocomplete and validation)
 */
export async function searchAirports(keyword: string): Promise<AirportLocation[]> {
  try {
    const token = await getAccessToken();

    const response = await fetch(
      `${AMADEUS_API_BASE}/reference-data/locations?subType=AIRPORT,CITY&keyword=${encodeURIComponent(keyword)}&page%5Blimit%5D=10`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Airport search failed: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Airport search error:', error);
    
    // Fall back to common airports
    const commonAirports: AirportLocation[] = [
      { type: 'location', subType: 'AIRPORT', id: 'JFK', iataCode: 'JFK', name: 'John F. Kennedy International Airport', address: { cityName: 'New York', countryName: 'United States', countryCode: 'US' } },
      { type: 'location', subType: 'AIRPORT', id: 'LAX', iataCode: 'LAX', name: 'Los Angeles International Airport', address: { cityName: 'Los Angeles', countryName: 'United States', countryCode: 'US' } },
      { type: 'location', subType: 'AIRPORT', id: 'ORD', iataCode: 'ORD', name: "O'Hare International Airport", address: { cityName: 'Chicago', countryName: 'United States', countryCode: 'US' } },
      { type: 'location', subType: 'AIRPORT', id: 'MIA', iataCode: 'MIA', name: 'Miami International Airport', address: { cityName: 'Miami', countryName: 'United States', countryCode: 'US' } },
      { type: 'location', subType: 'AIRPORT', id: 'SFO', iataCode: 'SFO', name: 'San Francisco International Airport', address: { cityName: 'San Francisco', countryName: 'United States', countryCode: 'US' } },
      { type: 'location', subType: 'AIRPORT', id: 'BOS', iataCode: 'BOS', name: 'Logan International Airport', address: { cityName: 'Boston', countryName: 'United States', countryCode: 'US' } },
      { type: 'location', subType: 'AIRPORT', id: 'SEA', iataCode: 'SEA', name: 'Seattle-Tacoma International Airport', address: { cityName: 'Seattle', countryName: 'United States', countryCode: 'US' } },
      { type: 'location', subType: 'AIRPORT', id: 'DEN', iataCode: 'DEN', name: 'Denver International Airport', address: { cityName: 'Denver', countryName: 'United States', countryCode: 'US' } },
    ];

    return commonAirports.filter(airport => 
      airport.name.toLowerCase().includes(keyword.toLowerCase()) ||
      airport.address?.cityName.toLowerCase().includes(keyword.toLowerCase()) ||
      airport.iataCode.toLowerCase().includes(keyword.toLowerCase())
    );
  }
}