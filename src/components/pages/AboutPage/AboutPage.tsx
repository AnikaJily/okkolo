import { Button } from '@/components/ui/Button';
import {
  ABOUT_CONTACTS,
  ABOUT_FEATURES,
  ABOUT_INTRO,
  ABOUT_JOBS,
  ABOUT_JOBS_INTRO,
  ABOUT_MISSION,
  ABOUT_PARTNERS,
  ABOUT_PROBLEMS,
  ABOUT_STATS,
  ABOUT_TEAM,
} from '@/data/about';
import { getSupportAction } from '@/lib/support';
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

export function AboutPage() {
  const supportAction = getSupportAction();

  return (
    <main id="main" className={styles.root}>
      {/* ── Интро ─────────────────────────────────────────────── */}
      <section className={styles.hero} aria-labelledby="about-hero-title">
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>{ABOUT_INTRO.eyebrow}</span>
          <h1 id="about-hero-title" className={styles.heroTitle}>
            {ABOUT_INTRO.title}
          </h1>
          <p className={styles.heroLead}>{ABOUT_INTRO.lead}</p>
          <p className={styles.tagline}>{ABOUT_INTRO.tagline}</p>
          <div className={styles.heroActions}>
            <Button variant="primary" size="md" {...supportAction}>
              Поддержать проект
            </Button>
            <Button variant="outline" size="md" href="#about-contacts">
              Связаться с нами
            </Button>
          </div>
        </div>
        <PhotoPlaceholder className={styles.heroMedia} label="Фото команды (скоро)" />
      </section>

      {/* ── Миссия и проблема ─────────────────────────────────── */}
      <section className={styles.section} aria-labelledby="about-mission-title">
        <h2 id="about-mission-title" className={styles.sectionTitle}>
          Зачем мы нужны городу
        </h2>
        <p className={styles.sectionLead}>{ABOUT_MISSION.context}</p>

        <h3 className={styles.problemsTitle}>{ABOUT_MISSION.problemsTitle}</h3>
        <ul className={styles.problemsGrid}>
          {ABOUT_PROBLEMS.map((problem) => (
            <li key={problem.id} className={styles.problemCard}>
              <span className={styles.problemMarker} aria-hidden="true" />
              <p className={styles.problemText}>{problem.text}</p>
            </li>
          ))}
        </ul>

        <div className={styles.callout}>
          <p className={styles.calloutText}>{ABOUT_MISSION.conclusion}</p>
        </div>
      </section>

      {/* ── «Окколо» сегодня — в цифрах ───────────────────────── */}
      <section className={styles.section} aria-labelledby="about-today-title">
        <h2 id="about-today-title" className={styles.sectionTitle}>
          «Окколо» сегодня
        </h2>
        <p className={styles.sectionLead}>{ABOUT_JOBS_INTRO}</p>
        <ul className={styles.statsBand}>
          {ABOUT_STATS.map((stat) => (
            <li key={stat.id} className={styles.statCard}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Рабочие места ─────────────────────────────────────── */}
      <section className={styles.section} aria-labelledby="about-jobs-title">
        <h2 id="about-jobs-title" className={styles.sectionTitle}>
          Где работают наши резиденты
        </h2>
        <ul className={styles.cardsGrid}>
          {ABOUT_JOBS.map((job) => (
            <li key={job.id} className={styles.card}>
              <PhotoPlaceholder className={styles.cardThumb} />
              <h3 className={styles.cardTitle}>{job.title}</h3>
              <p className={styles.cardText}>{job.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Чем мы живём ──────────────────────────────────────── */}
      <section className={styles.section} aria-labelledby="about-features-title">
        <h2 id="about-features-title" className={styles.sectionTitle}>
          Чем мы живём
        </h2>
        <ul className={styles.cardsGrid}>
          {ABOUT_FEATURES.map((feature) => (
            <li key={feature.id} className={styles.card}>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardText}>{feature.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Партнёры ──────────────────────────────────────────── */}
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
        <p className={styles.partnersNote}>Логотипы партнёров появятся позже.</p>
      </section>

      {/* ── Команда ───────────────────────────────────────────── */}
      <section className={styles.section} aria-labelledby="about-team-title">
        <h2 id="about-team-title" className={styles.sectionTitle}>
          Наша команда
        </h2>
        <ul className={styles.teamGrid}>
          {ABOUT_TEAM.map((member) => (
            <li key={member.id} className={styles.teamCard}>
              <PhotoPlaceholder className={styles.teamPhoto} />
              <p className={styles.teamName}>{member.name}</p>
              <p className={styles.teamRole}>{member.role}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Контакты ──────────────────────────────────────────── */}
      <section
        id="about-contacts"
        className={styles.section}
        aria-labelledby="about-contacts-title"
      >
        <h2 id="about-contacts-title" className={styles.sectionTitle}>
          Контакты
        </h2>
        <div className={styles.contactCard}>
          <div className={styles.contactPerson}>
            <span className={styles.contactPersonName}>{ABOUT_CONTACTS.lead}</span>
            <span className={styles.contactPersonRole}>{ABOUT_CONTACTS.leadRole}</span>
          </div>

          <ul className={styles.contactList}>
            {ABOUT_CONTACTS.phoneHref ? (
              <li>
                <a className={styles.contactLink} href={ABOUT_CONTACTS.phoneHref}>
                  {ABOUT_CONTACTS.phone}
                </a>
              </li>
            ) : null}
            <li>
              <a
                className={styles.contactLink}
                href={ABOUT_CONTACTS.telegramHref}
                target="_blank"
                rel="noreferrer"
              >
                Telegram
              </a>
            </li>
            <li>
              <a
                className={styles.contactLink}
                href={ABOUT_CONTACTS.vkHref}
                target="_blank"
                rel="noreferrer"
              >
                ВКонтакте
              </a>
            </li>
            <li>
              <a className={styles.contactLink} href={ABOUT_CONTACTS.emailHref}>
                {ABOUT_CONTACTS.email}
              </a>
            </li>
          </ul>

          <p className={styles.contactAddress}>
            {ABOUT_CONTACTS.address} —{' '}
            <a
              className={styles.inlineLink}
              href={ABOUT_CONTACTS.mapUrl}
              target="_blank"
              rel="noreferrer"
            >
              посмотреть на карте
            </a>
          </p>

          <div className={styles.contactActions}>
            <Button variant="primary" size="md" {...supportAction}>
              Поддержать проект
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
