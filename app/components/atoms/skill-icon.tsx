'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { ISkill } from '@/app/lib/models/skill';
import { getTechIcon, getTechBrandColor } from '@/app/lib/tech-icons';
import styles from './skill-icon.module.css';

interface SkillIconProps {
    skillName: string;
    size?: number;
    className?: string;
}

interface SkillData {
    name: string;
    iconName: string;
    color?: string;
}

export function SkillIcon({ skillName, size = 16, className = '' }: SkillIconProps) {
    const [iconData, setIconData] = useState<SkillData | null>(null);
    const [loadedIcon, setLoadedIcon] = useState<React.ReactNode>(null);

    useEffect(() => {
        async function fetchSkill() {
            if (!skillName) return;
            
            const normalizedName = skillName.toLowerCase().trim();
            
            try {
                const res = await fetch(`/api/skills?name=${encodeURIComponent(normalizedName)}`);
                if (res.ok) {
                    const skills: ISkill[] = await res.json();
                    if (skills.length > 0) {
                        const skill = skills[0];
                        setIconData({
                            name: skill.name,
                            iconName: skill.iconName,
                            color: skill.color,
                        });
                        
                        // Get the icon component
                        const IconComponent = getTechIcon(skill.iconName || normalizedName);
                        const brandColor = skill.color || getTechBrandColor(skill.iconName || normalizedName) || 'var(--color-text-secondary)';
                        
                        // Create the icon element
                        const iconProps: Record<string, any> = { size, color: brandColor };
                        setLoadedIcon(
                            React.createElement(IconComponent, iconProps)
                        );
                        return;
                    }
                }
            } catch (error) {
                console.warn(`Failed to fetch skill icon for "${skillName}":`, error);
            }
            
            // Fallback: use direct lookup from skill name
            const IconComponent = getTechIcon(normalizedName);
            const brandColor = getTechBrandColor(normalizedName) || 'var(--color-text-secondary)';
            const fallbackProps: Record<string, any> = { size, color: brandColor };
            setLoadedIcon(
                React.createElement(IconComponent, fallbackProps)
            );
        }
        
        fetchSkill();
    }, [skillName, size]);

    if (!skillName) return null;

    const displayName = iconData?.name || skillName;

    return (
        <span 
            className={`${styles.skillIcon} ${className}`}
            title={displayName}
        >
            {loadedIcon}
        </span>
    );
}
