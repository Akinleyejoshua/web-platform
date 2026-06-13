'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiCheck, FiFileText, FiEye, FiZap } from 'react-icons/fi';
import { Loader } from '@/app/components/atoms/loader';
import styles from '../components/editor.module.css';
import cardStyles from './resume.module.css';

type ResumeDomain = 'web' | 'data-science' | 'ml' | 'web3' | 'others';

interface ResumeItem {
    _id?: string;
    domain: ResumeDomain;
    summary: string;
    skills: string[];
    highlights: string[];
    isActive: boolean;
}

const DOMAIN_LABELS: Record<ResumeDomain, string> = {
    'web': 'Web Development',
    'data-science': 'Data Science / Analytics',
    'ml': 'Machine Learning',
    'web3': 'Web3',
    'others': 'Other Domains',
};

const emptyResume: ResumeItem = {
    domain: 'web',
    summary: '',
    skills: [],
    highlights: [],
    isActive: true,
};

export default function AdminResumePage() {
    const [resumes, setResumes] = useState<ResumeItem[]>([]);
    const [editingItem, setEditingItem] = useState<ResumeItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const fetchResumes = async () => {
        try {
            const response = await axios.get('/api/resume');
            setResumes(response.data || []);
        } catch (error) {
            console.error('Failed to fetch resumes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchResumes();
    }, []);

    const handleAdd = () => {
        // Find first domain that doesn't have a resume yet
        const existingDomains = new Set(resumes.map((r) => r.domain));
        const availableDomain = (['web', 'data-science', 'ml', 'web3', 'others'] as ResumeDomain[])
            .find((d) => !existingDomains.has(d)) || 'web';
        setEditingItem({ ...emptyResume, domain: availableDomain });
    };

    const handleEdit = (item: ResumeItem) => {
        setEditingItem({ ...item });
    };

    const handleCancel = () => {
        setEditingItem(null);
    };

    const handleSave = async () => {
        if (!editingItem) return;

        setIsSaving(true);
        setMessage(null);

        try {
            if (editingItem._id) {
                await axios.put('/api/resume', editingItem);
            } else {
                await axios.post('/api/resume', editingItem);
            }
            await fetchResumes();
            setEditingItem(null);
            setMessage({ type: 'success', text: 'Resume saved successfully!' });
        } catch (error: any) {
            const errorMsg = error?.response?.data?.error || 'Failed to save resume.';
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this resume?')) return;

        try {
            await axios.delete(`/api/resume?id=${id}`);
            await fetchResumes();
            setMessage({ type: 'success', text: 'Resume deleted successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete resume.' });
        }
    };

    const previewUrl = (domain: ResumeDomain) => `/resume?domain=${domain}`;

    if (isLoading) {
        return <Loader variant="section" />;
    }

    return (
        <div className={styles.editor}>
            <div className={styles.header}>
                <h1 className={styles.title}>Manage Resumes</h1>
                {!editingItem && (
                    <button onClick={handleAdd} className={styles.addBtn}>
                        <FiPlus size={18} />
                        New Resume
                    </button>
                )}
            </div>

            {message && (
                <div className={message.type === 'success' ? styles.success : styles.error}>
                    {message.text}
                </div>
            )}

            {editingItem ? (
                <div className={styles.form}>
                    <div className={styles.sectionTitle}>
                        {editingItem._id ? 'Edit Resume' : 'New Resume'}
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>Target Domain</label>
                            <select
                                value={editingItem.domain}
                                onChange={(e) => setEditingItem({ ...editingItem, domain: e.target.value as ResumeDomain })}
                                className={styles.select}
                                disabled={!!editingItem._id}
                            >
                                {(['web', 'data-science', 'ml', 'web3', 'others'] as ResumeDomain[]).map((d) => (
                                    <option key={d} value={d}>
                                        {DOMAIN_LABELS[d]}
                                    </option>
                                ))}
                            </select>
                            {editingItem._id && (
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                                    Domain cannot be changed after creation
                                </span>
                            )}
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={editingItem.isActive}
                                    onChange={(e) => setEditingItem({ ...editingItem, isActive: e.target.checked })}
                                    style={{ width: '18px', height: '18px', accentColor: 'var(--color-accent)' }}
                                />
                                Active (visible on public page)
                            </label>
                        </div>
                    </div>

                    {/* Gemini AI Resume Generator */}
                    <div style={{ background: 'rgba(99, 102, 241, 0.05)', border: '1px dashed rgba(99, 102, 241, 0.3)', padding: '16px', borderRadius: '8px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className={styles.label} style={{ fontWeight: 600, color: 'var(--color-accent)', marginBottom: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <FiZap size={14} />
                            Gemini AI Resume Generator
                        </label>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                            Describe the target role, industry, and key strengths. Gemini will generate a tailored summary, skills list, and highlights for the selected domain.
                        </span>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                            <input
                                type="text"
                                id="gemini-ai-resume-prompt"
                                placeholder={`e.g. Senior ${DOMAIN_LABELS[editingItem.domain]} professional with 5+ years experience, focusing on leadership and innovation`}
                                className={styles.input}
                                style={{ flex: 1 }}
                            />
                            <button
                                type="button"
                                onClick={async () => {
                                    const promptInput = document.getElementById('gemini-ai-resume-prompt') as HTMLInputElement;
                                    if (!promptInput || !promptInput.value.trim()) {
                                        alert('Please describe the target role or context first.');
                                        return;
                                    }
                                    setIsSaving(true);
                                    try {
                                        const res = await axios.post('/api/generate', {
                                            prompt: `${DOMAIN_LABELS[editingItem.domain]} resume. ${promptInput.value}`,
                                            type: 'resume',
                                        });
                                        if (res.data) {
                                            setEditingItem({
                                                ...editingItem,
                                                summary: res.data.summary || editingItem.summary,
                                                skills: res.data.skills || editingItem.skills,
                                                highlights: res.data.highlights || editingItem.highlights,
                                            });
                                            promptInput.value = '';
                                            alert('Resume content generated successfully!');
                                        }
                                    } catch (err: any) {
                                        console.error(err);
                                        alert('Failed to generate resume: ' + (err.response?.data?.error || err.message));
                                    } finally {
                                        setIsSaving(false);
                                    }
                                }}
                                className={styles.submitBtn}
                                style={{ height: '44px', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                disabled={isSaving}
                            >
                                <FiZap size={14} />
                                {isSaving ? 'Generating...' : 'Generate'}
                            </button>
                        </div>
                    </div>

                    <div className={styles.sectionTitle}>Content</div>

                    <div className={styles.field}>
                        <label className={styles.label}>Professional Summary</label>
                        <textarea
                            value={editingItem.summary}
                            onChange={(e) => setEditingItem({ ...editingItem, summary: e.target.value })}
                            className={styles.textarea}
                            placeholder="A concise summary highlighting your qualifications for this domain..."
                            rows={4}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Key Skills (one per line)</label>
                        <textarea
                            value={editingItem.skills.join('\n')}
                            onChange={(e) => setEditingItem({ ...editingItem, skills: e.target.value.split('\n').filter(s => s.trim()) })}
                            className={styles.textarea}
                            placeholder="React&#10;Node.js&#10;TypeScript..."
                            rows={6}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Experience Highlights (one per line)</label>
                        <textarea
                            value={editingItem.highlights.join('\n')}
                            onChange={(e) => setEditingItem({ ...editingItem, highlights: e.target.value.split('\n').filter(h => h.trim()) })}
                            className={styles.textarea}
                            placeholder="Led a team of 5 developers...&#10;Built scalable microservices..."
                            rows={6}
                        />
                    </div>

                    <div className={styles.actions}>
                        <button type="button" onClick={handleSave} className={styles.submitBtn} disabled={isSaving}>
                            <FiCheck size={16} />
                            {isSaving ? 'Saving...' : editingItem._id ? 'Update Resume' : 'Create Resume'}
                        </button>
                        <button type="button" onClick={handleCancel} className={styles.cancelBtn} disabled={isSaving}>
                            <FiX size={16} />
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {resumes.length === 0 ? (
                        <div className={styles.empty}>
                            No resumes yet. Create one to get started.
                        </div>
                    ) : (
                        <div className={styles.grid}>
                            {resumes.map((item) => (
                                <div key={item._id} className={cardStyles.card}>
                                    <div className={cardStyles.cardHeader}>
                                        <div className={cardStyles.iconWrapper}>
                                            <FiFileText size={28} />
                                        </div>
                                        <span className={`${cardStyles.badge} ${item.isActive ? cardStyles.badgeActive : cardStyles.badgeInactive}`}>
                                            {item.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className={cardStyles.cardContent}>
                                        <h3 className={cardStyles.cardTitle}>
                                            {DOMAIN_LABELS[item.domain]}
                                        </h3>
                                        <p className={cardStyles.cardMeta}>
                                            {item.skills.length} skills · {item.highlights.length} highlights
                                        </p>
                                        <p className={cardStyles.cardMeta}>
                                            Summary: {item.summary.substring(0, 60)}...
                                        </p>
                                    </div>
                                    <div className={cardStyles.cardActions}>
                                        <a
                                            href={previewUrl(item.domain)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={cardStyles.previewBtn}
                                            title="Preview public page"
                                        >
                                            <FiEye size={16} />
                                            Preview
                                        </a>
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(item)}
                                            className={cardStyles.actionBtn}
                                            title="Edit"
                                        >
                                            <FiEdit2 size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => item._id && handleDelete(item._id)}
                                            className={`${cardStyles.actionBtn} ${cardStyles.delete}`}
                                            title="Delete"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
