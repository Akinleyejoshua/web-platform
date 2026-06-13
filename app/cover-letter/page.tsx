'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { FiDownload, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import { Loader } from '@/app/components/atoms/loader';
import styles from './cover-letter.module.css';
import { IAbout } from '@/app/lib/models/about';
import { IContact } from '@/app/lib/models/contact';
import { IHero } from '@/app/lib/models/hero';

type CoverLetterDomain = 'web' | 'data-science' | 'ml' | 'web3' | 'others';

interface ICoverLetter {
    _id?: string;
    domain: CoverLetterDomain;
    recipientName: string;
    recipientTitle: string;
    company: string;
    companyAddress: string;
    greeting: string;
    intro: string;
    body: string;
    closing: string;
    signature: string;
    isActive: boolean;
}

interface CoverLetterData {
    coverLetter: ICoverLetter | null;
    hero: IHero | null;
    about: IAbout | null;
    contact: IContact | null;
}

// Map friendly domain names to actual DB domain values
const domainToCategoryMap: Record<string, CoverLetterDomain> = {
    'machine_learning': 'ml',
    'machine-learning': 'ml',
    'ml': 'ml',
    'web': 'web',
    'web3': 'web3',
    'data_analysis': 'data-science',
    'data-analysis': 'data-science',
    'data_science': 'data-science',
    'data-science': 'data-science',
    'data_analytics': 'data-science',
    'data-analytics': 'data-science',
    'others': 'others',
};

const DOMAIN_LABELS: Record<CoverLetterDomain, string> = {
    'web': 'Web Development',
    'data-science': 'Data Science / Analytics',
    'ml': 'Machine Learning',
    'web3': 'Web3',
    'others': 'Other Domains',
};

function CoverLetterContent() {
    const searchParams = useSearchParams();
    const rawDomain = searchParams.get('domain');
    const domain: CoverLetterDomain | null = rawDomain
        ? (domainToCategoryMap[rawDomain.toLowerCase()] as CoverLetterDomain) || null
        : null;

    const [data, setData] = useState<CoverLetterData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [heroRes, aboutRes, contactRes] = await Promise.all([
                    axios.get('/api/hero'),
                    axios.get('/api/about'),
                    axios.get('/api/contact'),
                ]);

                let coverLetter: ICoverLetter | null = null;

                if (domain) {
                    try {
                        const clRes = await axios.get(`/api/cover-letter?domain=${domain}`);
                        coverLetter = clRes.data;
                    } catch (err) {
                        console.warn(`No cover letter found for domain: ${domain}`);
                    }
                } else {
                    // No domain specified: try to fetch the first active cover letter
                    try {
                        const allRes = await axios.get('/api/cover-letter');
                        const list = allRes.data || [];
                        coverLetter = list.find((c: ICoverLetter) => c.isActive) || list[0] || null;
                    } catch (err) {
                        console.warn('Failed to fetch cover letters list');
                    }
                }

                setData({
                    coverLetter,
                    hero: heroRes.data,
                    about: aboutRes.data,
                    contact: contactRes.data,
                });
            } catch (err) {
                console.error('Failed to load cover letter data:', err);
                setError('Failed to load cover letter data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [domain]);

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) {
        return <Loader variant="fullscreen" />;
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <p>{error}</p>
                <Link href="/" className={styles.backLink}>
                    <FiArrowLeft size={16} /> Back to Home
                </Link>
            </div>
        );
    }

    if (!data) {
        return <div>Error loading cover letter data.</div>;
    }

    const { coverLetter, hero, about, contact } = data;

    // Extract useful links from About's social links
    const getSocialLink = (platformName: string) => {
        return about?.socialLinks?.find(link => link.platform.toLowerCase().includes(platformName))?.url;
    };

    const linkedin = getSocialLink('linkedin');
    const github = getSocialLink('github');
    const portfolioUrl = 'https://joshuapro.netlify.app';

    // Default name (matches resume page)
    const name = "Joshua Akinleye";
    const role = hero?.headline || "Full Stack Developer";

    // Current date formatted nicely
    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className={styles.coverLetterContainer}>
            <div className={styles.actions}>
                <Link href="/" className={styles.backBtn}>
                    <FiArrowLeft size={16} />
                    Back
                </Link>
                <button onClick={handlePrint} className={styles.downloadBtn}>
                    <FiDownload size={18} />
                    Download PDF
                </button>
            </div>

            <div className={styles.coverLetterDocument}>
                {/* Header / Sender Info */}
                <header className={styles.header}>
                    <h1 className={styles.name}>{name}</h1>
                    <div className={styles.role}>{role}</div>
                    <div className={styles.contactInfo}>
                        {contact?.email && (
                            <span className={styles.contactItem}>
                                <a href={`mailto:${contact.email}`}>{contact.email}</a>
                            </span>
                        )}
                        {contact?.email && contact?.phone && <span className={styles.separator}>•</span>}
                        {contact?.phone && (
                            <span className={styles.contactItem}>
                                <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                            </span>
                        )}
                        {linkedin && (
                            <>
                                <span className={styles.separator}>•</span>
                                <span className={styles.contactItem}>
                                    <a href={linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                                </span>
                            </>
                        )}
                        {github && (
                            <>
                                <span className={styles.separator}>•</span>
                                <span className={styles.contactItem}>
                                    <a href={github} target="_blank" rel="noopener noreferrer">GitHub</a>
                                </span>
                            </>
                        )}
                        {portfolioUrl && (
                            <>
                                <span className={styles.separator}>•</span>
                                <span className={styles.contactItem}>
                                    <a href={portfolioUrl} target="_blank" rel="noopener noreferrer">Portfolio</a>
                                </span>
                            </>
                        )}
                    </div>
                </header>

                {/* Date */}
                <div className={styles.date}>{today}</div>

                {coverLetter ? (
                    <>
                        {/* Recipient */}
                        <div className={styles.recipient}>
                            {coverLetter.recipientName && (
                                <div className={styles.recipientName}>{coverLetter.recipientName}</div>
                            )}
                            {coverLetter.recipientTitle && (
                                <div>{coverLetter.recipientTitle}</div>
                            )}
                            {coverLetter.company && (
                                <div className={styles.company}>{coverLetter.company}</div>
                            )}
                            {coverLetter.companyAddress && (
                                <div>{coverLetter.companyAddress}</div>
                            )}
                        </div>

                        {/* Domain Tag (hidden in print) */}
                        <div className={styles.domainTag}>
                            Tailored for: <strong>{DOMAIN_LABELS[coverLetter.domain]}</strong>
                        </div>

                        {/* Greeting */}
                        {coverLetter.greeting && (
                            <div className={styles.greeting}>{coverLetter.greeting}</div>
                        )}

                        {/* Intro */}
                        {coverLetter.intro && (
                            <div
                                className={styles.paragraph}
                                dangerouslySetInnerHTML={{ __html: coverLetter.intro }}
                            />
                        )}

                        {/* Body */}
                        {coverLetter.body && (
                            <div
                                className={styles.paragraph}
                                dangerouslySetInnerHTML={{ __html: coverLetter.body }}
                            />
                        )}

                        {/* Closing */}
                        {coverLetter.closing && (
                            <div className={styles.closing}>{coverLetter.closing}</div>
                        )}

                        {/* Signature */}
                        {coverLetter.signature && (
                            <div className={styles.signature}>{coverLetter.signature}</div>
                        )}
                    </>
                ) : (
                    <div className={styles.emptyState}>
                        <h2 className={styles.emptyTitle}>No Cover Letter Available</h2>
                        <p className={styles.emptyText}>
                            {domain
                                ? `No cover letter has been created for the "${DOMAIN_LABELS[domain]}" domain yet.`
                                : 'No cover letters have been created yet.'}
                        </p>
                        <p className={styles.emptyText}>
                            Please check back later or contact me directly at{' '}
                            {contact?.email ? (
                                <a href={`mailto:${contact.email}`}>{contact.email}</a>
                            ) : (
                                'my email'
                            )}.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function CoverLetterPage() {
    return (
        <Suspense fallback={<Loader variant="fullscreen" />}>
            <CoverLetterContent />
        </Suspense>
    );
}
