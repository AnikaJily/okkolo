import { useEffect, useState } from 'react';
import audiencePicture from '@/assets/images/workshops-for-who.png?w=480;768;1200&format=avif;webp;jpg&as=picture';
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
  WORKSHOPS_AFTER_CALLOUTS,
  WORKSHOPS_AFTER_INTRO,
  WORKSHOPS_AUDIENCE,
  WORKSHOPS_AUDIENCE_NOTE,
  WORKSHOPS_INTRO,
  workshopPrograms,
} from '@/data/workshopsPage';
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

function SplitPhoto({ picture, alt }: { picture: PictureSource; alt: string }) {
  return (
    <div className={styles.splitMedia}>
      <Picture
        picture={picture}
        alt={alt}
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

  useEffect(() => {
    let cancelled = false;
    loadWorkshopsDirectionImage().then((url) => {
      if (!cancelled && url) setHeroImage(url);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main id="main" className={styles.root}>
      <section className={styles.hero} aria-labelledby="workshops-page-heading">
        <div className={styles.heroContent}>
          <h1 id="workshops-page-heading" className={styles.heroTitle}>
            Мастерские
          </h1>
          <p className={styles.heroLead}>{WORKSHOPS_INTRO}</p>
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
          {workshopPrograms.map((program) => (
            <li key={program.id}>
              <WorkshopProgramCard program={program} />
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.splitSection} aria-labelledby="workshops-audience-heading">
        <div className={styles.splitContent}>
          <h2 id="workshops-audience-heading" className={styles.sectionTitle}>
            Кому подходят мастерские
          </h2>
          <div className={styles.splitText}>
            <p className={styles.bodyText}>{WORKSHOPS_AUDIENCE}</p>
            <CalloutCard tag="Важно" text={WORKSHOPS_AUDIENCE_NOTE} />
          </div>
        </div>
        <SplitPhoto
          picture={audiencePicture}
          alt="Занятия в мастерских «Окколо»"
        />
      </section>

      <section className={styles.splitSection} aria-labelledby="workshops-after-heading">
        <div className={styles.splitContent}>
          <h2 id="workshops-after-heading" className={styles.sectionTitle}>
            Что будет после обучения
          </h2>
          <div className={styles.splitText}>
            <p className={styles.bodyText}>{WORKSHOPS_AFTER_INTRO}</p>
            {WORKSHOPS_AFTER_CALLOUTS.map((item) => (
              <CalloutCard
                key={item.text}
                tag={item.tag}
                text={item.text}
                variant="interesting"
              />
            ))}
          </div>
        </div>
        <SplitPhoto
          picture={afterLearningPicture}
          alt="Обучение в мастерских «Окколо»"
        />
      </section>

      <WorkshopsSignupSection />

      <LocationSection />
    </main>
  );
}
