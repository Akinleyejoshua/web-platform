'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import styles from '../components/editor.module.css';
import managerStyles from './page.module.css';

interface SocialLink {
    platform: string;
    url: string;
    icon: string;
}

export default function AdminAboutPage() {
    const [bio, setBio] = useState('');
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/about');
                setBio(response.data.bio || '');
                setSocialLinks(response.data.socialLinks || []);
            } catch (error) {
                console.error('Failed to fetch about data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAddSocialLink = () => {
        setSocialLinks([...socialLinks, { platform: '', url: '', icon: '' }]);
    };

    const handleRemoveSocialLink = (index: number) => {
        setSocialLinks(socialLinks.filter((_, i) => i !== index));
    };

    const handleSocialLinkChange = (index: number, field: keyof SocialLink, value: string) => {
        const updated = [...socialLinks];
        updated[index][field] = value;
        setSocialLinks(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        try {
            await axios.put('/api/about', { bio, socialLinks });
            setMessage({ type: 'success', text: 'About section updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update about section.' });
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
                <h1 className={styles.title}>Edit About Section</h1>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                    <label htmlFor="bio" className={styles.label}>Bio / Personal Summary</label>
                    <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className={styles.textarea}
                        style={{ minHeight: '200px' }}
                    />
                </div>

                <div className={managerStyles.section}>
                    <div className={managerStyles.sectionHeader}>
                        <h2 className={managerStyles.sectionTitle}>Social Links</h2>
                        <button
                            type="button"
                            onClick={handleAddSocialLink}
                            className={managerStyles.addBtn}
                        >
                            <FiPlus size={18} />
                            Add Link
                        </button>
                    </div>

                    {socialLinks.map((link, index) => (
                        <div key={index} className={managerStyles.item}>
                            <div className={managerStyles.itemFields}>
                                <input
                                    type="text"
                                    placeholder="Platform (e.g., github, twitter)"
                                    value={link.platform}
                                    onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                                    className={styles.input}
                                />
                                <input
                                    type="text"
                                    placeholder="URL"
                                    value={link.url}
                                    onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                                    className={styles.input}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveSocialLink(index)}
                                className={managerStyles.deleteBtn}
                            >
                                <FiTrash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>

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
