'use client';

import React from 'react';
import { FiMail, FiPhone, FiMapPin, FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';
import { Section } from '@/app/components/layout/section';
import styles from './contact.module.css';

interface ContactProps {
    email?: string;
    phone?: string;
}

export function Contact({
    email = 'akinleyejoshua.dev@gmail.com',
    phone = '+234 08131519518',
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
                        {email && (
                            <a href={`mailto:${email}`} className={styles.contactItem}>
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
                            <a href={`tel:${phone}`} className={styles.contactItem}>
                                <div className={styles.contactIcon}>
                                    <FiPhone size={20} />
                                </div>
                                <div className={styles.contactText}>
                                    <span className={styles.contactLabel}>Phone</span>
                                    <span className={styles.contactValue}>{phone}</span>
                                </div>
                            </a>
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

                    <div className={styles.socialSection}>
                        <p className={styles.socialLabel}>Connect with me</p>
                        <div className={styles.socialLinks}>
                            <a href="https://github.com/Akinleyejoshua" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                <FiGithub size={18} />
                            </a>
                            <a href="https://www.linkedin.com/in/joshua-a-9895b61ab/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                <FiLinkedin size={18} />
                            </a>
                            <a href="https://x.com/Joshuaakinleye4" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                <FiTwitter size={18} />
                            </a>
                        </div>
                    </div>

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
