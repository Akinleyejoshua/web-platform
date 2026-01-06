'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiCheck, FiLink, FiUser } from 'react-icons/fi';
import { Loader } from '@/app/components/atoms/loader';
import styles from '../components/editor.module.css';
import cardStyles from './about.module.css';

interface SocialLink {
    _id?: string;
    platform: string;
    url: string;
    icon: string;
}

export default function AdminAboutPage() {
    const [bio, setBio] = useState('');
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
    const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
    const [editingLinkIndex, setEditingLinkIndex] = useState<number | null>(null);
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

    const handleAddLink = () => {
        setEditingLink({ platform: '', url: '', icon: '' });
        setEditingLinkIndex(null);
    };

    const handleEditLink = (link: SocialLink, index: number) => {
        setEditingLink({ ...link });
        setEditingLinkIndex(index);
    };

    const handleCancelLink = () => {
        setEditingLink(null);
        setEditingLinkIndex(null);
    };

    const handleSaveLink = () => {
        if (!editingLink) return;

        const updated = [...socialLinks];
        if (editingLinkIndex !== null) {
            updated[editingLinkIndex] = editingLink;
        } else {
            updated.push(editingLink);
        }
        setSocialLinks(updated);
        setEditingLink(null);
        setEditingLinkIndex(null);
    };

    const handleDeleteLink = (index: number) => {
        if (!confirm('Delete this social link?')) return;
        setSocialLinks(socialLinks.filter((_, i) => i !== index));
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

    const getPlatformColor = (platform: string) => {
        const colors: Record<string, string> = {
            github: '#333',
            twitter: '#1DA1F2',
            linkedin: '#0077B5',
            instagram: '#E4405F',
            youtube: '#FF0000',
            facebook: '#1877F2',
        };
        return colors[platform.toLowerCase()] || 'var(--color-accent)';
    };

    if (isLoading) {
        return <Loader variant="section" />;
    }

    return (
        <div className={styles.editor}>
            <div className={styles.header}>
                <h1 className={styles.title}>Edit About Section</h1>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.sectionTitle}>Personal Bio</div>

                <div className={styles.field}>
                    <label htmlFor="bio" className={styles.label}>Your Summary</label>
                    <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className={styles.textarea}
                        style={{ minHeight: '180px' }}
                        placeholder="Write a brief introduction about yourself, your skills, and what you do..."
                    />
                </div>

                <div className={styles.sectionTitle} style={{ marginTop: 'var(--space-lg)' }}>
                    Social Links
                </div>

                {editingLink ? (
                    <div className={cardStyles.editCard}>
                        <div className={styles.row}>
                            <div className={styles.field}>
                                <label className={styles.label}>Platform</label>
                                <input
                                    type="text"
                                    value={editingLink.platform}
                                    onChange={(e) => setEditingLink({ ...editingLink, platform: e.target.value })}
                                    className={styles.input}
                                    placeholder="e.g. GitHub, LinkedIn, Twitter"
                                />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>URL</label>
                                <input
                                    type="text"
                                    value={editingLink.url}
                                    onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                                    className={styles.input}
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                        <div className={cardStyles.editActions}>
                            <button type="button" onClick={handleSaveLink} className={styles.submitBtn} style={{ padding: '8px 16px' }}>
                                <FiCheck size={16} />
                                {editingLinkIndex !== null ? 'Update' : 'Add'}
                            </button>
                            <button type="button" onClick={handleCancelLink} className={styles.cancelBtn} style={{ padding: '8px 16px' }}>
                                <FiX size={16} />
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className={styles.grid} style={{ padding: 0 }}>
                            {socialLinks.length === 0 ? (
                                <div className={styles.empty}>
                                    No social links added yet.
                                </div>
                            ) : (
                                socialLinks.map((link, index) => (
                                    <div key={index} className={cardStyles.card}>
                                        <div
                                            className={cardStyles.cardHeader}
                                            style={{ background: getPlatformColor(link.platform) }}
                                        >
                                            <div className={cardStyles.iconWrapper}>
                                                <FiLink size={24} />
                                            </div>
                                        </div>
                                        <div className={cardStyles.cardContent}>
                                            <h3 className={cardStyles.cardTitle}>{link.platform || 'Untitled'}</h3>
                                            <p className={cardStyles.cardUrl}>{link.url || 'No URL'}</p>
                                        </div>
                                        <div className={cardStyles.cardActions}>
                                            <button type="button" onClick={() => handleEditLink(link, index)} className={cardStyles.actionBtn}>
                                                <FiEdit2 size={16} />
                                            </button>
                                            <button type="button" onClick={() => handleDeleteLink(index)} className={`${cardStyles.actionBtn} ${cardStyles.delete}`}>
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <button type="button" onClick={handleAddLink} className={styles.addBtn} style={{ alignSelf: 'flex-start' }}>
                            <FiPlus size={18} />
                            Add Social Link
                        </button>
                    </>
                )}

                {message && (
                    <div className={message.type === 'success' ? styles.success : styles.error}>
                        {message.text}
                    </div>
                )}

                <div className={styles.actions}>
                    <button type="submit" disabled={isSaving} className={styles.submitBtn}>
                        <FiCheck size={18} />
                        {isSaving ? 'Saving...' : 'Save All Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
