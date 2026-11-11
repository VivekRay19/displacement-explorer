export type NumberFormatPreference = 'indian' | 'international';

export function formatDisplacementNumber(
  num: number | null | undefined,
  format: NumberFormatPreference = 'international'
): string {
  if (num === null || num === undefined) return '—';

  if (format === 'indian') {
    // Indian numbering format: e.g. 1,00,000
    return num.toLocaleString('en-IN');
  } else {
    // International numbering format: e.g. 100,000
    return num.toLocaleString('en-US');
  }
}

export function formatAxisNumber(num: number, format: NumberFormatPreference = 'international'): string {
  if (format === 'indian') {
    if (num >= 10000000) return `${(num / 10000000).toFixed(1)} Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(1)} Lakh`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
  } else {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
  }
  return num.toString();
}
