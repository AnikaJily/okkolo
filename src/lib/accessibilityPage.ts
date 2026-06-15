import {
  fetchAccessibilityPage,
  getStrapiImageUrl,
  type StrapiAccessibilityPage,
} from '@/lib/strapi';

export interface AccessibilityPageView {
  title: string;
  lead?: string;
  heroImageUrl?: string;
  heroImageAlt: string;
}

const FALLBACK_TITLE = 'Доступность';
const FALLBACK_HERO_ALT = 'Пространство «Окколо»';

function buildView(page: StrapiAccessibilityPage | null): AccessibilityPageView {
  const heroImageUrl = getStrapiImageUrl(page?.heroPhoto ?? null) ?? undefined;
  return {
    title: page?.title?.trim() || FALLBACK_TITLE,
    lead: page?.lead?.trim() || undefined,
    heroImageUrl,
    heroImageAlt: page?.heroPhotoAlt?.trim() || FALLBACK_HERO_ALT,
  };
}

export function accessibilityPageFromFallback(): AccessibilityPageView {
  return buildView(null);
}

export async function loadAccessibilityPage(): Promise<AccessibilityPageView> {
  try {
    const page = await fetchAccessibilityPage();
    if (page) return buildView(page);
  } catch (error) {
    console.error('loadAccessibilityPage: fallback на статичные данные', error);
  }
  return accessibilityPageFromFallback();
}
