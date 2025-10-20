/**
 * TypeScript type definitions for Airlines MVP
 * Constitutional compliance with accessibility and performance types
 */

// Core domain types
export interface Airport {
  code: string; // IATA 3-letter code
  name: string;
  city: string;
  country: string;
  timezone: string;
}

export interface FlightTime {
  airport: string; // IATA code
  city: string;
  time: string; // ISO 8601 format
  timezone?: string;
  gate?: string;
  terminal?: string;
}

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  airlineCode: string;
  departure: FlightTime;
  arrival: FlightTime;
  price: number;
  currency: string;
  duration: string; // Human readable (e.g., "4h 30m")
  durationMinutes: number;
  stops: number;
  aircraft: string;
  availableSeats: number;
  cabinClass: CabinClass;
  amenities?: string[];
  baggageIncluded?: boolean;
}

export type CabinClass = 'economy' | 'premium-economy' | 'business' | 'first';

export interface FlightSearchRequest {
  from: string; // IATA code
  to: string; // IATA code
  departure: string; // YYYY-MM-DD
  return?: string | null; // YYYY-MM-DD
  passengers: number;
  cabinClass: CabinClass;
  directOnly?: boolean;
  maxStops?: number;
  airlines?: string[]; // Airline codes to filter by
}

export interface FlightSearchResponse {
  flights: Flight[];
  totalResults: number;
  searchId: string;
  query: FlightSearchRequest;
  filters: SearchFilters;
}

export interface SearchFilters {
  priceRange: { min: number; max: number };
  departureTimeRange: { earliest: string; latest: string };
  airlines: string[];
  stops: number[];
  duration: { min: number; max: number }; // minutes
}

// Passenger and booking types
export interface Passenger {
  id?: string;
  type: 'adult' | 'child' | 'infant';
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email?: string;
  phone?: string;
  passportNumber?: string;
  passportExpiry?: string;
  nationality?: string;
  specialRequests?: string[];
}

export interface BookingRequest {
  flights: string[]; // Flight IDs
  passengers: Passenger[];
  contactInfo: {
    email: string;
    phone: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  seatPreferences?: SeatPreference[];
  specialRequests?: string[];
}

export interface SeatPreference {
  passengerId: string;
  flightId: string;
  seatType: 'window' | 'aisle' | 'middle' | 'any';
  location: 'front' | 'middle' | 'back' | 'any';
}

export interface Booking {
  id: string;
  confirmationCode: string;
  status: BookingStatus;
  flights: Flight[];
  passengers: Passenger[];
  totalPrice: number;
  currency: string;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus = 'pending' | 'authorized' | 'captured' | 'failed' | 'refunded';

// UI Component Props Types
export interface FlightCardProps {
  flight: Flight;
  onSelect: (flight: Flight) => void;
  isSelected?: boolean;
  showPrice?: boolean;
  compact?: boolean;
  'data-testid'?: string;
  // Accessibility props
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export interface SearchFormProps {
  onSearch: (request: FlightSearchRequest) => void;
  initialValues?: Partial<FlightSearchRequest>;
  isLoading?: boolean;
  airports: Airport[];
  // Accessibility props
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export interface FlightResultsProps {
  flights: Flight[];
  isLoading: boolean;
  error?: string | null;
  onFlightSelect: (flight: Flight) => void;
  selectedFlights: string[];
  filters: SearchFilters;
  onFiltersChange: (filters: Partial<SearchFilters>) => void;
  // Accessibility props
  'aria-label'?: string;
  'aria-live'?: 'off' | 'polite' | 'assertive';
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

// Form and Validation Types
export interface FormField<T = string> {
  value: T;
  error?: string;
  touched: boolean;
  required?: boolean;
  disabled?: boolean;
}

export interface FormState<T extends Record<string, unknown>> {
  fields: { [K in keyof T]: FormField<T[K]> };
  isValid: boolean;
  isSubmitting: boolean;
  submitAttempted: boolean;
}

export interface ValidationRule<T = string> {
  required?: boolean;
  pattern?: RegExp;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  custom?: (value: T) => string | null;
  message?: string;
}

// Performance Monitoring Types (Constitutional Compliance)
export interface PerformanceMetrics {
  lcp?: number; // Largest Contentful Paint
  cls?: number; // Cumulative Layout Shift
  fid?: number; // First Input Delay
  tti?: number; // Time to Interactive
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
  timestamp: number;
  route?: string;
}

export interface PerformanceBudget {
  lcp: number; // 2500ms target
  cls: number; // 0.1 target
  fid: number; // 100ms target
  tti: number; // 3800ms target
  bundleSize: number; // 244KB target
}

// Accessibility Types (Constitutional Compliance)
export interface AccessibilityProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-hidden'?: boolean;
  'aria-live'?: 'off' | 'polite' | 'assertive';
  'aria-atomic'?: boolean;
  'aria-busy'?: boolean;
  'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
  'aria-disabled'?: boolean;
  'aria-invalid'?: boolean | 'grammar' | 'spelling';
  'aria-pressed'?: boolean;
  'aria-selected'?: boolean;
  role?: string;
  tabIndex?: number;
}

export interface FocusManagement {
  focusableElements: HTMLElement[];
  currentIndex: number;
  trapFocus: boolean;
  returnFocus?: HTMLElement;
}

// Application State Types
export interface AppState {
  user: UserState;
  search: SearchState;
  booking: BookingState;
  ui: UIState;
  performance: PerformanceState;
}

export interface UserState {
  isAuthenticated: boolean;
  profile?: UserProfile;
  preferences: UserPreferences;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  frequentFlyerNumbers?: Record<string, string>; // airline code -> number
}

export interface UserPreferences {
  cabinClass: CabinClass;
  seatPreference: 'window' | 'aisle' | 'any';
  mealPreference?: string;
  accessibility: AccessibilityPreferences;
  notifications: NotificationPreferences;
}

export interface AccessibilityPreferences {
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  announcements: boolean;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  flightUpdates: boolean;
  promotions: boolean;
}

export interface SearchState {
  currentRequest?: FlightSearchRequest;
  results?: FlightSearchResponse;
  isLoading: boolean;
  error?: string | null;
  history: FlightSearchRequest[];
}

export interface BookingState {
  currentBooking?: Partial<BookingRequest>;
  selectedFlights: Flight[];
  passengers: Passenger[];
  isProcessing: boolean;
  error?: string | null;
  confirmationCode?: string;
}

export interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  modal?: {
    type: string;
    props?: Record<string, unknown>;
  };
  notifications: Notification[];
  loading: Record<string, boolean>;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  duration?: number;
  action?: {
    label: string;
    handler: () => void;
  };
}

export interface PerformanceState {
  metrics: PerformanceMetrics[];
  budgetViolations: string[];
  isMonitoring: boolean;
}

// Route and Navigation Types
export interface RouteParams {
  '/': Record<string, never>;
  '/search': {
    from?: string;
    to?: string;
    departure?: string;
    return?: string;
    passengers?: string;
    class?: string;
  };
  '/flights': {
    searchId: string;
  };
  '/booking': {
    flightIds: string;
  };
  '/confirmation': {
    bookingId: string;
  };
}

export type RouteKey = keyof RouteParams;

export interface NavigationState {
  currentRoute: RouteKey;
  previousRoute?: RouteKey;
  params: Record<string, string>;
  query: Record<string, string>;
}

// Event Types
export interface FlightSelectedEvent {
  flight: Flight;
  searchId: string;
  timestamp: number;
}

export interface SearchPerformedEvent {
  request: FlightSearchRequest;
  resultCount: number;
  timestamp: number;
  duration: number;
}

export interface BookingCreatedEvent {
  booking: Booking;
  timestamp: number;
}

// Utility Types
export type Nullable<T> = T | null;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = 
  Pick<T, Exclude<keyof T, Keys>> & 
  { [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>> }[Keys];

// Component Ref Types
export type ComponentRef<T extends React.ComponentType<unknown>> = React.ComponentRef<T>;

// Generic Event Handler Types
export type EventHandler<T = Event> = (event: T) => void;
export type ChangeHandler<T = string> = (value: T) => void;
export type SubmitHandler<T extends Record<string, unknown>> = (data: T) => void | Promise<void>;

// Async State Types
export interface AsyncState<T> {
  data?: T;
  loading: boolean;
  error?: string | null;
}

export type AsyncAction<T> = 
  | { type: 'loading' }
  | { type: 'success'; payload: T }
  | { type: 'error'; payload: string };

// Test Helper Types
export interface MockFlight extends Partial<Flight> {
  id: string;
  flightNumber: string;
}

export interface TestingProps {
  'data-testid'?: string;
  'data-test-state'?: string;
}

// Import React for component types
import * as React from 'react';