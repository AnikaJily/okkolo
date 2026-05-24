/** Безопасный id для связи aria-labelledby / якорей (Strapi documentId и т.п.). */
export function safeDomIdFragment(raw: string): string {
  const s = raw.replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
  return s.length > 0 ? s : 'item';
}
