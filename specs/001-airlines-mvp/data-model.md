# Data Model: Airlines MVP

**Created**: 2025-10-20
**Feature**: Airlines MVP data structures and validation rules

## Core Entities

### Flight

Represents a single flight option available for booking.

**Fields**:
- `id: string` - Unique flight identifier (required)
- `carrier: string` - Airline code/name (required, 2-3 characters)
- `flightNo: string` - Flight number (required, format: carrier + digits)
- `origin: string` - Departure airport code (required, 3 characters IATA)
- `destination: string` - Arrival airport code (required, 3 characters IATA)
- `departISO: string` - Departure time in ISO 8601 format (required)
- `arriveISO: string` - Arrival time in ISO 8601 format (required)
- `durationMin: number` - Flight duration in minutes (required, positive integer)
- `stops: number` - Number of stops (required, 0 for direct flights)
- `fareEUR: number` - Fare price in EUR (required, positive number with 2 decimal precision)

**Validation Rules**:
- `carrier`: Must match pattern `/^[A-Z]{2,3}$/`
- `flightNo`: Must match pattern `/^[A-Z]{2,3}\d{3,4}$/`
- `origin` and `destination`: Must be different, match pattern `/^[A-Z]{3}$/`
- `departISO` and `arriveISO`: Valid ISO 8601 datetime, arrival after departure
- `durationMin`: Must be reasonable (30 ≤ durationMin ≤ 1440)
- `stops`: Integer between 0 and 3
- `fareEUR`: Positive number, maximum 2 decimal places

**State Transitions**: None (read-only for MVP)

### SearchCriteria

Represents user input for flight search parameters.

**Fields**:
- `origin: string` - Departure airport code (required)
- `destination: string` - Arrival airport code (required)
- `departureDate: string` - Departure date in YYYY-MM-DD format (required)
- `returnDate?: string` - Return date in YYYY-MM-DD format (optional)
- `passengers: number` - Number of passengers (required, default: 1)
- `cabin: CabinClass` - Cabin class preference (required, default: 'economy')
- `tripType: 'oneway' | 'return'` - Trip type (derived from returnDate presence)

**Validation Rules**:
- `origin` and `destination`: Must be different, 3-character IATA codes
- `departureDate`: Must be today or future date
- `returnDate`: If provided, must be same day or after departure date
- `passengers`: Integer between 1 and 9
- `cabin`: Must be one of predefined CabinClass values
- Form-level: All required fields must be present

**State Transitions**:
1. Initial → Validating (on form submit)
2. Validating → Valid (all rules pass)
3. Validating → Invalid (validation errors found)
4. Valid → Searching (API call initiated)

### SearchResults

Represents the outcome of a flight search operation.

**Fields**:
- `criteria: SearchCriteria` - Original search parameters
- `flights: Flight[]` - Matching flights (can be empty)
- `searchedAt: string` - ISO timestamp of search execution
- `totalResults: number` - Total number of flights found
- `status: SearchStatus` - Current search state

**Validation Rules**:
- `flights`: Must be valid Flight objects
- `totalResults`: Must match flights array length
- `status`: Must be valid SearchStatus value
- `searchedAt`: Must be valid ISO 8601 timestamp

**State Transitions**:
1. Loading → Success (flights found)
2. Loading → Empty (no flights match criteria)
3. Loading → Error (search failed)

## Supporting Types

### CabinClass
Enumeration of available cabin classes:
- `'economy'` - Economy class (default)
- `'premium'` - Premium economy  
- `'business'` - Business class
- `'first'` - First class

### SearchStatus
Enumeration of search operation states:
- `'idle'` - No search performed
- `'loading'` - Search in progress
- `'success'` - Search completed successfully
- `'empty'` - Search completed, no results
- `'error'` - Search failed

### ValidationError
Error information for form validation:
- `field: string` - Field name with error
- `message: string` - User-friendly error message
- `code: string` - Error code for programmatic handling

## Data Relationships

```
SearchCriteria ---(1:1)---> SearchResults
SearchResults ---(1:N)---> Flight[]
SearchCriteria ---(validation)---> ValidationError[]
```

## Mock Data Schema

The flight data in `src/api/data/flights.json` follows this structure:

```typescript
{
  "flights": Flight[],
  "airports": {
    [airportCode: string]: {
      "name": string,
      "city": string,
      "country": string
    }
  },
  "carriers": {
    [carrierCode: string]: {
      "name": string,
      "logo": string
    }
  }
}
```

**Data Constraints**:
- Minimum 20 flights covering popular European routes
- At least 3 different carriers represented
- Mix of direct and connecting flights (0-2 stops)
- Variety of departure times throughout the day
- Realistic flight durations and pricing
- Airport codes must be real IATA codes