'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiCheck, FiBriefcase, FiCalendar } from 'react-icons/fi';
import { Loader } from '@/app/components/atoms/loader';
import styles from '../components/editor.module.css';
import cardStyles from './experience.module.css';

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
        const descriptions = value.split('\n');
        setEditingItem({ ...editingItem, description: descriptions });
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    if (isLoading) {
        return <Loader variant="section" />;
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
                <div className={styles.grid}>
                    {experiences.length === 0 ? (
                        <div className={styles.empty}>
                            No experience entries yet. Add your work history!
                        </div>
                    ) : (
                        experiences.map((exp) => (
                            <div key={exp._id} className={cardStyles.card}>
                                <div className={cardStyles.cardHeader}>
                                    <div className={cardStyles.iconWrapper}>
                                        <FiBriefcase size={24} />
                                    </div>
                                    {exp.isCurrent && (
                                        <span className={cardStyles.badge}>Current</span>
                                    )}
                                </div>
                                <div className={cardStyles.cardContent}>
                                    <h3 className={cardStyles.cardTitle}>{exp.role}</h3>
                                    <p className={cardStyles.cardCompany}>{exp.company}</p>
                                    <div className={cardStyles.cardDate}>
                                        <FiCalendar size={14} />
                                        {formatDate(exp.startDate)} - {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                                    </div>
                                    {exp.description.length > 0 && (
                                        <p className={cardStyles.cardDesc}>
                                            {exp.description[0]}
                                            {exp.description.length > 1 && ` (+${exp.description.length - 1} more)`}
                                        </p>
                                    )}
                                </div>
                                <div className={cardStyles.cardActions}>
                                    <button onClick={() => handleEdit(exp)} className={cardStyles.actionBtn}>
                                        <FiEdit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(exp._id!)} className={`${cardStyles.actionBtn} ${cardStyles.delete}`}>
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
