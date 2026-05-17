import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { DirectionsSection } from '@/components/sections/DirectionsSection';
import { EventsSection } from '@/components/sections/EventsSection';
import styles from './App.module.css';

export function App() {
  return (
    <div className={styles.viewport}>
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <HeroSection />
          <AboutSection />
          <DirectionsSection />
          <EventsSection />
        </main>
      </div>
    </div>
  );
}
