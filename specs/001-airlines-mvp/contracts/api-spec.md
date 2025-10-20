# API Contracts: Airlines MVP

**Created**: 2025-10-20
**Feature**: Flight search API specifications

## Flight Search API

### searchFlights

**Purpose**: Search for flights matching user criteria from mock data

**Function Signature**:
```typescript
function searchFlights(criteria: SearchCriteria): Promise<SearchResults>
```

**Input Contract**:
```typescript
interface SearchCriteria {
  origin: string;          // 3-char IATA code (e.g., "AMS")
  destination: string;     // 3-char IATA code (e.g., "BCN")  
  departureDate: string;   // YYYY-MM-DD format (e.g., "2025-10-25")
  returnDate?: string;     // YYYY-MM-DD format, optional
  passengers: number;      // 1-9 passengers
  cabin: CabinClass;       // 'economy' | 'premium' | 'business' | 'first'
}
```

**Output Contract**:
```typescript
interface SearchResults {
  criteria: SearchCriteria;
  flights: Flight[];
  searchedAt: string;      // ISO 8601 timestamp
  totalResults: number;
  status: 'success' | 'empty' | 'error';
}

interface Flight {
  id: string;              // Unique identifier
  carrier: string;         // Airline code (e.g., "KL")
  flightNo: string;        // Flight number (e.g., "KL1234")
  origin: string;          // Departure airport
  destination: string;     // Arrival airport
  departISO: string;       // ISO 8601 datetime
  arriveISO: string;       // ISO 8601 datetime
  durationMin: number;     // Duration in minutes
  stops: number;           // Number of stops (0 = direct)
  fareEUR: number;         // Price in EUR
}
```

**Behavior Contract**:
- Filter flights by exact origin and destination match
- Filter flights by departure date (date-only, ignore time)
- Return flights must be in chronological order by departure time
- Return date filtering applies to return flights (future feature)
- Empty results return `status: 'empty'` with empty flights array
- Invalid input throws TypeError with validation details
- Processing time should be <50ms for realistic dataset sizes

**Error Conditions**:
```typescript
// Input validation errors
throw new TypeError('Invalid airport code: must be 3 characters')
throw new TypeError('Invalid date: must be YYYY-MM-DD format')  
throw new TypeError('Invalid passenger count: must be 1-9')

// Data integrity errors  
throw new Error('Flight data corrupted: missing required fields')
throw new Error('Airport code not found in reference data')
```

## URL Parameter API

### Flight Search URL Structure

**Purpose**: Encode/decode search parameters in URL for bookmarking and navigation

**URL Pattern**:
```
/results?origin={origin}&destination={destination}&departure={departureDate}&passengers={passengers}&cabin={cabin}[&return={returnDate}]
```

**Parameter Contracts**:
- `origin`: 3-character IATA code, uppercase, required
- `destination`: 3-character IATA code, uppercase, required  
- `departure`: Date in YYYY-MM-DD format, required
- `return`: Date in YYYY-MM-DD format, optional
- `passengers`: Integer 1-9, required
- `cabin`: One of 'economy', 'premium', 'business', 'first', required

**Validation Contract**:
```typescript
interface URLSearchParams {
  // All parameters as strings from URL
  origin?: string;
  destination?: string;
  departure?: string;
  return?: string;
  passengers?: string;
  cabin?: string;
}

function validateSearchParams(params: URLSearchParams): SearchCriteria | ValidationError[]
```

**Error Handling**:
- Missing required parameters → redirect to homepage with error message
- Invalid parameter values → show validation errors on results page
- Malformed URL → graceful fallback with clean URL

## Component Props API

### FlightSearch Component

**Purpose**: Flight search form with validation and submission

**Props Contract**:
```typescript
interface FlightSearchProps {
  onSearch: (criteria: SearchCriteria) => void;
  initialValues?: Partial<SearchCriteria>;
  isLoading?: boolean;
  errors?: ValidationError[];
}
```

### FlightCard Component  

**Purpose**: Display individual flight information with booking action

**Props Contract**:
```typescript
interface FlightCardProps {
  flight: Flight;
  onBook: (flightId: string) => void;
  isSelected?: boolean;
  showPrice?: boolean;
}
```

### Results Page Props

**Props Contract**:
```typescript
interface ResultsProps {
  // Props derived from URL parameters and search execution
  searchCriteria: SearchCriteria;
  searchResults: SearchResults;
  onModifySearch: () => void;
  onBookFlight: (flightId: string) => void;
}
```

## Accessibility Contracts

### ARIA Announcements

**Live Region Contract**:
```typescript
interface LiveRegionAnnouncements {
  searchStarted: "Searching for flights...";
  searchComplete: `Found ${count} flights` | "No flights found";
  searchError: "Search failed. Please try again.";
  validationError: `Error in ${fieldName}: ${message}`;
}
```

**Focus Management Contract**:
- Form submission → Focus moves to loading indicator
- Results loaded → Focus moves to results heading (`h1`)
- Validation errors → Focus moves to first error field
- Route navigation → Focus moves to main content heading

### Keyboard Navigation Contract

**Flight Results**:
- Tab: Enter results area (focus on heading)
- Arrow Down/Up: Navigate between flight cards
- Enter/Space: Activate "Book" button on focused flight
- Escape: Return focus to search form modification

**Form Controls**:
- Tab/Shift+Tab: Move between form fields
- Enter: Submit form (from any field)
- Escape: Clear current field (when focused)

## Performance Contracts

### Loading Time Targets

```typescript
interface PerformanceTargets {
  searchFlights: '<50ms';           // Mock API response time
  formValidation: '<100ms';         // Real-time validation feedback  
  routeTransition: '<200ms';        // Navigation between pages
  initialPageLoad: '<2.5s';         // LCP target
  focusManagement: '<16ms';         // Next frame for screen readers
}
```

### Bundle Size Contracts

```typescript
interface BundleTargets {
  initialChunk: '<50KB';            // App shell + Home route
  resultsChunk: '<30KB';            // Results page + components  
  flightSearchComponent: '<5KB';     // Individual component
  mockDataSize: '<10KB';            // flights.json file size
}
```