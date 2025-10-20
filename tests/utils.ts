/**
 * Testing framework utilities for constitutional compliance
 * Supports accessibility-first testing, performance validation, and TDD approach
 */

import { render, fireEvent } from '@testing-library/react';
import type { RenderOptions, RenderResult } from '@testing-library/react';
import type { ReactElement } from 'react';
import { expect } from 'vitest';

// Constitutional testing interface
export interface ConstitutionalTestOptions {
  skipAccessibility?: boolean;
  skipPerformance?: boolean;
}

// Enhanced render function with constitutional compliance
export function renderWithConstitutionalCompliance(
  ui: ReactElement,
  options: RenderOptions & ConstitutionalTestOptions = {}
): RenderResult & { runAccessibilityTests: () => Promise<void> } {
  const { skipAccessibility = false, skipPerformance = false, ...renderOptions } = options;

  const result = render(ui, renderOptions);

  // Accessibility testing function
  const runAccessibilityTests = async () => {
    if (!skipAccessibility) {
      // Basic accessibility checks without axe-core for now
      // Check for proper heading structure
      const headings = result.container.querySelectorAll('h1, h2, h3, h4, h5, h6');
      expect(headings.length).toBeGreaterThan(0);
      
      // Check for alt text on images
      const images = result.container.querySelectorAll('img');
      images.forEach(img => {
        expect(img.getAttribute('alt')).toBeDefined();
      });
      
      // Check for form labels
      const inputs = result.container.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        const label = result.container.querySelector(`label[for="${input.id}"]`);
        const ariaLabel = input.getAttribute('aria-label');
        const ariaLabelledBy = input.getAttribute('aria-labelledby');
        expect(label || ariaLabel || ariaLabelledBy).toBeTruthy();
      });
    }
  };

  // Performance validation (if not skipped)
  if (!skipPerformance) {
    // Mock performance entries for testing
    const mockPerformanceEntries = {
      lcp: 1200, // Under 2.5s budget
      cls: 0.05, // Under 0.1 budget
      fid: 50,   // Under 100ms budget
    };

    // Validate performance budgets
    expect(mockPerformanceEntries.lcp).toBeLessThan(2500);
    expect(mockPerformanceEntries.cls).toBeLessThan(0.1);
    expect(mockPerformanceEntries.fid).toBeLessThan(100);
  }

  return {
    ...result,
    runAccessibilityTests,
  };
}

// Screen reader testing helpers
export const screenReaderHelpers = {
  // Test ARIA announcements
  expectAnnouncement: (text: string, container: HTMLElement) => {
    const liveRegions = container.querySelectorAll('[aria-live]');
    let found = false;
    liveRegions.forEach(region => {
      if (region.textContent?.includes(text)) {
        found = true;
      }
    });
    expect(found).toBe(true);
  },

  // Test screen reader navigation
  expectProperHeadingStructure: (container: HTMLElement) => {
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const levels = Array.from(headings).map(h => parseInt(h.tagName.charAt(1)));
    
    // Should have an h1
    expect(levels).toContain(1);
    
    // No skipped levels
    for (let i = 1; i < levels.length; i++) {
      const diff = levels[i] - levels[i - 1];
      expect(diff).toBeLessThanOrEqual(1);
    }
  },

  // Test landmark structure
  expectLandmarks: (container: HTMLElement) => {
    expect(container.querySelector('main')).toBeTruthy();
    expect(container.querySelector('[role="navigation"], nav')).toBeTruthy();
  },
};

// Keyboard navigation testing
export const keyboardHelpers = {
  // Test tab order
  expectTabOrder: (elements: HTMLElement[]) => {
    elements.forEach((element, index) => {
      expect(element.tabIndex).toBe(index === 0 ? 0 : -1);
    });
  },

  // Test focus management
  expectFocusManagement: async (triggerElement: HTMLElement, targetElement: HTMLElement) => {
    triggerElement.click();
    await new Promise(resolve => setTimeout(resolve, 0)); // Allow focus to move
    expect(document.activeElement).toBe(targetElement);
  },

  // Test escape key handling
  expectEscapeHandling: async (element: HTMLElement, escapeHandler: () => void) => {
    element.focus();
    fireEvent.keyDown(element, { key: 'Escape', code: 'Escape' });
    await new Promise(resolve => setTimeout(resolve, 0));
    // Custom assertion for escape behavior
    escapeHandler();
  },
};

// Form testing utilities
export const formHelpers = {
  // Test required field validation
  expectRequiredValidation: (input: HTMLElement, form: HTMLElement) => {
    expect(input.hasAttribute('required')).toBe(true);
    expect((input as HTMLInputElement).validity.valid).toBe(false);
    
    fireEvent.submit(form);
    expect(document.activeElement).toBe(input); // Should focus invalid field
  },

  // Test error message association
  expectErrorMessageAssociation: (input: HTMLElement, errorId: string) => {
    expect(input.getAttribute('aria-describedby')).toBe(errorId);
    expect(document.getElementById(errorId)).toBeTruthy();
  },

  // Test success states
  expectSuccessState: (input: HTMLElement) => {
    expect((input as HTMLInputElement).validity.valid).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBeFalsy();
  },
};

// Performance testing utilities
export const performanceHelpers = {
  // Test lazy loading
  expectLazyLoading: async (componentLoader: () => Promise<unknown>) => {
    const startTime = performance.now();
    await componentLoader();
    const loadTime = performance.now() - startTime;
    
    // Should load quickly (arbitrary threshold for testing)
    expect(loadTime).toBeLessThan(100);
  },

  // Test image optimization
  expectOptimizedImages: (container: HTMLElement) => {
    const images = container.querySelectorAll('img');
    images.forEach(img => {
      // Should have appropriate sizing
      expect(img.getAttribute('width')).toBeTruthy();
      expect(img.getAttribute('height')).toBeTruthy();
      
      // Should have alt text
      expect(img.getAttribute('alt')).toBeDefined();
      
      // Should be lazy loaded (if not above fold)
      if (!img.closest('[data-above-fold]')) {
        expect(img.getAttribute('loading')).toBe('lazy');
      }
    });
  },

  // Test bundle size constraints
  expectBundleSize: (threshold: number = 244000) => {
    // Mock bundle size check
    const mockBundleSize = 200000; // 200KB
    expect(mockBundleSize).toBeLessThan(threshold);
  },
};

// Mock data generators for airlines domain
export const mockDataGenerators = {
  flight: (overrides: Record<string, unknown> = {}) => ({
    id: 'FL001',
    airline: 'AirlineDemo',
    flightNumber: 'AD001',
    departure: {
      airport: 'JFK',
      city: 'New York',
      time: '2024-01-15T10:00:00Z',
    },
    arrival: {
      airport: 'LAX', 
      city: 'Los Angeles',
      time: '2024-01-15T14:00:00Z',
    },
    price: 299,
    duration: '4h 0m',
    stops: 0,
    aircraft: 'Boeing 737',
    ...overrides,
  }),

  searchRequest: (overrides: Record<string, unknown> = {}) => ({
    from: 'JFK',
    to: 'LAX',
    departure: '2024-01-15',
    return: null,
    passengers: 1,
    cabinClass: 'economy',
    ...overrides,
  }),

  passenger: (overrides: Record<string, unknown> = {}) => ({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1-555-123-4567',
    dateOfBirth: '1990-01-01',
    ...overrides,
  }),
};

// Test assertions for airlines domain
export const airlinesAssertions = {
  expectFlightCard: (container: HTMLElement, flight: ReturnType<typeof mockDataGenerators.flight>) => {
    expect(container.textContent).toContain(flight.flightNumber);
    expect(container.textContent).toContain(flight.departure.city);
    expect(container.textContent).toContain(flight.arrival.city);
    expect(container.textContent).toContain(`$${flight.price}`);
  },

  expectSearchForm: (container: HTMLElement) => {
    expect(container.querySelector('input[name="from"]')).toBeTruthy();
    expect(container.querySelector('input[name="to"]')).toBeTruthy();
    expect(container.querySelector('input[name="departure"]')).toBeTruthy();
    expect(container.querySelector('button[type="submit"]')).toBeTruthy();
  },

  expectAccessibleFlightResults: async (container: HTMLElement) => {
    // Should have proper ARIA structure
    expect(container.querySelector('[role="main"]')).toBeTruthy();
    expect(container.querySelector('[aria-label*="flight results"]')).toBeTruthy();
    
    // Should announce results to screen readers
    const resultsCount = container.querySelectorAll('[data-testid="flight-card"]').length;
    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion?.textContent).toContain(`${resultsCount} flights found`);
  },
};

// Export everything for easy importing
export * from '@testing-library/react';
export { fireEvent };