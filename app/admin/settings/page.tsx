'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    FiType,
    FiDroplet,
    FiCheck,
    FiSave,
    FiRotateCcw,
    FiEye,
    FiAlertCircle,
    FiX,
    FiSliders,
    FiZap,
} from 'react-icons/fi';
import { useSettingsStore, SiteSettings } from '@/app/store/settings-store';
import styles from './settings.module.css';

// ===== CONSTANTS =====

const FONT_OPTIONS = [
    {
        family: 'Poppins',
        label: 'Poppins',
        description: 'Clean, geometric & modern',
        style: { fontFamily: 'var(--font-poppins), sans-serif' },
    },
    {
        family: 'Bricolage Grotesque',
        label: 'Bricolage',
        description: 'Bold, expressive & unique',
        style: { fontFamily: 'var(--font-bricolage), sans-serif' },
    },
    {
        family: 'Raleway',
        label: 'Raleway',
        description: 'Elegant, refined & minimal',
        style: { fontFamily: 'var(--font-raleway), sans-serif' },
    },
];

const SIZE_OPTIONS = [14, 15, 16, 17, 18];

const WEIGHT_OPTIONS = [
    { value: 300, label: 'Light' },
    { value: 400, label: 'Regular' },
    { value: 500, label: 'Medium' },
    { value: 600, label: 'Semi Bold' },
    { value: 700, label: 'Bold' },
];

const COLOR_PALETTE = [
    { hex: '#3b6ef0', name: 'Royal Blue' },
    { hex: '#6366f1', name: 'Indigo' },
    { hex: '#8b5cf6', name: 'Violet' },
    { hex: '#ec4899', name: 'Rose' },
    { hex: '#f43f5e', name: 'Coral' },
    { hex: '#f59e0b', name: 'Amber' },
    { hex: '#10b981', name: 'Emerald' },
    { hex: '#14b8a6', name: 'Teal' },
    { hex: '#0ea5e9', name: 'Ocean' },
    { hex: '#f97316', name: 'Sunset' },
    { hex: '#dc2626', name: 'Crimson' },
    { hex: '#64748b', name: 'Slate' },
];

const DEFAULT_SETTINGS: SiteSettings = {
    fontFamily: 'Bricolage Grotesque',
    fontSize: 16,
    fontWeight: 400,
    accentColor: '#3b6ef0',
    projectsLimit: 4,
    enableCache: false,
};

// ===== COMPONENT =====

export default function SettingsPage() {
    const { settings, fetchSettings, updateSettings, resetToDefaults, applySettings } =
        useSettingsStore();

    // Local draft state for live preview before saving
    const [draft, setDraft] = useState<SiteSettings>(settings);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState<{
        message: string;
        type: 'success' | 'error';
    } | null>(null);

    // Sync draft when store settings load
    useEffect(() => {
        setDraft(settings);
    }, [settings]);

    // Apply draft changes live for instant preview
    useEffect(() => {
        applySettings(draft);
    }, [draft, applySettings]);

    const showToast = useCallback(
        (message: string, type: 'success' | 'error' = 'success') => {
            setToast({ message, type });
            setTimeout(() => setToast(null), 3000);
        },
        []
    );

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateSettings(draft);
            showToast('Settings saved successfully');
        } catch {
            showToast('Failed to save settings', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = async () => {
        try {
            await resetToDefaults();
            setDraft(DEFAULT_SETTINGS);
            showToast('Settings reset to defaults');
        } catch {
            showToast('Failed to reset settings', 'error');
        }
    };

    const hasChanges =
        draft.fontFamily !== settings.fontFamily ||
        draft.fontSize !== settings.fontSize ||
        draft.fontWeight !== settings.fontWeight ||
        draft.accentColor !== settings.accentColor ||
        draft.projectsLimit !== settings.projectsLimit ||
        draft.enableCache !== settings.enableCache;

    return (
        <div className={styles.settings}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1>Settings</h1>
                    <p>
                        Customize the look and feel of your portfolio. Changes
                        preview live and persist globally.
                    </p>
                </div>
                <div className={styles.headerActions}>
                    <button
                        onClick={handleReset}
                        className={styles.resetBtn}
                        id="settings-reset-btn"
                    >
                        <FiRotateCcw size={14} />
                        Reset Defaults
                    </button>
                    <button
                        onClick={handleSave}
                        className={styles.saveBtn}
                        disabled={isSaving || !hasChanges}
                        id="settings-save-btn"
                    >
                        <FiSave size={14} />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {/* Typography Section */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionIcon}>
                        <FiType size={22} />
                    </div>
                    <div>
                        <div className={styles.sectionTitle}>Typography</div>
                        <div className={styles.sectionSubtitle}>
                            Choose your font family, size, and weight
                        </div>
                    </div>
                </div>

                {/* Font Family Cards */}
                <div className={styles.fontGrid}>
                    {FONT_OPTIONS.map((font) => (
                        <div
                            key={font.family}
                            className={`${styles.fontCard} ${
                                draft.fontFamily === font.family
                                    ? styles.active
                                    : ''
                            }`}
                            onClick={() =>
                                setDraft((d) => ({
                                    ...d,
                                    fontFamily: font.family,
                                }))
                            }
                            id={`font-card-${font.family.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                            <div className={styles.fontCardCheck}>
                                <FiCheck size={14} />
                            </div>
                            <div
                                className={styles.fontPreview}
                                style={font.style}
                            >
                                Aa
                            </div>
                            <div
                                className={styles.fontName}
                                style={font.style}
                            >
                                {font.label}
                            </div>
                            <div className={styles.fontSample}>
                                {font.description}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Size & Weight Controls */}
                <div className={styles.controlsRow}>
                    {/* Font Size */}
                    <div className={styles.controlGroup}>
                        <div className={styles.controlLabel}>
                            Font Size
                            <span className={styles.controlValue}>
                                {draft.fontSize}px
                            </span>
                        </div>
                        <div className={styles.sizeOptions}>
                            {SIZE_OPTIONS.map((size) => (
                                <button
                                    key={size}
                                    className={`${styles.sizeOption} ${
                                        draft.fontSize === size
                                            ? styles.active
                                            : ''
                                    }`}
                                    onClick={() =>
                                        setDraft((d) => ({
                                            ...d,
                                            fontSize: size,
                                        }))
                                    }
                                    id={`size-option-${size}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Font Weight */}
                    <div className={styles.controlGroup}>
                        <div className={styles.controlLabel}>
                            Font Weight
                            <span className={styles.controlValue}>
                                {
                                    WEIGHT_OPTIONS.find(
                                        (w) => w.value === draft.fontWeight
                                    )?.label
                                }
                            </span>
                        </div>
                        <div className={styles.weightOptions}>
                            {WEIGHT_OPTIONS.map((weight) => (
                                <button
                                    key={weight.value}
                                    className={`${styles.weightOption} ${
                                        draft.fontWeight === weight.value
                                            ? styles.active
                                            : ''
                                    }`}
                                    onClick={() =>
                                        setDraft((d) => ({
                                            ...d,
                                            fontWeight: weight.value,
                                        }))
                                    }
                                    id={`weight-option-${weight.value}`}
                                >
                                    <div className={styles.weightName}>
                                        {weight.label}
                                    </div>
                                    <div
                                        className={styles.weightPreview}
                                        style={{
                                            fontWeight: weight.value,
                                        }}
                                    >
                                        Ag
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Accent Color Section */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionIcon}>
                        <FiDroplet size={22} />
                    </div>
                    <div>
                        <div className={styles.sectionTitle}>Accent Color</div>
                        <div className={styles.sectionSubtitle}>
                            Pick a color that defines your brand identity
                        </div>
                    </div>
                </div>

                <div className={styles.colorGrid}>
                    {COLOR_PALETTE.map((color) => (
                        <div
                            key={color.hex}
                            className={`${styles.colorSwatch} ${
                                draft.accentColor === color.hex
                                    ? styles.active
                                    : ''
                            }`}
                            style={{ background: color.hex }}
                            onClick={() =>
                                setDraft((d) => ({
                                    ...d,
                                    accentColor: color.hex,
                                }))
                            }
                            title={color.name}
                            id={`color-swatch-${color.name.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                            <div className={styles.colorSwatchCheck}>
                                <FiCheck size={14} />
                            </div>
                            <span className={styles.colorName}>
                                {color.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination settings Section */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionIcon}>
                        <FiSliders size={22} />
                    </div>
                    <div>
                        <div className={styles.sectionTitle}>Content Pagination</div>
                        <div className={styles.sectionSubtitle}>
                            Configure the number of projects and products displayed per page
                        </div>
                    </div>
                </div>

                <div className={styles.controlsRow}>
                    <div className={styles.controlGroup} style={{ maxWidth: '300px' }}>
                        <div className={styles.controlLabel}>
                            Items Per Page
                            <span className={styles.controlValue}>
                                {draft.projectsLimit || 4} items
                            </span>
                        </div>
                        <input
                            type="range"
                            min="2"
                            max="12"
                            step="1"
                            value={draft.projectsLimit || 4}
                            onChange={(e) =>
                                setDraft((d) => ({
                                    ...d,
                                    projectsLimit: parseInt(e.target.value) || 4,
                                }))
                            }
                            style={{
                                width: '100%',
                                accentColor: draft.accentColor,
                                height: '6px',
                                background: 'var(--color-border)',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginTop: '12px'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Performance & Caching Section */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionIcon}>
                        <FiZap size={22} style={{ color: draft.enableCache ? 'var(--color-accent)' : 'inherit' }} />
                    </div>
                    <div>
                        <div className={styles.sectionTitle}>Performance & Caching</div>
                        <div className={styles.sectionSubtitle}>
                            Enable client-side caching to make the landing page load instantly
                        </div>
                    </div>
                </div>

                <div className={styles.controlsRow}>
                    <div className={styles.controlGroup}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
                            <button
                                onClick={() => setDraft((d) => ({ ...d, enableCache: !d.enableCache }))}
                                style={{
                                    position: 'relative',
                                    width: '56px',
                                    height: '28px',
                                    borderRadius: '14px',
                                    background: draft.enableCache ? 'var(--color-accent)' : 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid var(--color-border)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    padding: '2px',
                                    boxShadow: draft.enableCache ? '0 0 12px rgba(99, 102, 241, 0.4)' : 'none',
                                }}
                                type="button"
                                id="settings-cache-toggle"
                            >
                                <div
                                    style={{
                                        width: '22px',
                                        height: '22px',
                                        borderRadius: '50%',
                                        background: '#ffffff',
                                        transform: draft.enableCache ? 'translateX(26px)' : 'translateX(0)',
                                        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                                    }}
                                />
                            </button>
                            <div>
                                <div style={{ fontWeight: 600, color: '#ffffff' }}>
                                    {draft.enableCache ? 'Cache Enabled' : 'Cache Disabled'}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                                    {draft.enableCache
                                        ? 'Landing page retrieves cached data directly from public/cache.json.'
                                        : 'Landing page queries the backend APIs and database in real-time.'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Live Preview */}
            <div className={styles.previewSection}>
                <div className={styles.previewHeader}>
                    <div className={styles.previewIcon}>
                        <FiEye size={22} />
                    </div>
                    <div className={styles.previewTitle}>Live Preview</div>
                </div>

                <div className={styles.previewCard}>
                    <h2
                        className={styles.previewHeading}
                        style={{
                            fontFamily:
                                FONT_OPTIONS.find(
                                    (f) => f.family === draft.fontFamily
                                )?.style.fontFamily || 'inherit',
                            fontSize: `${draft.fontSize + 8}px`,
                            fontWeight: Math.min(draft.fontWeight + 200, 800),
                        }}
                    >
                        The quick brown fox jumps
                    </h2>
                    <p
                        className={styles.previewText}
                        style={{
                            fontFamily:
                                FONT_OPTIONS.find(
                                    (f) => f.family === draft.fontFamily
                                )?.style.fontFamily || 'inherit',
                            fontSize: `${draft.fontSize}px`,
                            fontWeight: draft.fontWeight,
                        }}
                    >
                        This is how your body text will appear across your
                        portfolio. The selected font, size, and weight are
                        applied to this preview so you can see how content reads
                        before publishing changes.
                    </p>

                    <div className={styles.previewButtons}>
                        <button
                            className={styles.previewBtnPrimary}
                            style={{
                                background: draft.accentColor,
                                fontFamily:
                                    FONT_OPTIONS.find(
                                        (f) => f.family === draft.fontFamily
                                    )?.style.fontFamily || 'inherit',
                                fontWeight: draft.fontWeight,
                            }}
                        >
                            Primary Button
                        </button>
                        <button
                            className={styles.previewBtnOutline}
                            style={{
                                color: draft.accentColor,
                                borderColor: draft.accentColor,
                                fontFamily:
                                    FONT_OPTIONS.find(
                                        (f) => f.family === draft.fontFamily
                                    )?.style.fontFamily || 'inherit',
                                fontWeight: draft.fontWeight,
                            }}
                        >
                            Outline Button
                        </button>
                        <a
                            className={styles.previewLink}
                            style={{
                                color: draft.accentColor,
                                fontFamily:
                                    FONT_OPTIONS.find(
                                        (f) => f.family === draft.fontFamily
                                    )?.style.fontFamily || 'inherit',
                            }}
                        >
                            Sample Link
                        </a>
                    </div>

                    <div className={styles.previewAccentBar}>
                        <div
                            className={styles.previewAccentDot}
                            style={{ background: draft.accentColor }}
                        />
                        <div
                            className={styles.previewAccentDot}
                            style={{
                                background: draft.accentColor,
                                opacity: 0.7,
                            }}
                        />
                        <div
                            className={styles.previewAccentDot}
                            style={{
                                background: draft.accentColor,
                                opacity: 0.4,
                            }}
                        />
                        <div
                            className={styles.previewAccentDot}
                            style={{
                                background: draft.accentColor,
                                opacity: 0.2,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            {toast && (
                <div
                    className={`${styles.toast} ${
                        toast.type === 'error' ? styles.toastError : ''
                    }`}
                >
                    <div className={styles.toastIcon}>
                        {toast.type === 'success' ? (
                            <FiCheck size={16} />
                        ) : (
                            <FiAlertCircle size={16} />
                        )}
                    </div>
                    {toast.message}
                </div>
            )}
        </div>
    );
}
