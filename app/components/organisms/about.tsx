import React from 'react';
import { FiUser } from 'react-icons/fi';
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
    const isHtml = /<[a-z][\s\S]*>/i.test(bio);
    const bioParagraphs = isHtml ? [] : bio.split('\n').filter((p) => p.trim());

    return (
        <Section
            id="about"
            title="About Me"
            subtitle="Get to know more about my journey and passion"
            className={styles.about}
            alternate
        >
            <div className={styles.container}>
                <div className={styles.aboutCard}>
                    {/* Premium Header Decoration */}
                    <div className={styles.cardHeaderDecoration}>
                        <span className={styles.accentLine} />
                        <div className={styles.iconBadge}>
                            <FiUser size={20} />
                        </div>
                        <span className={styles.accentLine} />
                    </div>

                    {/* Bio Paragraphs */}
                    <div className={styles.bio}>
                        {isHtml ? (
                            <div className={styles.richText} dangerouslySetInnerHTML={{ __html: bio }} />
                        ) : (
                            bioParagraphs.map((paragraph, index) => (
                                <p key={index} className={styles.paragraph}>{paragraph}</p>
                            ))
                        )}
                    </div>

                    {/* Footer Connections */}
                    {socialLinks.length > 0 && (
                        <div className={styles.footerSection}>
                            <div className={styles.divider} />
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
                        </div>
                    )}
                </div>
            </div>
        </Section>
    );
}
