import React from 'react';
import { Section } from '@/app/components/layout/section';
import { SocialLink } from '@/app/components/molecules/social-link';
import styles from './about.module.css';

interface SocialLinkData {
    platform: string;
    url: string;
}

interface AboutProps {
    bio?: string;
    socialLinks?: SocialLinkData[];
}

export function About({
    bio = 'A passionate developer creating innovative solutions.',
    socialLinks = [],
}: AboutProps) {
    // Split bio by newlines for paragraph formatting
    const bioParagraphs = bio.split('\n').filter((p) => p.trim());

    return (
        <Section
            id="about"
            title="About Me"
            subtitle="Get to know more about my journey and passion"
            className={styles.about}
            alternate
        >
            <div className={styles.content}>
                <div className={styles.bio}>
                    {bioParagraphs.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>

                {socialLinks.length > 0 && (
                    <div className={styles.socialWrapper}>
                        <span className={styles.socialLabel}>Connect with me</span>
                        <div className={styles.socials}>
                            {socialLinks.map((link) => (
                                <SocialLink
                                    key={link.platform}
                                    platform={link.platform}
                                    url={link.url}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Section>
    );
}
