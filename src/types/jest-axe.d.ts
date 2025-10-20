/**
 * Type declarations for jest-axe
 */

declare module 'jest-axe' {
  export interface AxeViolation {
    id: string;
    impact: string;
    tags: string[];
    description: string;
    help: string;
    helpUrl: string;
    nodes: unknown[];
  }

  export interface AxeResults {
    violations: AxeViolation[];
    passes: AxeViolation[];
    incomplete: AxeViolation[];
    inapplicable: AxeViolation[];
  }

  export interface AxeConfig {
    rules?: Record<string, { enabled: boolean }>;
    tags?: string[];
  }

  export function axe(
    element: Element | Document, 
    config?: AxeConfig
  ): Promise<AxeResults>;

  export function toHaveNoViolations(): unknown;
}