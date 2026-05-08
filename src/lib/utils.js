import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { env } from '@/config/env';
import { Star, StarHalf } from 'lucide-react';

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

export function getLocaleFromLanguage(lang) {
  return lang === 'en' ? 'en-US' : 'vi-VN';
}

export function withBaseUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;

  // Use the env config instead of import.meta.env directly
  const base = env.apiBaseUrl || '';
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
}

/** Hex color to rgba string for translucent backgrounds */
export function hexToRgba(hex, alpha = 0.12) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return `rgba(148,163,184,${alpha})`;
  return `rgba(${r},${g},${b},${alpha})`;
}

export function hasHtmlMarkup(value) {
  if (typeof value !== 'string') return false;
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

export function formatStopDuration(minutes) {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}g ${m}p`;
  if (h > 0) return `${h} giờ`;
  return `${m} phút`;
}
