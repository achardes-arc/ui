export type ButtonVariant = 'neutral' | 'primary' | 'brand' | 'danger';
export type StatusTone = 'neutral' | 'success' | 'warning' | 'danger' | 'primary' | 'brand';

export interface TopbarItem {
  label: string;
  href: string;
  current?: boolean;
  count?: number;
}

export type HeadingLevel = 2 | 3 | 4 | 5 | 6;
export interface DescriptionItem {
  term: string;
  description: string;
}
