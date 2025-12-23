'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiCheck, FiBriefcase, FiCalendar } from 'react-icons/fi';
import styles from '../components/editor.module.css';

// Local styles for experience items (can be inline or reuse shared classes, adding inline for specific tweaks)
const itemStyles = {
    card: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem',
        background: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: '16px',
        marginBottom: '1rem',
        transition: 'all 0.2s'
    },
    info: {
        flex: 1,
    },
    role: {
        fontSize: '1.1rem',
        fontWeight: 700,
        color: 'var(--color-text)',
        marginBottom: '4px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    company: {
        fontSize: '0.95rem',
        color: 'var(--color-accent)',
        fontWeight: 600,
        marginBottom: '4px'
    },
    date: {
        fontSize: '0.825rem',
        color: 'var(--color-muted)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
    },
    actions: {
        display: 'flex',
        gap: '8px'
    },
    actionBtn: {
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid var(--color-border)',
        borderRadius: '8px',
        background: 'var(--color-bg)',
        color: 'var(--color-text-secondary)',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    badge: {
        fontSize: '0.65rem',
        background: 'rgba(16, 185, 129, 0.1)',
        color: '#10b981',
        padding: '2px 8px',
        borderRadius: '12px',
        fontWeight: 600,
        textTransform: 'uppercase' as const,
    }
};

interface ExperienceItem {
    _id?: string;
    role: string;
    company: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    description: string[];
    order: number;
}

const emptyExperience: ExperienceItem = {
    role: '',
    company: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: [],
    order: 0,
};

export default function AdminExperiencePage() {
    const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
    const [editingItem, setEditingItem] = useState<ExperienceItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const fetchExperiences = async () => {
        try {
            const response = await axios.get('/api/experience');
            setExperiences(response.data);
        } catch (error) {
            console.error('Failed to fetch experiences:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchExperiences();
    }, []);

    const handleAdd = () => {
        setEditingItem({ ...emptyExperience, order: experiences.length });
    };

    const handleEdit = (exp: ExperienceItem) => {
        setEditingItem({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
            endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '',
        });
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
                await axios.put('/api/experience', editingItem);
            } else {
                await axios.post('/api/experience', editingItem);
            }
            await fetchExperiences();
            setEditingItem(null);
            setMessage({ type: 'success', text: 'Experience saved successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save experience.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this experience?')) return;

        try {
            await axios.delete(`/api/experience?id=${id}`);
            await fetchExperiences();
            setMessage({ type: 'success', text: 'Experience deleted successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete experience.' });
        }
    };

    const handleDescriptionChange = (value: string) => {
        if (!editingItem) return;
        const descriptions = value.split('\n'); // Allow empty lines during editing
        setEditingItem({ ...editingItem, description: descriptions });
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
                <h1 className={styles.title}>Manage Experience</h1>
                {!editingItem && (
                    <button onClick={handleAdd} className={styles.addBtn}>
                        <FiPlus size={18} />
                        New Experience
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
                        {editingItem._id ? 'Edit Experience' : 'New Experience'}
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>Role / Title</label>
                            <input
                                type="text"
                                value={editingItem.role}
                                onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                                className={styles.input}
                                placeholder="e.g. Senior Frontend Engineer"
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Company</label>
                            <input
                                type="text"
                                value={editingItem.company}
                                onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                                className={styles.input}
                                placeholder="e.g. Google"
                            />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>Start Date</label>
                            <input
                                type="date"
                                value={editingItem.startDate}
                                onChange={(e) => setEditingItem({ ...editingItem, startDate: e.target.value })}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>End Date</label>
                            <input
                                type="date"
                                value={editingItem.endDate}
                                onChange={(e) => setEditingItem({ ...editingItem, endDate: e.target.value })}
                                className={styles.input}
                                disabled={editingItem.isCurrent}
                            />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={editingItem.isCurrent}
                                onChange={(e) => setEditingItem({ ...editingItem, isCurrent: e.target.checked, endDate: '' })}
                                style={{ width: '18px', height: '18px', accentColor: 'var(--color-accent)' }}
                            />
                            Currently working here
                        </label>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Description (one point per line)</label>
                        <textarea
                            value={editingItem.description.join('\n')}
                            onChange={(e) => handleDescriptionChange(e.target.value)}
                            className={styles.textarea}
                            placeholder="• Led a team of 5 developers...&#10;• Improved site performance by 20%..."
                        />
                    </div>

                    <div className={styles.actions}>
                        <button onClick={handleSave} disabled={isSaving} className={styles.submitBtn}>
                            <FiCheck size={18} />
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button onClick={handleCancel} className={styles.cancelBtn}>
                            <FiX size={18} />
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {experiences.length === 0 ? (
                        <div className={styles.form} style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-muted)' }}>
                            No experience entries found. Add your work history!
                        </div>
                    ) : (
                        experiences.map((exp) => (
                            <div key={exp._id} style={itemStyles.card}>
                                <div style={itemStyles.info}>
                                    <div style={itemStyles.role}>
                                        <FiBriefcase size={16} color="var(--color-accent)" />
                                        {exp.role}
                                        {exp.isCurrent && <span style={itemStyles.badge}>Current</span>}
                                    </div>
                                    <div style={itemStyles.company}>{exp.company}</div>
                                    <div style={itemStyles.date}>
                                        <FiCalendar size={14} />
                                        {new Date(exp.startDate).getFullYear()} -
                                        {exp.isCurrent ? 'Present' : new Date(exp.endDate).getFullYear()}
                                    </div>
                                </div>
                                <div style={itemStyles.actions}>
                                    <button
                                        onClick={() => handleEdit(exp)}
                                        style={itemStyles.actionBtn}
                                        onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--color-accent)'}
                                        onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                                    >
                                        <FiEdit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(exp._id!)}
                                        style={{ ...itemStyles.actionBtn, color: '#ef4444' }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.background = '#ef4444';
                                            e.currentTarget.style.borderColor = '#ef4444';
                                            e.currentTarget.style.color = 'white';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.background = 'var(--color-bg)';
                                            e.currentTarget.style.borderColor = 'var(--color-border)';
                                            e.currentTarget.style.color = '#ef4444';
                                        }}
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
