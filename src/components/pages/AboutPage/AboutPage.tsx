import { useEffect, useState } from 'react';
import { ABOUT_PARTNERS, ABOUT_TEAM } from '@/data/about';
import { loadAboutTeamPhotos, type AboutPhotoView } from '@/lib/about';
import { cn } from '@/lib/utils';
import styles from './AboutPage.module.css';

function PhotoPlaceholder({
  className,
  label,
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div className={cn(styles.placeholder, className)} aria-hidden="true">
      {label ? <span className={styles.placeholderText}>{label}</span> : null}
    </div>
  );
}

function AboutImage({
  className,
  photo,
  label,
}: {
  className?: string;
  photo?: AboutPhotoView;
  label?: string;
}) {
  if (photo?.imageUrl) {
    return (
      <img
        src={photo.imageUrl}
        alt={photo.alt}
        className={cn(styles.aboutImage, className)}
        loading="lazy"
        decoding="async"
      />
    );
  }
  return <PhotoPlaceholder className={className} label={label} />;
}

export function AboutPage() {
  const [teamPhotos, setTeamPhotos] = useState<AboutPhotoView[]>([]);

  useEffect(() => {
    let cancelled = false;
    loadAboutTeamPhotos().then((photos) => {
      if (!cancelled) setTeamPhotos(photos);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main id="main" className={styles.root}>
      <h1 className={styles.srOnly}>О проекте</h1>

      <section className={styles.section} aria-labelledby="about-team-title">
        <h2 id="about-team-title" className={styles.sectionTitle}>
          Наша команда
        </h2>
        <ul className={styles.teamGrid}>
          {ABOUT_TEAM.map((member, index) => (
            <li key={member.id} className={styles.teamCard}>
              <AboutImage
                className={styles.teamPhoto}
                photo={teamPhotos[index]}
                label="Фото (скоро)"
              />
              <p className={styles.teamName}>{member.name}</p>
              <p className={styles.teamRole}>{member.role}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="about-partners-title">
        <h2 id="about-partners-title" className={styles.sectionTitle}>
          Нам доверяют
        </h2>
        <ul className={styles.partnersStrip}>
          {ABOUT_PARTNERS.map((partner) => (
            <li key={partner.id} className={styles.partnerCard}>
              {partner.name}
            </li>
          ))}
        </ul>
        <p className={styles.partnersNote}>Логотипы партнёров появятся позже</p>
      </section>
    </main>
  );
}
