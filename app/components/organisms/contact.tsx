'use client';

import React from 'react';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { Section } from '@/app/components/layout/section';
import { SocialLink } from '@/app/components/molecules/social-link';
import { trackClick } from '@/app/hooks/useAnalyticsTracker';
import styles from './contact.module.css';

interface SocialLinkData {
    platform: string;
    url: string;
}

interface ContactProps {
    email?: string;
    phone?: string;
    socialLinks?: SocialLinkData[];
    isLoading?: boolean;
}

export function Contact({
    email = 'akinleyejoshua.dev@gmail.com',
    phone = '+234 08131519518',
    socialLinks = [],
    isLoading = false,
}: ContactProps) {
    return (
        <Section
            id="contact"
            title="Let's Connect"
            subtitle="Have a project in mind? Let's create something amazing together."
            className={styles.contact}
        >
            <div className={styles.gridCentered}>
                {/* Contact Info Card */}
                <div className={styles.infoCard}>
                    <h3 className={styles.infoTitle}>Contact Information</h3>
                    <p className={styles.infoSubtitle}>
                        Ready to collaborate? Reach out and I'll get back to you within 24 hours.
                    </p>

                    <div className={styles.contactItems}>
                        {isLoading ? (
                            <>
                                <div className={styles.contactItem}>
                                    <div className={styles.contactIcon}>
                                        <FiMail size={20} />
                                    </div>
                                    <div className={styles.contactText}>
                                        <span className={styles.contactLabel}>Email</span>
                                        <div className="skeleton" style={{ width: '180px', height: '1.25rem', marginTop: '4px' }} />
                                    </div>
                                </div>
                                <div className={styles.contactItem}>
                                    <div className={styles.contactIcon}>
                                        <FiPhone size={20} />
                                    </div>
                                    <div className={styles.contactText}>
                                        <span className={styles.contactLabel}>Phone</span>
                                        <div className="skeleton" style={{ width: '140px', height: '1.25rem', marginTop: '4px' }} />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {email && (
                                    <a href={`mailto:${email}`} className={styles.contactItem} onClick={() => trackClick('contact_email', true)}>
                                        <div className={styles.contactIcon}>
                                            <FiMail size={20} />
                                        </div>
                                        <div className={styles.contactText}>
                                            <span className={styles.contactLabel}>Email</span>
                                            <span className={styles.contactValue}>{email}</span>
                                        </div>
                                    </a>
                                )}

                                {phone && (
                                    <a href={`tel:${phone}`} className={styles.contactItem} onClick={() => trackClick('contact_phone', true)}>
                                        <div className={styles.contactIcon}>
                                            <FiPhone size={20} />
                                        </div>
                                        <div className={styles.contactText}>
                                            <span className={styles.contactLabel}>Phone</span>
                                            <span className={styles.contactValue}>{phone}</span>
                                        </div>
                                    </a>
                                )}
                            </>
                        )}

                        <div className={styles.contactItem}>
                            <div className={styles.contactIcon}>
                                <FiMapPin size={20} />
                            </div>
                            <div className={styles.contactText}>
                                <span className={styles.contactLabel}>Location</span>
                                <span className={styles.contactValue}>Available Worldwide (Remote)</span>
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className={styles.socialSection}>
                            <p className={styles.socialLabel}>Connect with me</p>
                            <div className={styles.socialLinks}>
                                <div className="skeleton" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                                <div className="skeleton" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                                <div className="skeleton" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                            </div>
                        </div>
                    ) : socialLinks.length > 0 && (
                        <div className={styles.socialSection}>
                            <p className={styles.socialLabel}>Connect with me</p>
                            <div className={styles.socialLinks}>
                                {socialLinks.map((link) => (
                                    <div key={link.platform} onClick={() => trackClick(`contact_${link.platform.toLowerCase()}`, true)}>
                                        <SocialLink
                                            platform={link.platform}
                                            url={link.url}
                                            className={styles.socialLink}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Decorative Elements */}
                    <div className={styles.decorCircle1} />
                    <div className={styles.decorCircle2} />
                </div>

                {/* Contact Form - Commented out for now */}
                {/*
                <div className={styles.formSide}>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name" className={styles.label}>Your Name</label>
                                <input type="text" id="name" name="name" className={styles.input} placeholder="John Doe" required />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="email" className={styles.label}>Your Email</label>
                                <input type="email" id="email" name="email" className={styles.input} placeholder="john@example.com" required />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="subject" className={styles.label}>Subject</label>
                            <input type="text" id="subject" name="subject" className={styles.input} placeholder="Project Inquiry" required />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="message" className={styles.label}>Message</label>
                            <textarea id="message" name="message" className={styles.textarea} placeholder="Tell me about your project..." rows={5} required />
                        </div>
                        <button type="submit" className={styles.submitBtn}>
                            Send Message
                            <FiArrowRight size={18} />
                        </button>
                    </form>
                </div>
                */}
            </div>
        </Section>
    );
}
