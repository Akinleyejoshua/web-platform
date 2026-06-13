'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { FiCalendar, FiClock, FiEye, FiChevronRight } from 'react-icons/fi';
import { Header, Hero, About, Experience, Projects, ProductProjects, Skills, Contact, Footer, Loader } from '@/app/components';
import { IHero } from '@/app/lib/models/hero';
import { IAbout } from '@/app/lib/models/about';
import { IContact } from '@/app/lib/models/contact';
import { usePageViewTracker, useSectionViewTracker } from '@/app/hooks/useAnalyticsTracker';
import styles from './page.module.css';
import blogStyles from './blog/blog.module.css';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  tags: string[];
  createdAt: string;
  views?: number;
  content: string;
}

interface PortfolioData {
  hero: IHero | null;
  about: IAbout | null;
  contact: IContact | null;
  latestBlogs: BlogPost[];
}

export default function Home() {
  const [data, setData] = useState<PortfolioData>({
    hero: null,
    about: null,
    contact: null,
    latestBlogs: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // Section refs for tracking
  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const experienceRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const productsRef = useRef<HTMLElement>(null);  const skillsRef = useRef<HTMLElement>(null);  const blogsRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  // Track page view (with localStorage deduplication)
  usePageViewTracker('home');

  // Track section views
  useSectionViewTracker('hero', heroRef);
  useSectionViewTracker('about', aboutRef);
  useSectionViewTracker('experience', experienceRef);
  useSectionViewTracker('products', productsRef);
  useSectionViewTracker('projects', projectsRef);
  useSectionViewTracker('skills', skillsRef);
  useSectionViewTracker('latest-blogs', blogsRef);
  useSectionViewTracker('contact', contactRef);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroRes, aboutRes, contactRes, blogRes] = await Promise.all([
          axios.get('/api/hero'),
          axios.get('/api/about'),
          axios.get('/api/contact'),
          axios.get('/api/blog'),
        ]);

        setData({
          hero: heroRes.data,
          about: aboutRes.data,
          contact: contactRes.data,
          latestBlogs: blogRes.data ? blogRes.data.slice(0, 3) : [],
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
    return <Loader variant="fullscreen" />;
  }

  const { hero, about, contact, latestBlogs } = data;

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

      <section ref={productsRef} id="products-section">
        <ProductProjects />
      </section>

      <section ref={projectsRef} id="projects-section">
        <Projects />
      </section>

      <section ref={skillsRef} id="skills-section">
        <Skills />
      </section>

      {latestBlogs.length > 0 && (
        <section ref={blogsRef} id="latest-blogs-section" style={{ padding: '6rem 0', borderBottom: '1px solid var(--color-border)' }}>
          <div className={blogStyles.container}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <span className={blogStyles.badge}>Engineering Blog</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '10px 0', color: '#ffffff' }}>Latest Technical Articles</h2>
              <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                Deep dives, tutorials, and insights on web engineering, architecture, and software development.
              </p>
            </div>

            <div className={blogStyles.blogGrid}>
              {latestBlogs.map((blog) => (
                <article key={blog._id} className={blogStyles.blogCard}>
                  <div className={blogStyles.cardHeader}>
                    {blog.coverImage ? (
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className={blogStyles.coverImage}
                        loading="lazy"
                      />
                    ) : (
                      <div className={blogStyles.coverFallback}>
                        {blog.title.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className={blogStyles.cardBody}>
                    <div className={blogStyles.metaRow}>
                      <span className={blogStyles.metaItem}>
                        <FiCalendar size={14} />
                        {new Date(blog.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <span className={blogStyles.metaItem}>
                        <FiClock size={14} />
                        {(() => {
                          const words = blog.content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
                          return `${Math.ceil(words / 200)} min`;
                        })()}
                      </span>
                      <span className={blogStyles.metaItem}>
                        <FiEye size={14} />
                        {blog.views || 0}
                      </span>
                    </div>

                    <h3 className={blogStyles.cardTitle}>
                      <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                    </h3>

                    <p className={blogStyles.cardExcerpt}>{blog.excerpt}</p>

                    <div className={blogStyles.tagsRow}>
                      {blog.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className={blogStyles.cardTag}>
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className={blogStyles.cardFooter}>
                      <Link href={`/blog/${blog.slug}`} className={blogStyles.readMoreLink}>
                        Read Article <FiChevronRight />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <Link
                href="/blog"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, var(--color-accent), #8b5cf6)',
                  color: '#ffffff',
                  padding: '12px 28px',
                  borderRadius: '30px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.3)';
                }}
              >
                View All Articles <FiChevronRight />
              </Link>
            </div>
          </div>
        </section>
      )}



      <section ref={contactRef} id="contact-section">
        <Contact
          email={contact?.email}
          phone={contact?.phone}
          socialLinks={about?.socialLinks}
        />
      </section>

      <Footer socialLinks={about?.socialLinks} />
    </main>
  );
}


