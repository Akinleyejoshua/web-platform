'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { FiCalendar, FiClock, FiEye, FiChevronRight } from 'react-icons/fi';
import { Header, Hero, About, Experience, Projects, ProductProjects, Skills, Contact, Footer, Loader } from '@/app/components';
import { IHero } from '@/app/lib/models/hero';
import { IAbout } from '@/app/lib/models/about';
import { IContact } from '@/app/lib/models/contact';
import { ISkill } from '@/app/lib/models/skill';
import { IExperience } from '@/app/lib/models/experience';
import { IProject } from '@/app/lib/models/project';
import { IProductProject } from '@/app/lib/models/productProject';
import { usePageViewTracker, useSectionViewTracker } from '@/app/hooks/useAnalyticsTracker';
import { optimizeImageUrl } from '@/app/lib/image-utils';
import styles from './page.module.css';
import blogStyles from './blog/blog.module.css';
import cacheData from '@/app/lib/cache-data';

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
  skills: ISkill[] | undefined;
  experience: IExperience[] | undefined;
  projects: IProject[] | undefined;
  projectsTotal: number;
  productProjects: IProductProject[] | undefined;
  productProjectsTotal: number;
}

const defaultHero: IHero = {
  headline: 'Joshua Akinleye',
  subtext: "I'm a Full Stack Developer & Machine Learning Engineer. As a Lead full-stack developer and ML Engineer, I possess a diverse skill set, proficient in both front-end and back-end and data-science technologies.",
  primaryCtaText: 'View Projects',
  primaryCtaLink: '#projects',
  secondaryCtaText: 'Get In Touch',
  secondaryCtaLink: '#contact',
  heroImage: '/hero-image.jpg',
} as any;

const defaultAbout: IAbout = {
  bio: "As a Lead full-stack developer and ML Engineer, I possess a diverse skill set, proficient in both front-end and back-end and data-science technologies.\n\nMy expertise includes designing user interfaces, implementing server-side logic, managing databases, building and deploying ML models. With a solid understanding of web development frameworks and languages, I contribute to creating seamless and efficient applications.\n\nMy problem-solving abilities and adaptability make me a valuable asset in the ever-evolving landscape of software development.",
  socialLinks: [
    { platform: 'github', url: 'http://github.com/Akinleyejoshua', icon: 'github' },
    { platform: 'turing', url: 'https://matching.turing.com/developer-resume-preview/94fcd098ef28063a611a36b6c211b83394302204b3221e', icon: 'linkedin' },
    { platform: 'linkedin', url: 'https://linkedin.com/in/joshua-a-9895b61ab', icon: 'linkedin' },
    { platform: 'website', url: 'https://akinleyejoshua.vercel.app', icon: 'globe' },
  ],
} as any;

const defaultContact: IContact = {
  email: 'akinleyejoshua.dev@gmail.com',
  phone: '23408131519518',
} as any;

export default function Home() {
  const [data, setData] = useState<PortfolioData>({
    hero: null,
    about: null,
    contact: null,
    latestBlogs: [],
    skills: undefined,
    experience: undefined,
    projects: undefined,
    projectsTotal: 0,
    productProjects: undefined,
    productProjectsTotal: 0,
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
        setIsLoading(true);
        const [configRes, settingsRes] = await Promise.all([
          axios.get(`/api/cache-config?t=${Date.now()}`, {
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          }),
          axios.get('/api/settings')
        ]);

        const enableCache = configRes.data?.enableCache;
        const cachedSections = configRes.data?.cachedSections || [];
        const currentSettings = settingsRes.data;
        const limit = currentSettings?.projectsLimit || 4;

        const cache: any = cacheData || {};
        const cacheLoaded = Object.keys(cache).length > 0;

        // Helper to check if a section is cached
        const isCached = (section: string) => {
          return enableCache && cacheLoaded && cachedSections.includes(section) && cache[section] !== undefined && cache[section] !== null;
        };

        // Helper to extract data from wrapped cache structure
        function getSectionData<T>(section: string, fallback: T): T {
          const entry = cache[section];
          if (entry && typeof entry === 'object' && entry !== null && 'data' in entry) {
            return (entry as any).data as T;
          }
          return (entry as T) || fallback;
        }

        // Prepare the promises: resolve from cache if exists, otherwise fetch from DB
        const heroPromise = isCached('hero') 
          ? Promise.resolve({ data: getSectionData('hero', defaultHero) }) 
          : axios.get('/api/hero');

        const aboutPromise = isCached('about') 
          ? Promise.resolve({ data: getSectionData('about', defaultAbout) }) 
          : axios.get('/api/about');

        const contactPromise = isCached('contact') 
          ? Promise.resolve({ data: getSectionData('contact', defaultContact) }) 
          : axios.get('/api/contact');

        const blogPromise = isCached('blog') 
          ? Promise.resolve({ data: getSectionData('blog', []) }) 
          : axios.get('/api/blog');

        const skillsPromise = isCached('skills') 
          ? Promise.resolve({ data: getSectionData('skills', []) }) 
          : axios.get('/api/skills');

        const experiencePromise = isCached('experience') 
          ? Promise.resolve({ data: getSectionData('experience', []) }) 
          : axios.get('/api/experience');

        const projectsPromise = isCached('projects') 
          ? Promise.resolve({ data: { data: getSectionData('projects', []), total: getSectionData('projects', []).length } }) 
          : axios.get('/api/projects', { params: { page: 1, limit } });

        const productsPromise = isCached('product-projects') 
          ? Promise.resolve({ data: { data: getSectionData('product-projects', []), total: getSectionData('product-projects', []).length } }) 
          : axios.get('/api/product-projects', { params: { page: 1, limit } });

        // Query database endpoints in parallel ONLY for the uncached sections
        const [heroRes, aboutRes, contactRes, blogRes, skillsRes, experienceRes, projectsRes, productsRes] = await Promise.all([
          heroPromise,
          aboutPromise,
          contactPromise,
          blogPromise,
          skillsPromise,
          experiencePromise,
          projectsPromise,
          productsPromise
        ]);

        const projectsData = projectsRes.data?.data ?? projectsRes.data ?? [];
        const projectsTotal = projectsRes.data?.total ?? (Array.isArray(projectsRes.data) ? projectsRes.data.length : 0);
        
        const productsData = productsRes.data?.data ?? productsRes.data ?? [];
        const productsTotal = productsRes.data?.total ?? (Array.isArray(productsRes.data) ? productsRes.data.length : 0);

        setData({
          hero: heroRes.data || defaultHero,
          about: aboutRes.data || defaultAbout,
          contact: contactRes.data || defaultContact,
          latestBlogs: Array.isArray(blogRes.data) ? blogRes.data.slice(0, 3) : [],
          skills: skillsRes.data || [],
          experience: experienceRes.data || [],
          projects: Array.isArray(projectsData) ? projectsData.slice(0, limit) : [],
          projectsTotal,
          productProjects: Array.isArray(productsData) ? productsData.slice(0, limit) : [],
          productProjectsTotal: productsTotal,
        });
      } catch (error) {
        console.error('Failed to fetch portfolio data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
          isLoading={isLoading}
        />
      </section>

      <section ref={aboutRef} id="about-section">
        <About
          bio={about?.bio}
          socialLinks={about?.socialLinks}
          isLoading={isLoading}
        />
      </section>

      <section ref={experienceRef} id="experience-section">
        <Experience initialData={data.experience} />
      </section>

       <section ref={skillsRef} id="skills-section">
        <Skills initialData={data.skills} />
      </section>

      <section ref={productsRef} id="products-section">
        <ProductProjects initialData={data.productProjects} initialTotal={data.productProjectsTotal} />
      </section>

      <section ref={projectsRef} id="projects-section">
        <Projects initialData={data.projects} initialTotal={data.projectsTotal} />
      </section>

     

        {(isLoading || latestBlogs.length > 0) && (
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
              {isLoading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <article key={idx} className={blogStyles.blogCard} style={{ pointerEvents: 'none' }}>
                    <div className={`${blogStyles.cardHeader} skeleton`} style={{ height: '200px', width: '100%' }} />
                    <div className={blogStyles.cardBody}>
                      <div className={blogStyles.metaRow} style={{ gap: '12px' }}>
                        <div className="skeleton" style={{ width: '80px', height: '14px' }} />
                        <div className="skeleton" style={{ width: '50px', height: '14px' }} />
                      </div>
                      <div className="skeleton" style={{ width: '85%', height: '1.5rem', margin: '15px 0' }} />
                      <div className="skeleton" style={{ width: '100%', height: '14px', marginBottom: '8px' }} />
                      <div className="skeleton" style={{ width: '90%', height: '14px', marginBottom: '20px' }} />
                      <div className={blogStyles.tagsRow} style={{ gap: '8px', display: 'flex' }}>
                        <div className="skeleton" style={{ width: '50px', height: '20px', borderRadius: '10px' }} />
                        <div className="skeleton" style={{ width: '50px', height: '20px', borderRadius: '10px' }} />
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                latestBlogs.map((blog) => (
                  <article key={blog._id} className={blogStyles.blogCard}>
                    <div className={blogStyles.cardHeader}>
                      {blog.coverImage ? (
                        <img
                          src={optimizeImageUrl(blog.coverImage, 640)}
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
                ))
              )}
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
          isLoading={isLoading}
        />
      </section>

      <Footer socialLinks={about?.socialLinks} />
    </main>
  );
}


