import React from 'react';
import { 
    FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub, FaInstagram, FaYoutube, 
    FaRedditAlien, FaTiktok, FaLink, FaSnapchatGhost, FaPinterestP, FaDiscord, 
    FaTwitch, FaTelegramPlane, FaWhatsapp, FaMediumM, FaDribbble, FaBehance,
    FaXing
} from 'react-icons/fa';
import { FiLink } from 'react-icons/fi';

interface SocialIconProps {
    platform: string;
    size?: number;
    className?: string;
}

export function SocialIcon({ platform, size = 20, className }: SocialIconProps) {
    const p = platform.toLowerCase().trim();
    
    if (p.includes('github')) return <FaGithub size={size} className={className} />;
    if (p.includes('twitter') || p === 'x') return <FaTwitter size={size} className={className} />;
    if (p.includes('linkedin')) return <FaLinkedinIn size={size} className={className} />;
    if (p.includes('instagram')) return <FaInstagram size={size} className={className} />;
    if (p.includes('youtube')) return <FaYoutube size={size} className={className} />;
    if (p.includes('facebook')) return <FaFacebookF size={size} className={className} />;
    if (p.includes('reddit')) return <FaRedditAlien size={size} className={className} />;
    if (p.includes('tiktok')) return <FaTiktok size={size} className={className} />;
    if (p.includes('snapchat')) return <FaSnapchatGhost size={size} className={className} />;
    if (p.includes('pinterest')) return <FaPinterestP size={size} className={className} />;
    if (p.includes('discord')) return <FaDiscord size={size} className={className} />;
    if (p.includes('twitch')) return <FaTwitch size={size} className={className} />;
    if (p.includes('telegram')) return <FaTelegramPlane size={size} className={className} />;
    if (p.includes('whatsapp')) return <FaWhatsapp size={size} className={className} />;
    if (p.includes('medium')) return <FaMediumM size={size} className={className} />;
    if (p.includes('dribbble')) return <FaDribbble size={size} className={className} />;
    if (p.includes('behance')) return <FaBehance size={size} className={className} />;
    if (p.includes('turing')) return <FiLink size={size} className={className} />;
    
    return <FiLink size={size} className={className} />;
}
