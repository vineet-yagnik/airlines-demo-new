# Implementation Plan: Airlines MVP

**Branch**: `001-airlines-mvp` | **Date**: 2025-10-20 | **Spec**: [Airlines MVP Specification](spec.md)
**Input**: Feature specification from `/specs/001-airlines-mvp/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a React-based airlines booking MVP with three core user journeys: flight search interface (P1), results display (P2), and booking entry point (P3). Uses React Router for client-side navigation, minimal CSS for styling, and Vitest for testing. Features keyboard-first accessibility, WCAG AA compliance, and performance optimization targeting Core Web Vitals. Mock flight data provides realistic search functionality without external dependencies.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.9.3, React 19.1.1  
**Primary Dependencies**: Vite (build tool), React Router (routing), React DOM, ESLint (code quality)  
**Storage**: Mock JSON data (src/api/data/flights.json), no external storage required  
**Testing**: Vitest (unit tests), React Testing Library (@testing-library/react), smoke tests only for MVP  
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Web application (React SPA)  
**Performance Goals**: LCP ≤2.5s, CLS ≤0.1, FID ≤100ms, bundle ≤200KB gzipped  
**Constraints**: WCAG AA compliance, keyboard navigation, screen reader support, RTL languages  
**Scale/Scope**: Airlines booking interface supporting flight search, selection, and booking flows

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Accessibility-First**: All UI components designed for WCAG AA compliance, keyboard navigation, screen reader support, aria-live regions for dynamic content
- [x] **Performance Budgets**: React Router code-splitting, minimal dependencies, bundle analysis planned, Core Web Vitals monitoring strategy defined  
- [x] **Test-Driven Development**: Vitest + React Testing Library setup planned, smoke tests for MVP, component-level unit tests, accessibility testing integration
- [x] **Security by Design**: No client-side secrets (mock data only), comprehensive input validation, secure form handling patterns
- [x] **UX Consistency**: Global CSS with design tokens, responsive grid system, RTL support via CSS logical properties, consistent focus management

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```
src/
├── app/                 # Application shell and router setup
│   ├── App.tsx         # Main app component with router
│   └── Layout.tsx      # Shared layout component
├── routes/             # Page-level route components
│   ├── Home.tsx        # Homepage with flight search
│   ├── Results.tsx     # Flight results listing page
│   └── Booking.tsx     # Booking placeholder page
├── components/         # Reusable UI components
│   ├── FlightSearch/   # Flight search form component
│   │   ├── FlightSearch.tsx
│   │   └── FlightSearch.test.tsx
│   └── FlightCard/     # Individual flight display component
│       ├── FlightCard.tsx
│       └── FlightCard.test.tsx
├── api/                # Mock data and API layer
│   ├── flights.ts      # Flight search API functions
│   └── data/
│       └── flights.json # Mock flight data
├── lib/                # Utilities and shared code
│   ├── types.ts        # TypeScript type definitions
│   └── format.ts       # Date/time formatting utilities
└── index.css          # Global styles and design tokens

tests/                  # Test configuration and fixtures
└── setup.ts           # Vitest test setup
```

**Structure Decision**: Single React application structure optimized for the MVP scope. Routes are organized by pages, components by functionality, and API layer handles mock data. This structure supports the constitutional requirements for accessibility, performance, and maintainability while keeping dependencies minimal.

## Post-Design Constitution Check

*Re-evaluation after Phase 1 design artifacts completed.*

- [x] **Accessibility-First**: Component APIs designed with ARIA contracts, focus management patterns defined, live region announcements specified
- [x] **Performance Budgets**: Bundle splitting strategy documented (50KB initial, 30KB routes), Web Vitals monitoring integrated, minimal dependency footprint confirmed
- [x] **Test-Driven Development**: Test-first workflow established in quickstart, accessibility testing integrated, component isolation patterns defined  
- [x] **Security by Design**: No external API dependencies, input sanitization patterns specified, client-side validation with XSS prevention
- [x] **UX Consistency**: Design token system planned in global CSS, responsive breakpoints documented, RTL support via CSS logical properties

**Gate Status**: ✅ PASSED - All constitutional requirements satisfied in design phase.

## Complexity Tracking

*No violations detected - all constitutional principles satisfied without compromises.*

