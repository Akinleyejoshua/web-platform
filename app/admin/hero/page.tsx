'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileUpload } from '../components/file-upload';
import styles from '../components/editor.module.css';

export default function AdminHeroPage() {
    const [formData, setFormData] = useState({
        headline: '',
        subtext: '',
        primaryCtaText: '',
        primaryCtaLink: '',
        secondaryCtaText: '',
        secondaryCtaLink: '',
        heroImage: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/hero');
                setFormData({
                    headline: response.data.headline || '',
                    subtext: response.data.subtext || '',
                    primaryCtaText: response.data.primaryCtaText || '',
                    primaryCtaLink: response.data.primaryCtaLink || '',
                    secondaryCtaText: response.data.secondaryCtaText || '',
                    secondaryCtaLink: response.data.secondaryCtaLink || '',
                    heroImage: response.data.heroImage || '',
                });
            } catch (error) {
                console.error('Failed to fetch hero data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        try {
            await axios.put('/api/hero', formData);
            setMessage({ type: 'success', text: 'Hero section updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update hero section.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
            </div>
        );
    }

    return (
        <div className={styles.editor}>
            <div className={styles.header}>
                <h1 className={styles.title}>Edit Hero Section</h1>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                    <label htmlFor="headline" className={styles.label}>Headline</label>
                    <input
                        id="headline"
                        name="headline"
                        type="text"
                        value={formData.headline}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="subtext" className={styles.label}>Subtext</label>
                    <textarea
                        id="subtext"
                        name="subtext"
                        value={formData.subtext}
                        onChange={handleChange}
                        className={styles.textarea}
                    />
                </div>

                <div className={styles.row}>
                    <div className={styles.field}>
                        <label htmlFor="primaryCtaText" className={styles.label}>Primary CTA Text</label>
                        <input
                            id="primaryCtaText"
                            name="primaryCtaText"
                            type="text"
                            value={formData.primaryCtaText}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="primaryCtaLink" className={styles.label}>Primary CTA Link</label>
                        <input
                            id="primaryCtaLink"
                            name="primaryCtaLink"
                            type="text"
                            value={formData.primaryCtaLink}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.field}>
                        <label htmlFor="secondaryCtaText" className={styles.label}>Secondary CTA Text</label>
                        <input
                            id="secondaryCtaText"
                            name="secondaryCtaText"
                            type="text"
                            value={formData.secondaryCtaText}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="secondaryCtaLink" className={styles.label}>Secondary CTA Link</label>
                        <input
                            id="secondaryCtaLink"
                            name="secondaryCtaLink"
                            type="text"
                            value={formData.secondaryCtaLink}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>
                </div>

                <FileUpload
                    value={formData.heroImage}
                    onChange={(url) => setFormData((prev) => ({ ...prev, heroImage: url }))}
                    label="Hero Image"
                    accept="image/*"
                />

                {message && (
                    <div className={message.type === 'success' ? styles.success : styles.error}>
                        {message.text}
                    </div>
                )}

                <div className={styles.actions}>
                    <button type="submit" disabled={isSaving} className={styles.submitBtn}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
