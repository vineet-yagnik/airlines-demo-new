/**
 * Performance monitoring utilities for constitutional compliance
 * Ensures LCP ≤ 2.5s and CLS ≤ 0.1 budgets are met
 */

import * as React from 'react';

// Constitutional performance budgets
export const PERFORMANCE_BUDGETS = {
  LCP_THRESHOLD: 2500, // 2.5 seconds
  CLS_THRESHOLD: 0.1,  // 0.1 units
  FID_THRESHOLD: 100,  // 100ms
  TTI_THRESHOLD: 3800, // 3.8 seconds
} as const;

// Performance metrics interface
export interface PerformanceMetrics {
  lcp?: number;
  cls?: number;
  fid?: number;
  tti?: number;
  timestamp: number;
}

// Performance observer for Core Web Vitals
class PerformanceMonitor {
  private metrics: PerformanceMetrics = { timestamp: Date.now() };
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers(): void {
    try {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry;
        this.metrics.lcp = lastEntry.startTime;
        this.checkBudgets();
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      this.observers.push(lcpObserver);

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (!(entry as any).hadRecentInput) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            clsValue += (entry as any).value;
          }
        }
        this.metrics.cls = clsValue;
        this.checkBudgets();
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      this.observers.push(clsObserver);

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          this.metrics.fid = (entry as any).processingStart - entry.startTime;
          this.checkBudgets();
        }
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
      this.observers.push(fidObserver);

    } catch (error) {
      // Performance observers not supported
      console.warn('Performance observers not supported:', error);
    }
  }

  private checkBudgets(): void {
    const violations: string[] = [];

    if (this.metrics.lcp && this.metrics.lcp > PERFORMANCE_BUDGETS.LCP_THRESHOLD) {
      violations.push(`LCP: ${this.metrics.lcp}ms exceeds ${PERFORMANCE_BUDGETS.LCP_THRESHOLD}ms budget`);
    }

    if (this.metrics.cls && this.metrics.cls > PERFORMANCE_BUDGETS.CLS_THRESHOLD) {
      violations.push(`CLS: ${this.metrics.cls} exceeds ${PERFORMANCE_BUDGETS.CLS_THRESHOLD} budget`);
    }

    if (this.metrics.fid && this.metrics.fid > PERFORMANCE_BUDGETS.FID_THRESHOLD) {
      violations.push(`FID: ${this.metrics.fid}ms exceeds ${PERFORMANCE_BUDGETS.FID_THRESHOLD}ms budget`);
    }

    if (violations.length > 0) {
      console.warn('Constitutional performance budget violations:', violations);
      // In development, we can be strict about performance
      if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
        this.reportViolations(violations);
      }
    }
  }

  private reportViolations(violations: string[]): void {
    // Report to analytics/monitoring service in production
    // For now, log to console
    violations.forEach(violation => {
      console.warn(`🚨 Performance Budget Violation: ${violation}`);
    });
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public disconnect(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Global performance monitor instance
let performanceMonitor: PerformanceMonitor | null = null;

export function initializePerformanceMonitoring(): PerformanceMonitor {
  if (!performanceMonitor && typeof window !== 'undefined') {
    performanceMonitor = new PerformanceMonitor();
  }
  return performanceMonitor!;
}

export function getPerformanceMetrics(): PerformanceMetrics | null {
  return performanceMonitor?.getMetrics() || null;
}

export function disconnectPerformanceMonitoring(): void {
  performanceMonitor?.disconnect();
  performanceMonitor = null;
}

// React hook for performance monitoring
export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics | null>(null);

  React.useEffect(() => {
    const monitor = initializePerformanceMonitoring();
    
    // Update metrics periodically
    const interval = setInterval(() => {
      setMetrics(monitor.getMetrics());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return metrics;
}

// Performance-aware lazy loading utility
export function createPerformantLazyLoad<T extends React.ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return React.lazy(factory);
}

// Bundle size analyzer for constitutional compliance
export function analyzeBundleSize(): void {
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
    // In development, warn about large modules
    const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const largeBundles = navigationEntries
      .filter((entry) => entry.transferSize > 244000) // 244KB threshold
      .map((entry) => ({
        name: entry.name,
        size: `${(entry.transferSize / 1024).toFixed(2)}KB`
      }));

    if (largeBundles.length > 0) {
      console.warn('Large bundle sizes detected:', largeBundles);
    }
  }
}

// Image optimization helper
export function createOptimizedImageSrc(
  src: string, 
  width: number, 
  quality: number = 75
): string {
  // In a real implementation, this would generate optimized image URLs
  // For now, return the original src with query params for future optimization
  const params = new URLSearchParams({
    w: width.toString(),
    q: quality.toString()
  });
  return `${src}?${params.toString()}`;
}