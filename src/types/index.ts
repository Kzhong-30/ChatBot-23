export type Severity = 'serious' | 'warning' | 'tip';

export type ColorBlindType =
  | 'protanopia'
  | 'deuteranopia'
  | 'tritanopia'
  | 'achromatopsia'
  | 'normal';

export interface WcagRef {
  code: string;
  name: string;
  level: 'A' | 'AA' | 'AAA';
  url: string;
}

export interface ElementLocator {
  selector: string;
  html: string;
  xpath?: string;
}

export interface FixSuggestion {
  steps: string[];
  codeBefore?: string;
  codeAfter?: string;
  resources?: string[];
}

export interface A11yIssue {
  id: string;
  type: string;
  category: string;
  severity: Severity;
  title: string;
  description: string;
  impact: string;
  wcagRefs: WcagRef[];
  element: ElementLocator;
  fixSuggestion: FixSuggestion;
}

export interface ScanReport {
  id: string;
  url: string;
  scanTime: string;
  duration: number;
  score: number;
  stats: {
    serious: number;
    warning: number;
    tip: number;
    total: number;
    passed: number;
  };
  issues: A11yIssue[];
  pageTitle?: string;
}

export interface ActiveFilters {
  severity: Severity[];
  categories: string[];
}
