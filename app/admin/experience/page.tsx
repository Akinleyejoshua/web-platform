'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiCheck } from 'react-icons/fi';
import styles from '../components/editor.module.css';
import managerStyles from '../about/page.module.css';

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
        const descriptions = value.split('\n').filter((d) => d.trim());
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
            </div>

            {message && (
                <div className={message.type === 'success' ? styles.success : styles.error}>
                    {message.text}
                </div>
            )}

            {editingItem ? (
                <div className={styles.form}>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>Role / Title</label>
                            <input
                                type="text"
                                value={editingItem.role}
                                onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Company</label>
                            <input
                                type="text"
                                value={editingItem.company}
                                onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                                className={styles.input}
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
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={editingItem.isCurrent}
                                onChange={(e) => setEditingItem({ ...editingItem, isCurrent: e.target.checked, endDate: '' })}
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
                            style={{ minHeight: '150px' }}
                        />
                    </div>

                    <div className={styles.actions}>
                        <button onClick={handleSave} disabled={isSaving} className={styles.submitBtn}>
                            <FiCheck size={18} />
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                        <button onClick={handleCancel} className={managerStyles.deleteBtn} style={{ width: 'auto', padding: '0.5rem 1rem' }}>
                            <FiX size={18} />
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className={styles.form}>
                    <div className={managerStyles.sectionHeader}>
                        <h2 className={managerStyles.sectionTitle}>Experience Entries</h2>
                        <button onClick={handleAdd} className={managerStyles.addBtn}>
                            <FiPlus size={18} />
                            Add Experience
                        </button>
                    </div>

                    {experiences.length === 0 ? (
                        <p className={managerStyles.empty}>No experience entries yet.</p>
                    ) : (
                        experiences.map((exp) => (
                            <div key={exp._id} className={managerStyles.item}>
                                <div className={managerStyles.itemFields}>
                                    <strong>{exp.role}</strong>
                                    <span>{exp.company}</span>
                                </div>
                                <button onClick={() => handleEdit(exp)} className={managerStyles.addBtn}>
                                    <FiEdit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete(exp._id!)} className={managerStyles.deleteBtn}>
                                    <FiTrash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
