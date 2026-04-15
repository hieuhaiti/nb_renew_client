import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { env } from '@/config/env';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatVND(amount) {
  if (amount == null) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

export function withBaseUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;

  // Use the env config instead of import.meta.env directly
  const base = env.apiBaseUrl || '';
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
}
