import { lazy, Suspense, useEffect, useState } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutMissionSection } from '@/components/sections/AboutMissionSection';
import { AboutTodaySection } from '@/components/sections/AboutTodaySection';
import { DirectionsSection } from '@/components/sections/DirectionsSection';
import { EventsSection } from '@/components/sections/EventsSection';
import { ShowroomTeaser } from '@/components/sections/ShowroomTeaser';
import { LocationSection } from '@/components/sections/LocationSection';
// Подстраницы — lazy: главная (самый частый вход) не тянет код всех экранов.
// Named export → default через .then (баррели именованные).
const EventsPage = lazy(() =>
  import('@/components/pages/EventsPage').then((m) => ({ default: m.EventsPage })),
);
const EventDetailPage = lazy(() =>
  import('@/components/pages/EventDetailPage').then((m) => ({ default: m.EventDetailPage })),
);
const ShowroomPage = lazy(() =>
  import('@/components/pages/ShowroomPage').then((m) => ({ default: m.ShowroomPage })),
);
const WorkshopsPage = lazy(() =>
  import('@/components/pages/WorkshopsPage').then((m) => ({ default: m.WorkshopsPage })),
);
const CafePage = lazy(() =>
  import('@/components/pages/CafePage').then((m) => ({ default: m.CafePage })),
);
const AccessibilityPage = lazy(() =>
  import('@/components/pages/AccessibilityPage').then((m) => ({ default: m.AccessibilityPage })),
);
const ReportsPage = lazy(() =>
  import('@/components/pages/ReportsPage').then((m) => ({ default: m.ReportsPage })),
);
const AboutPage = lazy(() =>
  import('@/components/pages/AboutPage').then((m) => ({ default: m.AboutPage })),
);
const LegalPage = lazy(() =>
  import('@/components/pages/LegalPage').then((m) => ({ default: m.LegalPage })),
);
import { AccessibilityWidgetProvider } from '@/components/accessibility/AccessibilityWidget';
import { CartProvider } from '@/context/CartContext';
import { useDocumentTitle } from '@/lib/useDocumentTitle';
import styles from './App.module.css';

export function App() {
  const [pathname, setPathname] = useState(() => window.location.pathname);
  const isEventsPage = pathname === '/events';
  const isShowroomPage = pathname === '/showroom';
  const isWorkshopsPage = pathname === '/workshops';
  const isCafePage = pathname === '/cafe';
  const isAccessibilityPage = pathname === '/accessibility';
  const isReportsPage = pathname === '/reports';
  const isAboutPage = pathname === '/about';
  const isTermsPage = pathname === '/terms';
  const isPrivacyPage = pathname === '/privacy';
  const eventDetailId = pathname.match(/^\/events\/([^/]+)$/)?.[1];

  // Заголовки подстраниц ставят сами page-компоненты; здесь — только дефолт
  // для главной (важно при возврате по popstate без перезагрузки).
  const isHome =
    !eventDetailId &&
    !isEventsPage &&
    !isShowroomPage &&
    !isWorkshopsPage &&
    !isCafePage &&
    !isAccessibilityPage &&
    !isReportsPage &&
    !isAboutPage &&
    !isTermsPage &&
    !isPrivacyPage;
  useDocumentTitle(isHome ? undefined : false);

  useEffect(() => {
    const updatePathname = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', updatePathname);
    return () => window.removeEventListener('popstate', updatePathname);
  }, []);

  return (
    <CartProvider>
      <AccessibilityWidgetProvider>
        <div className={styles.viewport}>
          {/* Первый tab-стоп на каждой странице: мимо 8 стопов шапки сразу к контенту (SC 2.4.1) */}
          <a href="#main" className={styles.skipLink}>
            К содержимому
          </a>
          <Header />
          <div className={styles.page}>
          <Suspense fallback={<main id="main" className={styles.main} aria-busy="true" />}>
          {eventDetailId ? (
            <EventDetailPage eventId={eventDetailId} />
          ) : isEventsPage ? (
            <EventsPage />
          ) : isShowroomPage ? (
            <ShowroomPage />
          ) : isWorkshopsPage ? (
            <WorkshopsPage />
          ) : isCafePage ? (
            <CafePage />
          ) : isAccessibilityPage ? (
            <AccessibilityPage />
          ) : isReportsPage ? (
            <ReportsPage />
          ) : isAboutPage ? (
            <AboutPage />
          ) : isTermsPage ? (
            <LegalPage doc="terms" />
          ) : isPrivacyPage ? (
            <LegalPage doc="privacy" />
          ) : (
            <main id="main" className={styles.main}>
              <HeroSection />
              <AboutMissionSection />
              <AboutTodaySection />
              <DirectionsSection />
              <EventsSection />
              <ShowroomTeaser />
              <LocationSection />
            </main>
          )}
          </Suspense>
          </div>
          <Footer />
        </div>
      </AccessibilityWidgetProvider>
    </CartProvider>
  );
}
