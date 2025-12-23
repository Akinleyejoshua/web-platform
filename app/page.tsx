'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Header, Hero, About, Experience, Projects, Contact, Footer } from '@/app/components';
import { IHero } from '@/app/lib/models/hero';
import { IAbout } from '@/app/lib/models/about';
import { IContact } from '@/app/lib/models/contact';
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

    // Track page view
    axios.post('/api/analytics').catch(console.error);
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

      <Hero
        headline={hero?.headline}
        subtext={hero?.subtext}
        primaryCtaText={hero?.primaryCtaText}
        primaryCtaLink={hero?.primaryCtaLink}
        secondaryCtaText={hero?.secondaryCtaText}
        secondaryCtaLink={hero?.secondaryCtaLink}
        heroImage={hero?.heroImage}
      />

      <About
        bio={about?.bio}
        socialLinks={about?.socialLinks}
      />

      <Experience />

      <Projects />

      <Contact
        email={contact?.email}
        phone={contact?.phone}
      />

      <Footer />
    </main>
  );
}
