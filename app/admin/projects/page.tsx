'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiCheck } from 'react-icons/fi';
import { FileUpload } from '../components/file-upload';
import styles from '../components/editor.module.css';
import managerStyles from '../about/page.module.css';

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
    };

    const handleEdit = (project: ProjectItem) => {
        setEditingItem({ ...project });
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

    const handleTechChange = (value: string) => {
        if (!editingItem) return;
        const techs = value.split(',').map((t) => t.trim()).filter((t) => t);
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
            </div>

            {message && (
                <div className={message.type === 'success' ? styles.success : styles.error}>
                    {message.text}
                </div>
            )}

            {editingItem ? (
                <div className={styles.form}>
                    <div className={styles.field}>
                        <label className={styles.label}>Project Title</label>
                        <input
                            type="text"
                            value={editingItem.title}
                            onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Description</label>
                        <textarea
                            value={editingItem.description}
                            onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                            className={styles.textarea}
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>Category</label>
                            <select
                                value={editingItem.category}
                                onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as ProjectCategory })}
                                className={styles.input}
                            >
                                <option value="web">Web</option>
                                <option value="ml">Machine Learning</option>
                                <option value="web3">Web3</option>
                                <option value="others">Others</option>
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Media Type</label>
                            <select
                                value={editingItem.mediaType}
                                onChange={(e) => setEditingItem({ ...editingItem, mediaType: e.target.value as MediaType })}
                                className={styles.input}
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
                            label="Project Image"
                            accept="image/*"
                        />
                    ) : (
                        <div className={styles.field}>
                            <label className={styles.label}>YouTube URL</label>
                            <input
                                type="text"
                                value={editingItem.mediaUrl}
                                onChange={(e) => setEditingItem({ ...editingItem, mediaUrl: e.target.value })}
                                className={styles.input}
                                placeholder="https://youtube.com/watch?v=..."
                            />
                        </div>
                    )}

                    <div className={styles.field}>
                        <label className={styles.label}>Technologies (comma separated)</label>
                        <input
                            type="text"
                            value={editingItem.technologies.join(', ')}
                            onChange={(e) => handleTechChange(e.target.value)}
                            className={styles.input}
                            placeholder="React, Node.js, MongoDB"
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>GitHub URL</label>
                            <input
                                type="text"
                                value={editingItem.githubUrl}
                                onChange={(e) => setEditingItem({ ...editingItem, githubUrl: e.target.value })}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Live Demo URL</label>
                            <input
                                type="text"
                                value={editingItem.liveUrl}
                                onChange={(e) => setEditingItem({ ...editingItem, liveUrl: e.target.value })}
                                className={styles.input}
                            />
                        </div>
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
                        <h2 className={managerStyles.sectionTitle}>Project Entries</h2>
                        <button onClick={handleAdd} className={managerStyles.addBtn}>
                            <FiPlus size={18} />
                            Add Project
                        </button>
                    </div>

                    {projects.length === 0 ? (
                        <p className={managerStyles.empty}>No projects yet.</p>
                    ) : (
                        projects.map((project) => (
                            <div key={project._id} className={managerStyles.item}>
                                <div className={managerStyles.itemFields}>
                                    <strong>{project.title}</strong>
                                    <span style={{ textTransform: 'capitalize' }}>{project.category}</span>
                                </div>
                                <button onClick={() => handleEdit(project)} className={managerStyles.addBtn}>
                                    <FiEdit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete(project._id!)} className={managerStyles.deleteBtn}>
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
