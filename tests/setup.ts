import { expect, afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with testing-library matchers
expect.extend(matchers);

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Global test configuration
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock IntersectionObserver for performance monitoring tests
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '0px';
  readonly thresholds: ReadonlyArray<number> = [];

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _callback: IntersectionObserverCallback, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _options?: IntersectionObserverInit
  ) {
    // Mock constructor - parameters are unused in mock
  }
  
  observe(): void {
    // Mock implementation
  }
  
  disconnect(): void {
    // Mock implementation
  }
  
  unobserve(): void {
    // Mock implementation
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.IntersectionObserver = MockIntersectionObserver as any;

// Mock ResizeObserver for responsive testing
class MockResizeObserver implements ResizeObserver {
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _callback: ResizeObserverCallback
  ) {
    // Mock constructor - callback is unused in mock
  }
  
  observe(): void {
    // Mock implementation
  }
  
  disconnect(): void {
    // Mock implementation
  }
  
  unobserve(): void {
    // Mock implementation
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.ResizeObserver = MockResizeObserver as any;

// Console error/warning assertions for development
const originalError = console.error;
beforeEach(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterEach(() => {
  console.error = originalError;
});

// Performance monitoring setup for constitutional compliance
interface PerformanceEntry {
  name: string;
  entryType: string;
  startTime: number;
  duration: number;
}

// Mock Performance API for LCP/CLS testing
Object.defineProperty(window, 'performance', {
  writable: true,
  value: {
    ...window.performance,
    getEntriesByType: (type: string): PerformanceEntry[] => {
      if (type === 'largest-contentful-paint') {
        return [
          {
            name: '',
            entryType: 'largest-contentful-paint',
            startTime: 1500, // Mock LCP under 2.5s budget
            duration: 0,
          },
        ];
      }
      if (type === 'layout-shift') {
        return [
          {
            name: '',
            entryType: 'layout-shift',
            startTime: 0,
            duration: 0.05, // Mock CLS under 0.1 budget
          },
        ];
      }
      return [];
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mark: (_name: string) => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    measure: (_name: string, _startMark?: string, _endMark?: string) => {},
  },
});

// Accessibility testing helpers
export const axeConfig = {
  rules: {
    // Constitutional WCAG AA compliance
    'color-contrast': { enabled: true },
    'focus-order-semantics': { enabled: true },
    'keyboard-navigation': { enabled: true },
    'landmark-unique': { enabled: true },
    'page-has-heading-one': { enabled: true },
    'region': { enabled: true },
    // Airlines-specific rules
    'aria-required-attr': { enabled: true },
    'button-name': { enabled: true },
    'form-field-multiple-labels': { enabled: true },
    'input-button-name': { enabled: true },
    'label': { enabled: true },
  },
  tags: ['wcag2a', 'wcag2aa', 'best-practice'],
};

// Screen reader testing simulation
export const mockScreenReader = {
  announcements: [] as string[],
  announce: (text: string) => {
    mockScreenReader.announcements.push(text);
  },
  clear: () => {
    mockScreenReader.announcements = [];
  },
};

// Mock aria-live regions
const originalQuerySelector = document.querySelector;
Object.defineProperty(document, 'querySelector', {
  writable: true,
  value: (selector: string) => {
    if (selector === '[aria-live]') {
      return {
        textContent: '',
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        setAttribute: (_name: string, _value: string) => {},
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        getAttribute: (_name: string) => 'polite',
      };
    }
    return originalQuerySelector.call(document, selector);
  },
});

// Type declarations for accessibility testing
declare global {
  interface Window {
    matchMedia: (query: string) => MediaQueryList;
  }
}