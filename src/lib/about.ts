import { ABOUT_INTRO } from '@/data/about';
import {
  fetchAboutPage,
  fetchAboutTeamPhotos,
  fetchAboutWorkplacePhotos,
  getStrapiImageUrl,
  type StrapiAboutPage,
  type StrapiAboutPhoto,
} from '@/lib/strapi';

export interface AboutIntroView {
  eyebrow: string;
  title: string;
  lead: string;
  tagline: string;
  heroImageUrl?: string;
  heroImageAlt: string;
}

export interface AboutPhotoView {
  id: string;
  imageUrl: string;
  alt: string;
  caption?: string;
}

function toPhotoView(item: StrapiAboutPhoto): AboutPhotoView | null {
  const imageUrl = getStrapiImageUrl(item.image);
  if (!imageUrl) return null;
  return {
    id: item.documentId,
    imageUrl,
    alt: item.alt?.trim() || '',
    caption: item.caption?.trim() || undefined,
  };
}

function buildIntroView(page: StrapiAboutPage | null): AboutIntroView {
  const heroImageUrl = getStrapiImageUrl(page?.heroPhoto ?? null) ?? undefined;
  return {
    eyebrow: page?.eyebrow?.trim() || ABOUT_INTRO.eyebrow,
    title: page?.title?.trim() || ABOUT_INTRO.title,
    lead: page?.lead?.trim() || ABOUT_INTRO.lead,
    tagline: page?.tagline?.trim() || ABOUT_INTRO.tagline,
    heroImageUrl,
    heroImageAlt: page?.heroPhotoAlt?.trim() || 'Команда проекта «Окколо»',
  };
}

export function aboutIntroFromFallback(): AboutIntroView {
  return buildIntroView(null);
}

export async function loadAboutIntro(): Promise<AboutIntroView> {
  try {
    const page = await fetchAboutPage();
    if (page) return buildIntroView(page);
  } catch (error) {
    console.error('loadAboutIntro: fallback на статичные данные', error);
  }
  return aboutIntroFromFallback();
}

export async function loadAboutTeamPhotos(): Promise<AboutPhotoView[]> {
  try {
    const items = await fetchAboutTeamPhotos();
    return items
      .map(toPhotoView)
      .filter((photo): photo is AboutPhotoView => photo !== null);
  } catch (error) {
    console.error('loadAboutTeamPhotos: fallback на пустой список', error);
    return [];
  }
}

export async function loadAboutWorkplacePhotos(): Promise<AboutPhotoView[]> {
  try {
    const items = await fetchAboutWorkplacePhotos();
    return items
      .map(toPhotoView)
      .filter((photo): photo is AboutPhotoView => photo !== null);
  } catch (error) {
    console.error('loadAboutWorkplacePhotos: fallback на пустой список', error);
    return [];
  }
}
