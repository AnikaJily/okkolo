import { SUPPORT_HREF } from '@/data/site';

export function getSupportAction(onSupport?: () => void) {
  return onSupport ? { onClick: onSupport } : { href: SUPPORT_HREF };
}
