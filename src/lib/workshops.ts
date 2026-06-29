import type { PictureSource } from '@/components/ui/Picture';
import {
  WORKSHOPS_AFTER_INTRO,
  WORKSHOPS_INTRO,
  workshopPrograms as fallbackPrograms,
  type WorkshopProgram,
} from '@/data/workshopsPage';
import {
  fetchWorkshopPrograms,
  fetchWorkshopsPage,
  getStrapiImageUrl,
  getStrapiResponsiveImage,
  type StrapiWorkshopProgram,
  type StrapiWorkshopsPage,
} from '@/lib/strapi';

export interface SplitPhotoView {
  imageUrl?: string;
  picture?: PictureSource;
  alt: string;
}

export interface WorkshopsPageView {
  intro: string;
  afterIntro: string;
  afterLearningPhoto: SplitPhotoView;
}

function toProgram(item: StrapiWorkshopProgram, index: number): WorkshopProgram | null {
  const title = item.title?.trim();
  const description = item.description?.trim();
  if (!title || !description) return null;

  const fallback = fallbackPrograms[index] ?? fallbackPrograms[0];
  const responsive = getStrapiResponsiveImage(item.image);

  return {
    id: item.documentId,
    title,
    description,
    // Фото из Strapi есть → рендерим его (responsive <img srcSet>), build-time picture не подставляем.
    // Нет фото в CMS → встроенная picture по индексу (как было).
    image: responsive?.src ?? fallback?.image ?? '',
    picture: responsive ? undefined : fallback?.picture,
    imageSrcSet: responsive?.srcSet || undefined,
    imageWidth: responsive?.width,
    imageHeight: responsive?.height,
    imageAlt: fallback?.imageAlt ?? title,
  };
}

function toSplitPhoto(
  image: StrapiWorkshopsPage['afterLearningPhoto'],
  alt: string | null | undefined,
  fallbackAlt: string,
): SplitPhotoView {
  const imageUrl = getStrapiImageUrl(image);
  return {
    imageUrl: imageUrl ?? undefined,
    alt: alt?.trim() || fallbackAlt,
  };
}

function buildPageView(page: StrapiWorkshopsPage | null): WorkshopsPageView {
  return {
    intro: page?.intro?.trim() || WORKSHOPS_INTRO,
    afterIntro: page?.afterIntro?.trim() || WORKSHOPS_AFTER_INTRO,
    afterLearningPhoto: toSplitPhoto(
      page?.afterLearningPhoto ?? null,
      page?.afterLearningPhotoAlt,
      'Обучение в мастерских «Окколо»',
    ),
  };
}

export function workshopsPageFromFallback(): WorkshopsPageView {
  return buildPageView(null);
}

export function workshopProgramsFromFallback(): WorkshopProgram[] {
  return fallbackPrograms;
}

export async function loadWorkshopsPage(): Promise<WorkshopsPageView> {
  try {
    const page = await fetchWorkshopsPage();
    if (page) return buildPageView(page);
  } catch (error) {
    console.error('loadWorkshopsPage: fallback на статичные данные', error);
  }
  return workshopsPageFromFallback();
}

export async function loadWorkshopPrograms(): Promise<WorkshopProgram[]> {
  try {
    const items = await fetchWorkshopPrograms();
    const programs = items
      .map((item, index) => toProgram(item, index))
      .filter((program): program is WorkshopProgram => program !== null);
    if (programs.length > 0) return programs;
  } catch (error) {
    console.error('loadWorkshopPrograms: fallback на статичные данные', error);
  }
  return workshopProgramsFromFallback();
}
