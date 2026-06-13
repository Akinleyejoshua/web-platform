'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiCheck, FiFileText, FiEye, FiZap } from 'react-icons/fi';
import { Loader } from '@/app/components/atoms/loader';
import { RichTextEditor } from '@/app/components/molecules/rich-text-editor';
import styles from '../components/editor.module.css';
import cardStyles from './cover-letter.module.css';

type CoverLetterDomain = 'web' | 'data-science' | 'ml' | 'web3' | 'others';

interface CoverLetterItem {
    _id?: string;
    domain: CoverLetterDomain;
    recipientName: string;
    recipientTitle: string;
    company: string;
    companyAddress: string;
    greeting: string;
    intro: string;
    body: string;
    closing: string;
    signature: string;
    isActive: boolean;
}

const DOMAIN_LABELS: Record<CoverLetterDomain, string> = {
    'web': 'Web Development',
    'data-science': 'Data Science / Analytics',
    'ml': 'Machine Learning',
    'web3': 'Web3',
    'others': 'Other Domains',
};

const emptyCoverLetter: CoverLetterItem = {
    domain: 'web',
    recipientName: 'Hiring Manager',
    recipientTitle: '',
    company: '',
    companyAddress: '',
    greeting: 'Dear Hiring Manager,',
    intro: '',
    body: '',
    closing: 'Sincerely,',
    signature: '',
    isActive: true,
};

export default function AdminCoverLetterPage() {
    const [coverLetters, setCoverLetters] = useState<CoverLetterItem[]>([]);
    const [editingItem, setEditingItem] = useState<CoverLetterItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const fetchCoverLetters = async () => {
        try {
            const response = await axios.get('/api/cover-letter');
            setCoverLetters(response.data || []);
        } catch (error) {
            console.error('Failed to fetch cover letters:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCoverLetters();
    }, []);

    const handleAdd = () => {
        // Find first domain that doesn't have a cover letter yet
        const existingDomains = new Set(coverLetters.map((c) => c.domain));
        const availableDomain = (['web', 'data-science', 'ml', 'web3', 'others'] as CoverLetterDomain[])
            .find((d) => !existingDomains.has(d)) || 'web';
        setEditingItem({ ...emptyCoverLetter, domain: availableDomain });
    };

    const handleEdit = (item: CoverLetterItem) => {
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
                await axios.put('/api/cover-letter', editingItem);
            } else {
                await axios.post('/api/cover-letter', editingItem);
            }
            await fetchCoverLetters();
            setEditingItem(null);
            setMessage({ type: 'success', text: 'Cover letter saved successfully!' });
        } catch (error: any) {
            const errorMsg = error?.response?.data?.error || 'Failed to save cover letter.';
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this cover letter?')) return;

        try {
            await axios.delete(`/api/cover-letter?id=${id}`);
            await fetchCoverLetters();
            setMessage({ type: 'success', text: 'Cover letter deleted successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete cover letter.' });
        }
    };

    const previewUrl = (domain: CoverLetterDomain) => `/cover-letter?domain=${domain}`;

    if (isLoading) {
        return <Loader variant="section" />;
    }

    return (
        <div className={styles.editor}>
            <div className={styles.header}>
                <h1 className={styles.title}>Manage Cover Letters</h1>
                {!editingItem && (
                    <button onClick={handleAdd} className={styles.addBtn}>
                        <FiPlus size={18} />
                        New Cover Letter
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
                        {editingItem._id ? 'Edit Cover Letter' : 'New Cover Letter'}
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>Target Domain</label>
                            <select
                                value={editingItem.domain}
                                onChange={(e) => setEditingItem({ ...editingItem, domain: e.target.value as CoverLetterDomain })}
                                className={styles.select}
                                disabled={!!editingItem._id}
                            >
                                {(['web', 'data-science', 'ml', 'web3', 'others'] as CoverLetterDomain[]).map((d) => (
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

                    <div className={styles.sectionTitle}>Recipient Details</div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>Recipient Name</label>
                            <input
                                type="text"
                                value={editingItem.recipientName}
                                onChange={(e) => setEditingItem({ ...editingItem, recipientName: e.target.value })}
                                className={styles.input}
                                placeholder="e.g. Hiring Manager"
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Recipient Title</label>
                            <input
                                type="text"
                                value={editingItem.recipientTitle}
                                onChange={(e) => setEditingItem({ ...editingItem, recipientTitle: e.target.value })}
                                className={styles.input}
                                placeholder="e.g. Engineering Lead"
                            />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>Company</label>
                            <input
                                type="text"
                                value={editingItem.company}
                                onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                                className={styles.input}
                                placeholder="e.g. Acme Inc."
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Company Address</label>
                            <input
                                type="text"
                                value={editingItem.companyAddress}
                                onChange={(e) => setEditingItem({ ...editingItem, companyAddress: e.target.value })}
                                className={styles.input}
                                placeholder="e.g. 123 Main St, San Francisco, CA"
                            />
                        </div>
                    </div>

                    <div className={styles.sectionTitle}>Letter Content</div>

                    {/* Gemini AI Cover Letter Generator */}
                    <div style={{ background: 'rgba(99, 102, 241, 0.05)', border: '1px dashed rgba(99, 102, 241, 0.3)', padding: '16px', borderRadius: '8px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className={styles.label} style={{ fontWeight: 600, color: 'var(--color-accent)', marginBottom: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <FiZap size={14} />
                            Gemini AI Cover Letter Generator
                        </label>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                            Describe the role, company, and key points you want to highlight. Gemini will generate a tailored greeting, intro, body, and closing for the selected domain.
                        </span>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                            <input
                                type="text"
                                id="gemini-ai-cover-letter-prompt"
                                placeholder={`e.g. Senior ${DOMAIN_LABELS[editingItem.domain]} role at Acme Corp, focusing on React, Node.js, and scalable systems`}
                                className={styles.input}
                                style={{ flex: 1 }}
                            />
                            <button
                                type="button"
                                onClick={async () => {
                                    const promptInput = document.getElementById('gemini-ai-cover-letter-prompt') as HTMLInputElement;
                                    if (!promptInput || !promptInput.value.trim()) {
                                        alert('Please describe the role or context first.');
                                        return;
                                    }
                                    setIsSaving(true);
                                    try {
                                        const res = await axios.post('/api/generate', {
                                            prompt: `${DOMAIN_LABELS[editingItem.domain]} cover letter. ${promptInput.value}`,
                                            type: 'cover-letter',
                                        });
                                        if (res.data) {
                                            setEditingItem({
                                                ...editingItem,
                                                greeting: res.data.greeting || editingItem.greeting,
                                                intro: res.data.intro || editingItem.intro,
                                                body: res.data.body || editingItem.body,
                                                closing: res.data.closing || editingItem.closing,
                                            });
                                            promptInput.value = '';
                                            alert('Cover letter content generated successfully!');
                                        }
                                    } catch (err: any) {
                                        console.error(err);
                                        alert('Failed to generate cover letter: ' + (err.response?.data?.error || err.message));
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

                    <div className={styles.field}>
                        <label className={styles.label}>Greeting</label>
                        <input
                            type="text"
                            value={editingItem.greeting}
                            onChange={(e) => setEditingItem({ ...editingItem, greeting: e.target.value })}
                            className={styles.input}
                            placeholder="e.g. Dear Hiring Manager,"
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Introduction Paragraph</label>
                        <RichTextEditor
                            value={editingItem.intro}
                            onChange={(val) => setEditingItem({ ...editingItem, intro: val })}
                            placeholder="Opening paragraph expressing interest in the role..."
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Body / Experience Paragraphs</label>
                        <RichTextEditor
                            value={editingItem.body}
                            onChange={(val) => setEditingItem({ ...editingItem, body: val })}
                            placeholder="Highlight your relevant experience, skills, and achievements for this domain..."
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>Closing</label>
                            <input
                                type="text"
                                value={editingItem.closing}
                                onChange={(e) => setEditingItem({ ...editingItem, closing: e.target.value })}
                                className={styles.input}
                                placeholder="e.g. Sincerely,"
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Signature Name</label>
                            <input
                                type="text"
                                value={editingItem.signature}
                                onChange={(e) => setEditingItem({ ...editingItem, signature: e.target.value })}
                                className={styles.input}
                                placeholder="Your full name"
                            />
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button type="button" onClick={handleSave} className={styles.submitBtn} disabled={isSaving}>
                            <FiCheck size={16} />
                            {isSaving ? 'Saving...' : editingItem._id ? 'Update Cover Letter' : 'Create Cover Letter'}
                        </button>
                        <button type="button" onClick={handleCancel} className={styles.cancelBtn} disabled={isSaving}>
                            <FiX size={16} />
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {coverLetters.length === 0 ? (
                        <div className={styles.empty}>
                            No cover letters yet. Create one to get started.
                        </div>
                    ) : (
                        <div className={styles.grid}>
                            {coverLetters.map((item) => (
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
                                            {item.company || 'No company set'}
                                        </p>
                                        <p className={cardStyles.cardMeta}>
                                            To: {item.recipientName}{item.recipientTitle ? `, ${item.recipientTitle}` : ''}
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
