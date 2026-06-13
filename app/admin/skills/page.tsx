'use client';

import styles from './skills.module.css';
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiCheck, FiAward, FiStar, FiZap, FiCode, FiHelpCircle } from 'react-icons/fi';
import { Loader } from '@/app/components/atoms/loader';
import { ISkill, SkillCategory } from '@/app/lib/models/skill';

interface SkillItem {
    _id?: string;
    name: string;
    category: SkillCategory;
    iconName: string;
    proficiency: number;
    order: number;
    isVisible: boolean;
}

const emptySkill: SkillItem = {
    name: '',
    category: 'other',
    iconName: 'code',
    proficiency: 80,
    order: 0,
    isVisible: true,
};

const COMMON_ICONS = [
    'react', 'typescript', 'javascript', 'python', 'java', 'go', 'rust', 'php', 'ruby', 'kotlin', 'swift', 'dart',
    'nodejs', 'express', 'flask', 'django', 'spring', 'laravel', 'rails', 'dotnet', 'nextjs',
    'mongodb', 'postgresql', 'mysql', 'sqlite', 'redis', 'firebase', 'elasticsearch',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'git', 'github', 'gitlab',
    'html5', 'css3', 'scss', 'tailwind', 'bootstrap', 'materialui', 'vue', 'angular', 'svelte',
    'figma', 'sketch', 'adobe', 'photoshop', 'illustrator', 'xd', 'blender',
    'tensorflow', 'pytorch', 'openai',
    'linux', 'ubuntu', 'serverless', 'graphql', 'rest', 'api',
];

const CATEGORIES: { value: SkillCategory; label: string }[] = [
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'database', label: 'Database' },
    { value: 'devops', label: 'DevOps' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'design', label: 'Design' },
    { value: 'tools', label: 'Tools' },
    { value: 'ai-ml', label: 'AI / ML' },
    { value: 'other', label: 'Other' },
];

export default function AdminSkillsPage() {
    const [skills, setSkills] = useState<SkillItem[]>([]);
    const [editingItem, setEditingItem] = useState<SkillItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [iconSearch, setIconSearch] = useState('');

    const fetchSkills = async () => {
        try {
            const response = await axios.get('/api/skills');
            setSkills(response.data);
        } catch (error) {
            console.error('Failed to fetch skills:', error);
            setMessage({ type: 'error', text: 'Failed to load skills.' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    const handleAdd = () => {
        setEditingItem({ ...emptySkill, order: skills.length });
    };

    const handleEdit = (skill: SkillItem) => {
        setEditingItem({
            ...skill,
        });
    };

    const handleCancel = () => {
        setEditingItem(null);
        setIconSearch('');
    };

    const handleSave = async () => {
        if (!editingItem) return;

        // Validation
        if (!editingItem.name.trim()) {
            setMessage({ type: 'error', text: 'Skill name is required.' });
            return;
        }
        if (!editingItem.iconName.trim()) {
            setMessage({ type: 'error', text: 'Icon name is required.' });
            return;
        }

        setIsSaving(true);
        setMessage(null);

        try {
            if (editingItem._id) {
                await axios.put('/api/skills', editingItem);
            } else {
                await axios.post('/api/skills', editingItem);
            }
            await fetchSkills();
            setEditingItem(null);
            setIconSearch('');
            setMessage({ type: 'success', text: 'Skill saved successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save skill.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this skill?')) return;

        try {
            await axios.delete(`/api/skills?id=${id}`);
            await fetchSkills();
            setMessage({ type: 'success', text: 'Skill deleted successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete skill.' });
        }
    };

    const filteredIcons = useMemo(() => {
        if (!iconSearch) return COMMON_ICONS.slice(0, 50);
        return COMMON_ICONS.filter((icon) =>
            icon.toLowerCase().includes(iconSearch.toLowerCase())
        );
    }, [iconSearch]);

    if (isLoading) {
        return <Loader variant="section" />;
    }

    return (
        <div className={styles.editor}>
            <div className={styles.header}>
                <h1 className={styles.title}>Manage Skills</h1>
                {!editingItem && (
                    <button onClick={handleAdd} className={styles.addBtn}>
                        <FiPlus size={18} />
                        New Skill
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
                        {editingItem._id ? 'Edit Skill' : 'New Skill'}
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>Skill Name</label>
                            <input
                                type="text"
                                value={editingItem.name}
                                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                className={styles.input}
                                placeholder="e.g. React, TypeScript, Docker"
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Category</label>
                            <select
                                value={editingItem.category}
                                onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as SkillCategory })}
                                className={styles.select}
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>Icon Name</label>
                            <input
                                type="text"
                                value={editingItem.iconName}
                                onChange={(e) => setEditingItem({ ...editingItem, iconName: e.target.value.toLowerCase() })}
                                className={styles.input}
                                placeholder="e.g. react, typescript, mongodb"
                            />
                            <div className={styles.iconPicker}>
                                <div className={styles.iconSearch}>
                                    <FiCode size={14} />
                                    <input
                                        type="text"
                                        value={iconSearch}
                                        onChange={(e) => setIconSearch(e.target.value)}
                                        className={styles.iconSearchInput}
                                        placeholder="Search icons..."
                                    />
                                </div>
                                <div className={styles.iconList}>
                                    {filteredIcons.slice(0, 20).map((icon) => (
                                        <div
                                            key={icon}
                                            className={`${styles.iconOption} ${editingItem.iconName === icon ? styles.selected : ''}`}
                                            onClick={() => {
                                                setEditingItem({ ...editingItem, iconName: icon });
                                                setIconSearch('');
                                            }}
                                        >
                                            {icon}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <small className={styles.helperText}>
                                Use Simple Icons names (lowercase, no spaces). See react-icons/fa for all options.
                            </small>
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Proficiency (0-100)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={editingItem.proficiency}
                                onChange={(e) => setEditingItem({ ...editingItem, proficiency: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                                className={styles.input}
                            />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>Display Order</label>
                            <input
                                type="number"
                                min="0"
                                value={editingItem.order}
                                onChange={(e) => setEditingItem({ ...editingItem, order: parseInt(e.target.value) || 0 })}
                                className={styles.input}
                                placeholder="Lower numbers appear first"
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginTop: '24px' }}>
                                <input
                                    type="checkbox"
                                    checked={editingItem.isVisible}
                                    onChange={(e) => setEditingItem({ ...editingItem, isVisible: e.target.checked })}
                                    style={{ width: '18px', height: '18px', accentColor: 'var(--color-accent)' }}
                                />
                                Show on site
                            </label>
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={styles.saveBtn}
                        >
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                        <button onClick={handleCancel} className={styles.cancelBtn}>
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className={styles.list}>
                    {skills.length === 0 ? (
                        <p className={styles.empty}>No skills added yet.</p>
                    ) : (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Proficiency</th>
                                    <th>Order</th>
                                    <th>Visible</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...skills].sort((a, b) => a.order - b.order).map((skill) => (
                                    <tr key={skill._id || skill.name}>
                                        <td>
                                            <div className={styles.skillRow}>
                                                <FiCode size={16} />
                                                {skill.name}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={styles.categoryBadge}>
                                                {skill.category}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={styles.progressMini}>
                                                <div
                                                    className={styles.progressMiniFill}
                                                    style={{ width: `${skill.proficiency}%` }}
                                                />
                                                <span>{skill.proficiency}%</span>
                                            </div>
                                        </td>
                                        <td>{skill.order}</td>
                                        <td>
                                            <span className={skill.isVisible ? styles.visibleYes : styles.visibleNo}>
                                                {skill.isVisible ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={styles.actionBtns}>
                                                <button
                                                    onClick={() => handleEdit(skill)}
                                                    className={styles.editBtn}
                                                >
                                                    <FiEdit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => skill._id && handleDelete(skill._id)}
                                                    className={styles.deleteBtn}
                                                >
                                                    <FiTrash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}
