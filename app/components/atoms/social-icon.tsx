import React from 'react';
import {
    PiGithubLogo, PiTwitterLogo, PiLinkedinLogo, PiInstagramLogo,
    PiYoutubeLogo, PiFacebookLogo, PiRedditLogo, PiTiktokLogo,
    PiSnapchatLogo, PiPinterestLogo, PiDiscordLogo, PiTwitchLogo,
    PiTelegramLogo, PiWhatsappLogo, PiMediumLogo, PiDribbbleLogo,
    PiBehanceLogo, PiLinkSimple
} from 'react-icons/pi';

interface SocialIconProps {
    platform: string;
    size?: number;
    className?: string;
}

export function SocialIcon({ platform, size = 20, className }: SocialIconProps) {
    const p = platform.toLowerCase().trim();

    if (p.includes('github')) return <PiGithubLogo size={size} className={className} />;
    if (p.includes('twitter') || p === 'x') return <PiTwitterLogo size={size} className={className} />;
    if (p.includes('linkedin')) return <PiLinkedinLogo size={size} className={className} />;
    if (p.includes('instagram')) return <PiInstagramLogo size={size} className={className} />;
    if (p.includes('youtube')) return <PiYoutubeLogo size={size} className={className} />;
    if (p.includes('facebook')) return <PiFacebookLogo size={size} className={className} />;
    if (p.includes('reddit')) return <PiRedditLogo size={size} className={className} />;
    if (p.includes('tiktok')) return <PiTiktokLogo size={size} className={className} />;
    if (p.includes('snapchat')) return <PiSnapchatLogo size={size} className={className} />;
    if (p.includes('pinterest')) return <PiPinterestLogo size={size} className={className} />;
    if (p.includes('discord')) return <PiDiscordLogo size={size} className={className} />;
    if (p.includes('twitch')) return <PiTwitchLogo size={size} className={className} />;
    if (p.includes('telegram')) return <PiTelegramLogo size={size} className={className} />;
    if (p.includes('whatsapp')) return <PiWhatsappLogo size={size} className={className} />;
    if (p.includes('medium')) return <PiMediumLogo size={size} className={className} />;
    if (p.includes('dribbble')) return <PiDribbbleLogo size={size} className={className} />;
    if (p.includes('behance')) return <PiBehanceLogo size={size} className={className} />;
    if (p.includes('turing')) return <PiLinkSimple size={size} className={className} />;

    return <PiLinkSimple size={size} className={className} />;
}
