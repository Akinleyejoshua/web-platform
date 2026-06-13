'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { FiDownload } from 'react-icons/fi';
import { Loader } from '@/app/components/atoms/loader';
import styles from './resume.module.css';
import { IAbout } from '@/app/lib/models/about';
import { IContact } from '@/app/lib/models/contact';
import { IExperience } from '@/app/lib/models/experience';
import { IProject } from '@/app/lib/models/project';
import { IHero } from '@/app/lib/models/hero';
import { IResume } from '@/app/lib/models/resume';

interface ResumeData {
    hero: IHero | null;
    about: IAbout | null;
    contact: IContact | null;
    experience: IExperience[];
    projects: IProject[];
    resumeTemplate?: IResume | null;
}

// Map friendly domain names to actual DB category values
const domainToCategoryMap: Record<string, string> = {
    'machine_learning': 'ml',
    'machine-learning': 'ml',
    'ml': 'ml',
    'web': 'web',
    'web3': 'web3',
    'data_analysis': 'data-science',
    'data-analysis': 'data-science',
    'data_science': 'data-science',
    'data-science': 'data-science',
    'others': 'others',
};

function ResumeContent() {
    const searchParams = useSearchParams();
    const rawDomain = searchParams.get('domain');
    const domain = rawDomain ? (domainToCategoryMap[rawDomain.toLowerCase()] || rawDomain) : null;

    const [data, setData] = useState<ResumeData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchResumeData = async () => {
            try {
                // We use Promise.all to fetch all required portfolio sections in parallel
                // If domain exists, fetch specific category, otherwise fetch all
                const projectUrl = domain ? `/api/projects?category=${domain}` : '/api/projects?category=all';

                const [heroRes, aboutRes, contactRes, expRes, projRes, resumeRes] = await Promise.all([
                    axios.get('/api/hero'),
                    axios.get('/api/about'),
                    axios.get('/api/contact'),
                    axios.get('/api/experience'),
                    axios.get(projectUrl),
                    domain ? axios.get(`/api/resume?domain=${domain}`) : Promise.resolve(null)
                ]);

                let resumeTemplate: IResume | null = null;
                if (resumeRes && resumeRes.data) {
                    resumeTemplate = resumeRes.data;
                }

                setData({
                    hero: heroRes.data,
                    about: aboutRes.data,
                    contact: contactRes.data,
                    experience: expRes.data || [],
                    // Only get visible projects, limit to top 8 for resume
                    projects: (projRes.data || []).filter((p: IProject) => p.isVisible !== false).slice(0, 8),
                    resumeTemplate
                });
            } catch (error) {
                console.error("Failed to load resume data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResumeData();
    }, []);

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) {
        return <Loader variant="fullscreen" />;
    }

    if (!data) {
        return <div>Error loading resume data.</div>;
    }

    const { hero, about, contact, experience, projects, resumeTemplate } = data;

    // Use template summary if available, otherwise fall back to about.bio
    const summary = resumeTemplate?.summary && resumeTemplate.summary.trim() !== ''
        ? resumeTemplate.summary
        : about?.bio || '';

    // Date and Duration formatting helpers
    const formatDate = (dateStr: string | Date | null) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    const getDuration = (start: string | Date, end: string | Date | null, isCurrent: boolean) => {
        const startDate = new Date(start);
        const endDate = isCurrent || !end ? new Date() : new Date(end);
        
        let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
        months -= startDate.getMonth();
        months += endDate.getMonth();
        // Add 1 to inclusive month count if desired, keeping it simple for now
        months = months <= 0 ? 1 : months;

        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        const yearStr = years > 0 ? `${years} yr${years > 1 ? 's' : ''}` : '';
        const monthStr = remainingMonths > 0 ? `${remainingMonths} mo${remainingMonths > 1 ? 's' : ''}` : '';
        
        if (yearStr && monthStr) return `${yearStr} ${monthStr}`;
        if (yearStr) return yearStr;
        if (monthStr) return monthStr;
        return '1 mo';
    };

    // Extract useful links from About's social links
    const getSocialLink = (platformName: string) => {
        return about?.socialLinks?.find(link => link.platform.toLowerCase().includes(platformName))?.url;
    };

    const linkedin = getSocialLink('linkedin');
    const github = getSocialLink('github');
    const portfolioUrl = 'https://joshuapro.netlify.app';

    // Default Name extraction from Hero headline if not explicitly set elsewhere
    // Assuming headline is something like "Hi, I'm Joshua" or "Joshua Akinleye"
    // Since we don't have an explicit 'Name' field in the models, we hardcode or extract.
    // Let's use a solid default for the user if it's not in Hero.
    const name = "Joshua Akinleye"; 
    const role = hero?.headline || "Full Stack Developer";

    return (
        <div className={styles.resumeContainer}>
            <div className={styles.actions}>
                <button onClick={handlePrint} className={styles.downloadBtn}>
                    <FiDownload size={18} />
                    Download PDF
                </button>
            </div>

            <div className={styles.resumeDocument}>
                {/* Header Section */}
                <header className={styles.header}>
                    <h1 className={styles.name}>{name}</h1>
                    <div className={styles.contactInfo}>
                        {contact?.email && (
                            <span className={styles.contactItem}>
                                <a href={`mailto:${contact.email}`}>{contact.email}</a>
                            </span>
                        )}
                        {contact?.email && contact?.phone && <span className={styles.separator}>|</span>}
                        {contact?.phone && (
                            <span className={styles.contactItem}>
                                <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                            </span>
                        )}
                        
                        {linkedin && (
                            <>
                                <span className={styles.separator}>|</span>
                                <span className={styles.contactItem}>
                                    <a href={linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                                </span>
                            </>
                        )}
                        
                        {github && (
                            <>
                                <span className={styles.separator}>|</span>
                                <span className={styles.contactItem}>
                                    <a href={github} target="_blank" rel="noopener noreferrer">GitHub</a>
                                </span>
                            </>
                        )}
                        
                        {portfolioUrl && (
                            <>
                                <span className={styles.separator}>|</span>
                                <span className={styles.contactItem}>
                                    <a href={portfolioUrl} target="_blank" rel="noopener noreferrer">Portfolio</a>
                                </span>
                            </>
                        )}
                    </div>
                </header>

                {/* Professional Summary */}
                {summary && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Professional Summary</h2>
                        <div className={styles.summary}>
                            {summary}
                        </div>
                    </section>
                )}

                {/* Key Skills (from template) */}
                {resumeTemplate?.skills && resumeTemplate.skills.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Key Skills</h2>
                        <div className={styles.skillsGrid}>
                            {resumeTemplate.skills.map((skill, idx) => (
                                <div key={idx} className={styles.skillTag}>{skill}</div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Key Highlights (from template) */}
                {resumeTemplate?.highlights && resumeTemplate.highlights.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Key Highlights</h2>
                        <ul className={styles.highlightsList}>
                            {resumeTemplate.highlights.map((highlight, idx) => (
                                <li key={idx}>{highlight}</li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Experience Section */}
                {experience && experience.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Professional Experience</h2>
                        {experience.map((exp: any, index: number) => {
                            const formattedStart = formatDate(exp.startDate);
                            const formattedEnd = exp.isCurrent ? 'Present' : formatDate(exp.endDate);
                            const duration = getDuration(exp.startDate, exp.endDate, exp.isCurrent);

                            return (
                                <div key={index} className={styles.experienceItem}>
                                    <div className={styles.experienceHeader}>
                                        <div>
                                            <h3 className={styles.role}>{exp.role}</h3>
                                            <div className={styles.company}>{exp.company}</div>
                                        </div>
                                        <div className={styles.date}>
                                            {formattedStart} - {formattedEnd} <i>({duration})</i>
                                        </div>
                                    </div>
                                    {exp.description && Array.isArray(exp.description) ? (
                                        <ul className={styles.experienceDescList}>
                                            {exp.description.map((desc: string, i: number) => (
                                                <li key={i}>{desc}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className={styles.experienceDesc}>
                                            {exp.description}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </section>
                )}

                {/* Projects Section */}
                {projects && projects.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Key Projects</h2>
                        <div className={styles.projectsGrid}>
                            {projects.map((proj: any, index: number) => (
                                <div key={index} className={styles.projectItem}>
                                    <div className={styles.projectHeader}>
                                        <h3 className={styles.projectTitle}>
                                            {proj.liveLink ? (
                                                <a href={proj.liveLink} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                                                    {proj.title}
                                                </a>
                                            ) : (
                                                proj.title
                                            )}
                                        </h3>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            {proj.githubLink && (
                                                <a href={proj.githubLink} className={styles.projectLink} target="_blank" rel="noopener noreferrer">
                                                    GitHub: {proj.githubLink.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                                                </a>
                                            )}
                                            {proj.liveLink && (
                                                <a href={proj.liveLink} className={styles.projectLink} target="_blank" rel="noopener noreferrer">
                                                    Live: {proj.liveLink.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    {proj.technologies && proj.technologies.length > 0 && (
                                        <div className={styles.projectTech}>
                                            Tech Stack: {proj.technologies.join(', ')}
                                        </div>
                                    )}
                                    {proj.description && (
                                        <div className={styles.projectDesc}>
                                            {proj.description}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {portfolioUrl && (
                            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.95rem', fontStyle: 'italic', color: '#555' }}>
                                View more projects and detailed case studies on my portfolio at{' '}
                                <a href={portfolioUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc', textDecoration: 'underline' }}>
                                    {portfolioUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                                </a>
                            </div>
                        )}
                    </section>
                )}
            </div>
        </div>
    );
}

export default function ResumePage() {
    return (
        <Suspense fallback={<Loader variant="fullscreen" />}>
            <ResumeContent />
        </Suspense>
    );
}
