import { useEffect, useState } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/sections/HeroSection';
import { DirectionsSection } from '@/components/sections/DirectionsSection';
import { EventsSection } from '@/components/sections/EventsSection';
import { EventsPage } from '@/components/pages/EventsPage';
import { EventDetailPage } from '@/components/pages/EventDetailPage';
import { ShowroomPage } from '@/components/pages/ShowroomPage';
import { WorkshopsPage } from '@/components/pages/WorkshopsPage';
import { CafePage } from '@/components/pages/CafePage';
import { AccessibilityPage } from '@/components/pages/AccessibilityPage';
import { CartProvider } from '@/context/CartContext';
import styles from './App.module.css';

export function App() {
  const [pathname, setPathname] = useState(() => window.location.pathname);
  const isEventsPage = pathname === '/events';
  const isShowroomPage = pathname === '/showroom';
  const isWorkshopsPage = pathname === '/workshops';
  const isCafePage = pathname === '/cafe';
  const isAccessibilityPage = pathname === '/accessibility';
  const eventDetailId = pathname.match(/^\/events\/([^/]+)$/)?.[1];

  useEffect(() => {
    const updatePathname = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', updatePathname);
    return () => window.removeEventListener('popstate', updatePathname);
  }, []);

  return (
    <CartProvider>
      <div className={styles.viewport}>
        {/* Первый tab-стоп на каждой странице: мимо 8 стопов шапки сразу к контенту (SC 2.4.1) */}
        <a href="#main" className={styles.skipLink}>
          К содержимому
        </a>
        <Header />
        <div className={styles.page}>
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
          ) : (
            <main id="main" className={styles.main}>
              <HeroSection />
              <DirectionsSection />
              <EventsSection />
            </main>
          )}
        </div>
        <Footer />
      </div>
    </CartProvider>
  );
}
