/**
 * ============================================================
 * COMPLEXITY SECURITY LAB — Formatters
 * Number formatting, time humanization, scientific notation
 * ============================================================
 */

import { TIME_COMPARISONS } from './constants.js';

/**
 * Format a large number with locale separators.
 * @param {number|bigint} n - Number to format
 * @returns {string} Formatted string (e.g., "1,234,567")
 */
export function formatNumber(n) {
  if (typeof n === 'bigint') {
    return n.toLocaleString('es-MX');
  }
  return Number(n).toLocaleString('es-MX');
}

/**
 * Convert a number to scientific notation string.
 * @param {number|bigint} n - Number to convert
 * @returns {string} e.g., "1.23 × 10¹⁵"
 */
export function scientificNotation(n) {
  const num = typeof n === 'bigint' ? Number(n) : n;
  if (num === 0) return '0';
  if (num < 10000) return formatNumber(n);
  
  const exponent = Math.floor(Math.log10(Math.abs(num)));
  const mantissa = num / Math.pow(10, exponent);
  
  const superscriptDigits = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
                               '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  const expStr = String(exponent).split('').map(d => superscriptDigits[d] || d).join('');
  
  return `${mantissa.toFixed(2)} × 10${expStr}`;
}

/**
 * Convert seconds to a human-readable Spanish time string.
 * Uses dramatic comparisons for cosmic-scale durations.
 * @param {number} seconds - Duration in seconds
 * @returns {string} Humanized time string
 */
export function humanizeTime(seconds) {
  if (seconds < 0.001) return 'Instantáneo';
  if (seconds < 1) return `${(seconds * 1000).toFixed(0)} milisegundos`;
  if (seconds < 60) return `${seconds.toFixed(1)} segundos`;
  if (seconds < 3600) return `${(seconds / 60).toFixed(1)} minutos`;
  if (seconds < 86400) return `${(seconds / 3600).toFixed(1)} horas`;
  if (seconds < 604800) return `${(seconds / 86400).toFixed(1)} días`;
  if (seconds < 2592000) return `${(seconds / 604800).toFixed(1)} semanas`;
  if (seconds < 31536000) return `${(seconds / 2592000).toFixed(1)} meses`;
  if (seconds < 315360000) return `${(seconds / 31536000).toFixed(1)} años`;
  if (seconds < 3153600000) return `${(seconds / 31536000).toFixed(0)} años`;
  if (seconds < 31536000000) return `${(seconds / 31536000 / 1000).toFixed(1)} mil años`;
  if (seconds < 3.15e13) return `${(seconds / 31536000 / 1e6).toFixed(1)} millones de años`;
  if (seconds < 3.15e16) return `${(seconds / 31536000 / 1e9).toFixed(1)} mil millones de años`;
  if (seconds < 3.15e19) return `${(seconds / 31536000 / 1e12).toFixed(1)} billones de años`;
  return `${scientificNotation(seconds / 31536000)} años`;
}

/**
 * Find the closest time comparison milestone.
 * @param {number} seconds - Duration in seconds
 * @returns {{ label: string, icon: string, ratio: string }}
 */
export function findTimeComparison(seconds) {
  let closest = TIME_COMPARISONS[0];
  for (const tc of TIME_COMPARISONS) {
    if (seconds >= tc.seconds) {
      closest = tc;
    } else {
      break;
    }
  }
  
  const ratio = seconds / closest.seconds;
  return {
    ...closest,
    ratio: ratio > 1 ? `${formatNumber(Math.round(ratio))}×` : '< 1×'
  };
}

/**
 * Format bytes to human-readable size.
 * @param {number} bytes
 * @returns {string}
 */
export function formatBytes(bytes) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(1)} ${units[i]}`;
}

/**
 * Format a currency amount (MXN).
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2
  }).format(amount);
}

/**
 * Format a date string.
 * @param {string} dateStr - ISO date string
 * @returns {string}
 */
export function formatDate(dateStr) {
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(dateStr));
}

/**
 * Format elapsed time as MM:SS or HH:MM:SS.
 * @param {number} seconds
 * @returns {string}
 */
export function formatElapsed(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  if (h > 0) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * Mask a password string, showing only first and last character.
 * @param {string} password
 * @returns {string}
 */
export function maskPassword(password) {
  if (password.length <= 2) return '•'.repeat(password.length);
  return password[0] + '•'.repeat(password.length - 2) + password[password.length - 1];
}

/**
 * Generate a random hex color.
 * @returns {string}
 */
export function randomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}
