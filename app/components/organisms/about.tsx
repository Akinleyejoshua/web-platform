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
    videoUrl?: string;
    videoPublic?: boolean;
    isLoading?: boolean;
}

export function About({
    bio = 'A passionate developer creating innovative solutions.',
    socialLinks = [],
    videoUrl = '',
    videoPublic = false,
    isLoading = false,
}: AboutProps) {
    const isHtml = /<[a-z][\s\S]*>/i.test(bio);
    const bioParagraphs = isHtml ? [] : bio.split('\n').filter((p) => p.trim());

    const getEmbedUrl = (url: string) => {
        if (!url) return null;
        
        // Youtube
        const youtubeReg = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const ytMatch = url.match(youtubeReg);
        if (ytMatch) {
            return { type: 'youtube', url: `https://www.youtube.com/embed/${ytMatch[1]}` };
        }

        // Loom
        const loomReg = /loom\.com\/(?:share|embed)\/([a-zA-Z0-9\-]+)/;
        const loomMatch = url.match(loomReg);
        if (loomMatch) {
            return { type: 'loom', url: `https://www.loom.com/embed/${loomMatch[1]}` };
        }

        // Vimeo
        const vimeoReg = /vimeo\.com\/(?:video\/)?([0-9]+)/;
        const vimeoMatch = url.match(vimeoReg);
        if (vimeoMatch) {
            return { type: 'vimeo', url: `https://player.vimeo.com/video/${vimeoMatch[1]}` };
        }

        // Direct video files
        if (/\.(mp4|webm|ogg)$/i.test(url) || url.includes('/video/') || url.includes('/uploads/')) {
            return { type: 'direct', url };
        }

        // Check if already an embed
        if (url.includes('embed') || url.includes('player')) {
            return { type: 'iframe', url };
        }

        return { type: 'direct', url };
    };

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
                        {isLoading ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', alignItems: 'center' }}>
                                <div className="skeleton" style={{ width: '100%', height: '1.25rem' }} />
                                <div className="skeleton" style={{ width: '95%', height: '1.25rem' }} />
                                <div className="skeleton" style={{ width: '85%', height: '1.25rem' }} />
                            </div>
                        ) : isHtml ? (
                            <div className={styles.richText} dangerouslySetInnerHTML={{ __html: bio }} />
                        ) : (
                            bioParagraphs.map((paragraph, index) => (
                                <p key={index} className={styles.paragraph}>{paragraph}</p>
                            ))
                        )}
                    </div>

                    {/* Video Player */}
                    {!isLoading && videoPublic && videoUrl && (() => {
                        const parsedVideo = getEmbedUrl(videoUrl);
                        if (!parsedVideo) return null;

                        return (
                            <div className={styles.videoWrapper}>
                                {parsedVideo.type === 'direct' ? (
                                    <video 
                                        src={parsedVideo.url} 
                                        controls 
                                        className={styles.videoElement}
                                    />
                                ) : (
                                    <iframe
                                        src={parsedVideo.url}
                                        allowFullScreen
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        className={styles.videoIframe}
                                    />
                                )}
                            </div>
                        );
                    })()}

                    {/* Footer Connections */}
                    {isLoading ? (
                        <div className={styles.footerSection}>
                            <div className={styles.divider} />
                            <div className={styles.socialWrapper}>
                                <span className={styles.socialLabel} style={{ display: 'inline-block' }}>
                                    <div className="skeleton" style={{ width: '120px', height: '1.25rem' }} />
                                </span>
                                <div className={styles.socials} style={{ justifyContent: 'center' }}>
                                    <div className="skeleton" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                                    <div className="skeleton" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                                    <div className="skeleton" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                                </div>
                            </div>
                        </div>
                    ) : socialLinks.length > 0 && (
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
