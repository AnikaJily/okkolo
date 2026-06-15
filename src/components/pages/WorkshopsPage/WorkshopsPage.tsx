import { useEffect, useState } from 'react';
import afterLearningPicture from '@/assets/images/workshops-after-learning.png?w=480;768;1200&format=avif;webp;jpg&as=picture';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Picture } from '@/components/ui/Picture';
import type { PictureSource } from '@/components/ui/Picture';
import { LocationSection } from '@/components/sections/LocationSection';
import {
  getFallbackWorkshopsDirectionImage,
  loadWorkshopsDirectionImage,
} from '@/lib/directions';
import {
  loadWorkshopPrograms,
  loadWorkshopsPage,
  type SplitPhotoView,
  workshopsPageFromFallback,
  workshopProgramsFromFallback,
} from '@/lib/workshops';
import type { WorkshopProgram } from '@/data/workshopsPage';
import { WORKSHOPS_AFTER_CALLOUT } from '@/data/workshopsPage';
import { WorkshopProgramCard } from './WorkshopProgramCard';
import { WorkshopsSignupSection } from './WorkshopsSignupSection';
import styles from './WorkshopsPage.module.css';

function PhotoPlaceholder() {
  return (
    <div className={styles.photoPlaceholder} aria-hidden="true">
      <span className={styles.photoPlaceholderText}>Фото мастерских (скоро)</span>
    </div>
  );
}

function SplitPhoto({
  photo,
  fallbackPicture,
}: {
  photo: SplitPhotoView;
  fallbackPicture: PictureSource;
}) {
  if (photo.imageUrl) {
    return (
      <div className={styles.splitMedia}>
        <img
          src={photo.imageUrl}
          alt={photo.alt}
          className={styles.splitImage}
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  return (
    <div className={styles.splitMedia}>
      <Picture
        picture={photo.picture ?? fallbackPicture}
        alt={photo.alt}
        className={styles.splitImage}
        loading="lazy"
        sizes="(min-width: 1024px) 620px, 100vw"
      />
    </div>
  );
}

function CalloutCard({
  tag,
  text,
  variant = 'important',
}: {
  tag: string;
  text: string;
  variant?: 'important' | 'interesting';
}) {
  return (
    <div
      className={cn(
        styles.callout,
        variant === 'interesting' && styles.calloutInteresting,
      )}
    >
      <span className={styles.calloutTag}>{tag}</span>
      <p className={styles.calloutText}>{text}</p>
    </div>
  );
}

export function WorkshopsPage() {
  const [heroImage, setHeroImage] = useState(getFallbackWorkshopsDirectionImage);
  const [page, setPage] = useState(workshopsPageFromFallback);
  const [programs, setPrograms] = useState<WorkshopProgram[]>(workshopProgramsFromFallback);

  useEffect(() => {
    let cancelled = false;
    loadWorkshopsDirectionImage().then((url) => {
      if (!cancelled && url) setHeroImage(url);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadWorkshopsPage().then((data) => {
      if (!cancelled) setPage(data);
    });
    loadWorkshopPrograms().then((items) => {
      if (!cancelled) setPrograms(items);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main id="main" className={styles.root}>
      <section className={styles.hero} aria-labelledby="workshops-page-heading">
        <div className={`${styles.heroContent} sectionHeadGap`}>
          <h1 id="workshops-page-heading" className={styles.heroTitle}>
            Мастерские
          </h1>
          <p className={styles.heroLead}>{page.intro}</p>
          <div className={styles.heroActions}>
            <Button variant="primary" size="md" href="#workshops-signup">
              Записаться
            </Button>
            <Button variant="outline" size="md" href="/#about">
              Узнать о проекте
            </Button>
          </div>
        </div>
        {heroImage ? (
          <div className={styles.heroMedia}>
            <img
              src={heroImage}
              alt="Мастерские «Окколо»"
              className={styles.heroImage}
              loading="eager"
              decoding="async"
            />
          </div>
        ) : (
          <PhotoPlaceholder />
        )}
      </section>

      <section className={styles.programs} aria-labelledby="workshops-programs-heading">
        <h2 id="workshops-programs-heading" className={styles.sectionTitle}>
          Чему мы учим
        </h2>
        <ul className={styles.programGrid}>
          {programs.map((program) => (
            <li key={program.id}>
              <WorkshopProgramCard {...program} />
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.splitSection} aria-labelledby="workshops-after-heading">
        <div className={`${styles.splitContent} sectionHeadGap`}>
          <h2 id="workshops-after-heading" className={styles.sectionTitle}>
            Что будет после обучения
          </h2>
          <div className={styles.splitText}>
            <p className={styles.bodyText}>{page.afterIntro}</p>
            <CalloutCard
              tag={WORKSHOPS_AFTER_CALLOUT.tag}
              text={WORKSHOPS_AFTER_CALLOUT.text}
            />
          </div>
        </div>
        <SplitPhoto photo={page.afterLearningPhoto} fallbackPicture={afterLearningPicture} />
      </section>

      <WorkshopsSignupSection />

      <LocationSection />
    </main>
  );
}
