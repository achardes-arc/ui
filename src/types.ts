export type ButtonVariant = 'neutral' | 'primary' | 'brand' | 'danger';
export type StatusTone = 'neutral' | 'success' | 'warning' | 'danger' | 'primary' | 'brand';

export interface TopbarItem {
  label: string;
  href: string;
  current?: boolean;
  count?: number;
}
