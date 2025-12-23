import React from 'react';
import { FiMail, FiPhone } from 'react-icons/fi';
import { Section } from '@/app/components/layout/section';
import styles from './contact.module.css';

interface ContactProps {
    email?: string;
    phone?: string;
}

export function Contact({
    email = 'hello@example.com',
    phone = '',
}: ContactProps) {
    return (
        <Section
            id="contact"
            title="Get In Touch"
            subtitle="Have a question or want to work together?"
            className={styles.contact}
        >
            <div className={styles.info}>
                {email && (
                    <div className={styles.item}>
                        <div className={styles.iconWrapper}>
                            <FiMail size={24} />
                        </div>
                        <div className={styles.details}>
                            <p className={styles.label}>Email</p>
                            <p className={styles.value}>
                                <a href={`mailto:${email}`}>{email}</a>
                            </p>
                        </div>
                    </div>
                )}

                {phone && (
                    <div className={styles.item}>
                        <div className={styles.iconWrapper}>
                            <FiPhone size={24} />
                        </div>
                        <div className={styles.details}>
                            <p className={styles.label}>Phone</p>
                            <p className={styles.value}>
                                <a href={`tel:${phone}`}>{phone}</a>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </Section>
    );
}
