# Quickstart: Airlines MVP

**Created**: 2025-10-20
**Feature**: Airlines MVP development and testing guide

## Development Setup

### Prerequisites
- Node.js 18+ (for Vite and React 19 support)
- npm or yarn package manager
- VS Code with TypeScript extension (recommended)

### Initial Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Verify Constitution Compliance Tools**
   ```bash
   # Install accessibility testing
   npm install --save-dev @axe-core/react jest-axe
   
   # Install performance monitoring  
   npm install web-vitals
   
   # Verify bundle analyzer is available
   npm install --save-dev rollup-plugin-analyzer
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   Application should be available at `http://localhost:5173`

### Project Structure Verification

Ensure the following structure exists:
```
src/
├── app/                # ✅ Application shell
├── routes/             # ✅ Page components  
├── components/         # ✅ Reusable components
├── api/                # ✅ Mock data layer
├── lib/                # ✅ Utilities and types
└── index.css          # ✅ Global styles
```

## Development Workflow

### 1. Component Development (Test-First)

**For each new component:**

1. **Create test file first**
   ```bash
   # Example: FlightSearch component
   touch src/components/FlightSearch/FlightSearch.test.tsx
   ```

2. **Write failing tests**
   ```typescript
   // FlightSearch.test.tsx
   import { render, screen } from '@testing-library/react';
   import { FlightSearch } from './FlightSearch';
   
   describe('FlightSearch', () => {
     test('renders all required form fields', () => {
       render(<FlightSearch onSearch={jest.fn()} />);
       
       expect(screen.getByLabelText(/origin/i)).toBeInTheDocument();
       expect(screen.getByLabelText(/destination/i)).toBeInTheDocument();
       // Add more assertions...
     });
   });
   ```

3. **Run tests to verify failure**
   ```bash
   npm test FlightSearch.test.tsx
   ```

4. **Implement component to pass tests**
   ```typescript
   // FlightSearch.tsx - implement minimal version
   export function FlightSearch({ onSearch }) {
     return (
       <form>
         <label htmlFor="origin">Origin</label>
         <input id="origin" type="text" />
         {/* Add other fields... */}
       </form>
     );
   }
   ```

5. **Verify tests pass and add accessibility tests**
   ```typescript
   import { axe, toHaveNoViolations } from 'jest-axe';
   expect.extend(toHaveNoViolations);
   
   test('has no accessibility violations', async () => {
     const { container } = render(<FlightSearch onSearch={jest.fn()} />);
     const results = await axe(container);
     expect(results).toHaveNoViolations();
   });
   ```

### 2. Route Development

**For each route component:**

1. **Setup route in App.tsx**
   ```typescript
   import { BrowserRouter, Routes, Route } from 'react-router-dom';
   
   function App() {
     return (
       <BrowserRouter>
         <Routes>
           <Route path="/" element={<Home />} />
           <Route path="/results" element={<Results />} />
           <Route path="/booking" element={<Booking />} />
         </Routes>
       </BrowserRouter>
     );
   }
   ```

2. **Test route navigation**
   ```typescript
   test('navigates to results page on form submission', async () => {
     const user = userEvent.setup();
     render(<App />);
     
     // Fill form and submit
     await user.type(screen.getByLabelText(/origin/i), 'AMS');
     await user.click(screen.getByRole('button', { name: /search/i }));
     
     expect(screen.getByRole('heading', { name: /flight results/i })).toBeInTheDocument();
   });
   ```

### 3. API Development

**Mock data setup:**

1. **Create mock flight data**
   ```json
   // src/api/data/flights.json
   {
     "flights": [
       {
         "id": "flight-1",
         "carrier": "KL",
         "flightNo": "KL1234",
         "origin": "AMS",
         "destination": "BCN",
         "departISO": "2025-10-25T08:30:00Z",
         "arriveISO": "2025-10-25T10:45:00Z",
         "durationMin": 135,
         "stops": 0,
         "fareEUR": 189.50
       }
     ]
   }
   ```

2. **Implement search function**
   ```typescript
   // src/api/flights.ts
   import flightData from './data/flights.json';
   
   export async function searchFlights(criteria: SearchCriteria): Promise<SearchResults> {
     // Filter logic here
     const matchingFlights = flightData.flights.filter(flight => 
       flight.origin === criteria.origin &&
       flight.destination === criteria.destination
       // Add date filtering
     );
     
     return {
       criteria,
       flights: matchingFlights,
       searchedAt: new Date().toISOString(),
       totalResults: matchingFlights.length,
       status: matchingFlights.length > 0 ? 'success' : 'empty'
     };
   }
   ```

3. **Test API functions**
   ```typescript
   test('filters flights by origin and destination', async () => {
     const results = await searchFlights({
       origin: 'AMS',
       destination: 'BCN',
       departureDate: '2025-10-25',
       passengers: 1,
       cabin: 'economy'
     });
     
     expect(results.flights).toHaveLength(1);
     expect(results.flights[0].origin).toBe('AMS');
   });
   ```

## Constitutional Compliance Checks

### 1. Accessibility Validation

```bash
# Run accessibility tests
npm test -- --testNamePattern="accessibility"

# Manual testing checklist:
# ✅ Tab navigation works through entire interface
# ✅ Screen reader announces form validation errors  
# ✅ Focus management works during route transitions
# ✅ All interactive elements have accessible names
```

### 2. Performance Validation

```bash
# Bundle size analysis
npm run build
npm run analyze

# Performance testing
# ✅ Initial bundle < 50KB gzipped
# ✅ Route chunks < 30KB each
# ✅ LCP < 2.5s (test with network throttling)
# ✅ CLS < 0.1 (no layout shifts during loading)
```

### 3. Cross-browser Testing

```bash
# Test matrix (minimum viable):
# ✅ Chrome (latest)
# ✅ Firefox (latest) 
# ✅ Safari (latest)
# ✅ Edge (latest)

# Mobile testing:
# ✅ iOS Safari (responsive design)
# ✅ Android Chrome (responsive design)
```

## Common Development Tasks

### Adding New Airport Codes

1. Update `src/api/data/flights.json` with new flight entries
2. Ensure airport codes follow IATA 3-character standard
3. Add corresponding flights for both directions if needed
4. Test search functionality with new routes

### Adding Form Validation Rules

1. Update `src/lib/types.ts` with new validation types
2. Implement validation logic in form components
3. Add error message templates with i18n consideration
4. Test validation with accessibility tools

### Performance Optimization

1. **Code splitting**
   ```typescript
   // Lazy load route components
   const Results = lazy(() => import('../routes/Results'));
   
   <Suspense fallback={<div>Loading...</div>}>
     <Routes>
       <Route path="/results" element={<Results />} />
     </Routes>
   </Suspense>
   ```

2. **Bundle analysis**
   ```bash
   npm run build -- --analyze
   # Check for unexpected large dependencies
   ```

3. **Core Web Vitals monitoring**
   ```typescript
   import { getCLS, getFID, getLCP } from 'web-vitals';
   
   getCLS(console.log);
   getFID(console.log);  
   getLCP(console.log);
   ```

## Deployment Checklist

### Pre-deployment Validation

- [ ] All tests passing (`npm test`)
- [ ] No accessibility violations (`npm run test:a11y`)
- [ ] Bundle size within limits (`npm run analyze`)
- [ ] Core Web Vitals targets met
- [ ] Cross-browser compatibility verified
- [ ] Mobile responsive design tested
- [ ] Keyboard navigation fully functional

### Production Build

```bash
# Create optimized build
npm run build

# Verify build output
ls -la dist/
# Should see:
# - index.html (entry point)
# - assets/ (JS/CSS chunks)
# - Gzipped sizes within constitutional limits
```

This quickstart ensures constitutional compliance while maintaining development velocity. All performance and accessibility requirements are built into the development workflow rather than being afterthoughts.