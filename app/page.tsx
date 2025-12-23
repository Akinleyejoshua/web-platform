'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Header, Hero, About, Experience, Projects, Contact, Footer } from '@/app/components';
import { IHero } from '@/app/lib/models/hero';
import { IAbout } from '@/app/lib/models/about';
import { IContact } from '@/app/lib/models/contact';
import { usePageViewTracker, useSectionViewTracker } from '@/app/hooks/useAnalyticsTracker';
import styles from './page.module.css';

interface PortfolioData {
  hero: IHero | null;
  about: IAbout | null;
  contact: IContact | null;
}

export default function Home() {
  const [data, setData] = useState<PortfolioData>({
    hero: null,
    about: null,
    contact: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Section refs for tracking
  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const experienceRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  // Track page view (with localStorage deduplication)
  usePageViewTracker('home');

  // Track section views
  useSectionViewTracker('hero', heroRef);
  useSectionViewTracker('about', aboutRef);
  useSectionViewTracker('experience', experienceRef);
  useSectionViewTracker('projects', projectsRef);
  useSectionViewTracker('contact', contactRef);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroRes, aboutRes, contactRes] = await Promise.all([
          axios.get('/api/hero'),
          axios.get('/api/about'),
          axios.get('/api/contact'),
        ]);

        setData({
          hero: heroRes.data,
          about: aboutRes.data,
          contact: contactRes.data,
        });
      } catch (error) {
        console.error('Failed to fetch portfolio data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
      </div>
    );
  }

  const { hero, about, contact } = data;

  return (
    <main className={styles.main}>
      <Header />

      <section ref={heroRef} id="home">
        <Hero
          headline={hero?.headline}
          subtext={hero?.subtext}
          primaryCtaText={hero?.primaryCtaText}
          primaryCtaLink={hero?.primaryCtaLink}
          secondaryCtaText={hero?.secondaryCtaText}
          secondaryCtaLink={hero?.secondaryCtaLink}
          heroImage={hero?.heroImage}
        />
      </section>

      <section ref={aboutRef} id="about-section">
        <About
          bio={about?.bio}
          socialLinks={about?.socialLinks}
        />
      </section>

      <section ref={experienceRef} id="experience-section">
        <Experience />
      </section>

      <section ref={projectsRef} id="projects-section">
        <Projects />
      </section>

      <section ref={contactRef} id="contact-section">
        <Contact
          email={contact?.email}
          phone={contact?.phone}
        />
      </section>

      <Footer />
    </main>
  );
}

