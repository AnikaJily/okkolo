import { useEffect, useState } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { DirectionsSection } from '@/components/sections/DirectionsSection';
import { EventsSection } from '@/components/sections/EventsSection';
import { EventsPage } from '@/components/pages/EventsPage';
import { EventDetailPage } from '@/components/pages/EventDetailPage';
import { ShowroomPage } from '@/components/pages/ShowroomPage';
import { WorkshopsPage } from '@/components/pages/WorkshopsPage';
import { CartProvider } from '@/context/CartContext';
import styles from './App.module.css';

export function App() {
  const [pathname, setPathname] = useState(() => window.location.pathname);
  const isEventsPage = pathname === '/events';
  const isShowroomPage = pathname === '/showroom';
  const isWorkshopsPage = pathname === '/workshops';
  const eventDetailId = pathname.match(/^\/events\/([^/]+)$/)?.[1];

  useEffect(() => {
    const updatePathname = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', updatePathname);
    return () => window.removeEventListener('popstate', updatePathname);
  }, []);

  return (
    <CartProvider>
      <div className={styles.viewport}>
      <div className={styles.page}>
        <Header />
        {eventDetailId ? (
          <EventDetailPage eventId={eventDetailId} />
        ) : isEventsPage ? (
          <EventsPage />
        ) : isShowroomPage ? (
          <ShowroomPage />
        ) : isWorkshopsPage ? (
          <WorkshopsPage />
        ) : (
          <main className={styles.main}>
            <HeroSection />
            <AboutSection />
            <DirectionsSection />
            <EventsSection />
          </main>
        )}
        <Footer />
      </div>
      </div>
    </CartProvider>
  );
}
