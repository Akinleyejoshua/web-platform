'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiCheck, FiGithub, FiExternalLink, FiImage, FiYoutube } from 'react-icons/fi';
import { FileUpload } from '../components/file-upload';
import styles from '../components/editor.module.css';

// Local specific styles for project card grid
import projectStyles from './projects.module.css';

type ProjectCategory = 'web' | 'ml' | 'web3' | 'others';
type MediaType = 'image' | 'video';

interface ProjectItem {
    _id?: string;
    title: string;
    description: string;
    category: ProjectCategory;
    mediaType: MediaType;
    mediaUrl: string;
    technologies: string[];
    githubUrl: string;
    liveUrl: string;
    order: number;
}

const emptyProject: ProjectItem = {
    title: '',
    description: '',
    category: 'web',
    mediaType: 'image',
    mediaUrl: '',
    technologies: [],
    githubUrl: '',
    liveUrl: '',
    order: 0,
};

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<ProjectItem[]>([]);
    const [editingItem, setEditingItem] = useState<ProjectItem | null>(null);
    const [techInput, setTechInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('/api/projects');
            setProjects(response.data);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleAdd = () => {
        setEditingItem({ ...emptyProject, order: projects.length });
        setTechInput('');
    };

    const handleEdit = (project: ProjectItem) => {
        setEditingItem({ ...project });
        setTechInput(project.technologies.join(', '));
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
                await axios.put('/api/projects', editingItem);
            } else {
                await axios.post('/api/projects', editingItem);
            }
            await fetchProjects();
            setEditingItem(null);
            setMessage({ type: 'success', text: 'Project saved successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save project.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            await axios.delete(`/api/projects?id=${id}`);
            await fetchProjects();
            setMessage({ type: 'success', text: 'Project deleted successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete project.' });
        }
    };

    const handleTechBlur = () => {
        if (!editingItem) return;
        const techs = techInput.split(',').map((t) => t.trim()).filter((t) => t);
        setEditingItem({ ...editingItem, technologies: techs });
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
                <h1 className={styles.title}>Manage Projects</h1>
                {!editingItem && (
                    <button onClick={handleAdd} className={styles.addBtn}>
                        <FiPlus size={18} />
                        New Project
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
                        {editingItem._id ? 'Edit Project' : 'Create New Project'}
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Project Title</label>
                        <input
                            type="text"
                            value={editingItem.title}
                            onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                            className={styles.input}
                            placeholder="e.g. E-Commerce Platform"
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Description</label>
                        <textarea
                            value={editingItem.description}
                            onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                            className={styles.textarea}
                            placeholder="Brief description of the project..."
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>Category</label>
                            <select
                                value={editingItem.category}
                                onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as ProjectCategory })}
                                className={styles.input} // Ensure using .input class for select
                                style={{ height: '48px' }} // Fix height match
                            >
                                <option value="web">Web Development</option>
                                <option value="ml">Machine Learning</option>
                                <option value="web3">Web3 / Blockchain</option>
                                <option value="others">Other</option>
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Media Type</label>
                            <select
                                value={editingItem.mediaType}
                                onChange={(e) => setEditingItem({ ...editingItem, mediaType: e.target.value as MediaType })}
                                className={styles.input}
                                style={{ height: '48px' }}
                            >
                                <option value="image">Image</option>
                                <option value="video">YouTube Video</option>
                            </select>
                        </div>
                    </div>

                    {editingItem.mediaType === 'image' ? (
                        <FileUpload
                            value={editingItem.mediaUrl}
                            onChange={(url) => setEditingItem({ ...editingItem, mediaUrl: url })}
                            label="Project Thumbnail"
                            accept="image/*"
                        />
                    ) : (
                        <div className={styles.field}>
                            <label className={styles.label}>YouTube URL</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    value={editingItem.mediaUrl}
                                    onChange={(e) => setEditingItem({ ...editingItem, mediaUrl: e.target.value })}
                                    className={styles.input}
                                    placeholder="https://youtube.com/watch?v=..."
                                    style={{ paddingLeft: '40px' }}
                                />
                                <FiYoutube style={{ position: 'absolute', left: '12px', top: '14px', color: '#ff0000' }} size={18} />
                            </div>
                        </div>
                    )}

                    <div className={styles.field}>
                        <label className={styles.label}>Technologies (comma-separated)</label>
                        <input
                            type="text"
                            value={techInput}
                            onChange={(e) => setTechInput(e.target.value)}
                            onBlur={handleTechBlur}
                            className={styles.input}
                            placeholder="React, Next.js, TensorFlow"
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>GitHub Repo</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    value={editingItem.githubUrl}
                                    onChange={(e) => setEditingItem({ ...editingItem, githubUrl: e.target.value })}
                                    className={styles.input}
                                    style={{ paddingLeft: '40px' }}
                                />
                                <FiGithub style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--color-text-secondary)' }} size={18} />
                            </div>
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Live Link</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    value={editingItem.liveUrl}
                                    onChange={(e) => setEditingItem({ ...editingItem, liveUrl: e.target.value })}
                                    className={styles.input}
                                    style={{ paddingLeft: '40px' }}
                                />
                                <FiExternalLink style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--color-text-secondary)' }} size={18} />
                            </div>
                        </div>
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
                    {projects.length === 0 ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--color-muted)' }}>
                            No projects found. Create your first one!
                        </div>
                    ) : (
                        projects.map((project) => (
                            <div key={project._id} className={projectStyles.card}>
                                <div className={projectStyles.cardMedia}>
                                    {project.mediaType === 'image' && project.mediaUrl ? (
                                        <img src={project.mediaUrl} alt={project.title} />
                                    ) : project.mediaType === 'video' && project.mediaUrl ? (
                                        <div className={projectStyles.videoPlaceholder}>
                                            <FiYoutube size={32} />
                                        </div>
                                    ) : (
                                        <div className={projectStyles.noMedia}>
                                            <FiImage size={24} />
                                        </div>
                                    )}
                                    <div className={projectStyles.cardBadge}>
                                        {project.category}
                                    </div>
                                </div>
                                <div className={projectStyles.cardContent}>
                                    <h3 className={projectStyles.cardTitle}>{project.title}</h3>
                                    <p className={projectStyles.cardDesc}>{project.description}</p>
                                    <div className={projectStyles.cardTechs}>
                                        {project.technologies.slice(0, 3).map(t => (
                                            <span key={t}>{t}</span>
                                        ))}
                                        {project.technologies.length > 3 && (
                                            <span>+{project.technologies.length - 3}</span>
                                        )}
                                    </div>
                                </div>
                                <div className={projectStyles.cardActions}>
                                    <button onClick={() => handleEdit(project)} className={projectStyles.actionBtn}>
                                        <FiEdit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(project._id!)} className={`${projectStyles.actionBtn} ${projectStyles.delete}`}>
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
