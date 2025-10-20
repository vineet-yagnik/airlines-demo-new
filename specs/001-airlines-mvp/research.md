# Research: Airlines MVP

**Created**: 2025-10-20
**Feature**: Airlines MVP - React + TypeScript flight search application

## Technology Decisions

### Decision: React Router for Client-Side Routing
**Rationale**: React Router provides declarative routing that integrates seamlessly with React's component model. Supports accessibility features like focus management during navigation, essential for screen readers. Lightweight (~13KB gzipped) and maintains URL state for bookmarkable searches.

**Alternatives considered**: 
- Next.js App Router: Rejected due to MVP simplicity requirements and server-side complexity
- Reach Router: Deprecated and merged into React Router
- Manual history API: Too complex for accessibility requirements

### Decision: Vitest for Testing Framework
**Rationale**: Native Vite integration eliminates configuration overhead. ES modules support matches our TypeScript setup. Faster test execution than Jest (~2-5x). Compatible with React Testing Library for component testing.

**Alternatives considered**:
- Jest: Rejected due to ES modules complexity and slower performance
- Playwright: Overkill for MVP scope, adds unnecessary bundle overhead
- Cypress: Component testing not mature enough for our timeline

### Decision: Minimal CSS with Custom Properties
**Rationale**: Avoids CSS-in-JS bundle overhead while supporting design tokens via custom properties. Enables RTL support through CSS logical properties. Maintains performance budget by eliminating runtime styling calculations.

**Alternatives considered**:
- Styled-components: Rejected due to 17KB bundle impact and runtime cost
- Tailwind CSS: Rejected due to purging complexity and learning curve
- CSS Modules: Rejected due to Vite configuration requirements

### Decision: Mock JSON Data with Static Import
**Rationale**: Zero network overhead for search operations. Predictable performance characteristics. Eliminates external dependencies and API rate limiting concerns. Easy to extend with more realistic data patterns.

**Alternatives considered**:
- REST API simulation: Rejected due to network latency introducing performance variability
- GraphQL mock: Overkill for simple data structure requirements
- LocalStorage: Rejected due to synchronous I/O impact on performance

## Accessibility Research

### Decision: aria-live Regions for Dynamic Content
**Rationale**: Screen reader users need announcements for search loading states and results. Polite announcements avoid interrupting form completion. Live regions work across all major screen readers (NVDA, JAWS, VoiceOver).

**Implementation pattern**: 
- Search loading: "Searching for flights..." (polite)
- Results loaded: "Found X flights" (polite)  
- Errors: "Search failed, please try again" (assertive)

### Decision: Roving Tabindex for Flight Cards
**Rationale**: Arrow key navigation within search results improves efficiency for keyboard users. Follows ARIA authoring practices for grid patterns. Reduces tab stops from potentially 20+ to 1 per results group.

**Implementation pattern**:
- Initial focus on results heading after navigation
- Arrow keys move between flight cards
- Enter/Space activates booking action
- Tab moves to next major page section

## Performance Research

### Decision: Route-Based Code Splitting
**Rationale**: Keeps initial bundle minimal by loading routes on demand. React.lazy + Suspense provides loading states. Vite handles chunk optimization automatically.

**Bundle targets**:
- Initial chunk: <50KB (App shell + Home route)
- Results chunk: <30KB (Results + FlightCard components)
- Booking chunk: <20KB (Placeholder page)

### Decision: Date-fns for Formatting (Tree-shakeable)
**Rationale**: Only import specific functions needed (format, parseISO). Smaller bundle impact than moment.js (2-3KB vs 69KB). Native Intl.DateTimeFormat requires more polyfills for older browsers.

**Alternatives considered**:
- Intl.DateTimeFormat: Rejected due to Safari 13 inconsistencies
- moment.js: Rejected due to bundle size impact
- day.js: Smaller but less TypeScript support

## Security Research

### Decision: Client-Side Input Validation with Sanitization
**Rationale**: Immediate user feedback improves UX while preventing XSS through proper escaping. DOMPurify handles edge cases in user-generated content (future-proofing for reviews/comments).

**Validation strategy**:
- Required fields: Immediate feedback on blur
- Date validation: Logical checks (departure < return, no past dates)
- Text sanitization: Escape HTML entities in all user inputs
- URL parameter validation: Whitelist allowed values, reject malformed

## Component Architecture Research

### Decision: Compound Components for FlightSearch
**Rationale**: Makes form fields independently testable while maintaining cohesive validation state. Follows React patterns for accessibility (shared ARIA labels/descriptions). Easier to implement progressive enhancement.

**Structure**:
```
FlightSearch/
├── FlightSearch.tsx        # Container with validation logic
├── OriginDestination.tsx   # Airport selection fields
├── DatePicker.tsx          # Date selection with validation
├── PassengerCabin.tsx      # Passenger count and cabin class
└── FlightSearch.test.tsx   # Component integration tests
```

### Decision: Custom Hooks for Business Logic
**Rationale**: Separates stateful logic from UI concerns. Makes business rules independently testable. Follows React best practices for reusability and composition.

**Hooks planned**:
- `useFlightSearch`: Form state management and validation
- `useFlightResults`: Search execution and results management
- `useFocusManagement`: Accessibility focus handling
- `usePerformanceMonitor`: Core Web Vitals tracking

## Integration Patterns

### Decision: URL State Management for Search Parameters
**Rationale**: Enables bookmarkable searches and browser back/forward support. URLSearchParams provides native parsing. React Router useSearchParams hook simplifies integration.

**URL structure**: `/results?origin=AMS&destination=BCN&departure=2025-10-25&passengers=2&cabin=economy`

### Decision: Error Boundaries for Route-Level Error Handling
**Rationale**: Graceful degradation when route components fail. Maintains accessibility by ensuring screen readers announce error states. Provides consistent error UX across all routes.

**Implementation**: One error boundary per route with fallback UI and retry mechanism.