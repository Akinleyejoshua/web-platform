'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiCheck, FiGithub, FiExternalLink, FiImage, FiYoutube, FiArrowUp, FiArrowDown, FiCopy } from 'react-icons/fi';
import { FileUpload } from '../components/file-upload';
import { Loader } from '@/app/components/atoms/loader';
import styles from '../components/editor.module.css';

// Local specific styles for project card grid
import projectStyles from './projects.module.css';

type ProjectCategory = 'web' | 'ml' | 'web3' | 'data-science' | 'others';
type MediaType = 'image' | 'video';

interface ProjectItem {
    _id?: string;
    title: string;
    description: string;
    category: ProjectCategory;
    mediaType: MediaType;
    mediaUrl: string;
    assets?: { type: 'image' | 'video' | 'youtube' | 'loom' | 'external'; url: string }[];
    technologies: string[];
    githubUrl: string;
    liveUrl: string;
    order: number;
    isVisible: boolean;
}

const emptyProject: ProjectItem = {
    title: '',
    description: '',
    category: 'web',
    mediaType: 'image',
    mediaUrl: '',
    assets: [],
    technologies: [],
    githubUrl: '',
    liveUrl: '',
    order: 0,
    isVisible: true,
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
            const response = await axios.get('/api/projects?admin=true');
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

    const handleMove = async (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === projects.length - 1) return;

        const newProjects = [...projects];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        
        [newProjects[index], newProjects[swapIndex]] = [newProjects[swapIndex], newProjects[index]];
        
        const updates = newProjects.map((p, i) => ({ ...p, order: i }));
        setProjects(updates);

        try {
            await Promise.all([
                axios.put('/api/projects', updates[index]),
                axios.put('/api/projects', updates[swapIndex])
            ]);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to reorder.' });
            fetchProjects();
        }
    };

    const copyLink = (category: string) => {
        const url = `${window.location.origin}/?domain=${category}#projects`;
        navigator.clipboard.writeText(url);
        setMessage({ type: 'success', text: `Share link for ${category} copied to clipboard!` });
    };

    if (isLoading) {
        return <Loader variant="section" />;
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

            {!editingItem && (
                <div className={styles.shareContainer}>
                    <h3 className={styles.shareTitle}>Share Portfolio by Domain</h3>
                    <div className={styles.shareButtons}>
                        {['web', 'ml', 'data-science', 'web3', 'others'].map(cat => (
                            <button 
                                key={cat} 
                                onClick={() => copyLink(cat)}
                                className={styles.shareButton}
                                title={`Copy link for ${cat}`}
                            >
                                <FiCopy size={14} />
                                {cat.toUpperCase()}
                            </button>
                        ))}
                    </div>
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
                                className={styles.select}
                            >
                                <option value="web">Web Development</option>
                                <option value="ml">Machine Learning</option>
                                <option value="data-science">Data Science/Analysis</option>
                                <option value="web3">Web3 / Blockchain</option>
                                <option value="others">Other</option>
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Media Type</label>
                            <select
                                value={editingItem.mediaType}
                                onChange={(e) => setEditingItem({ ...editingItem, mediaType: e.target.value as MediaType })}
                                className={styles.select}
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
                            <div className={styles.iconInputWrapper}>
                                <input
                                    type="text"
                                    value={editingItem.mediaUrl}
                                    onChange={(e) => setEditingItem({ ...editingItem, mediaUrl: e.target.value })}
                                    className={styles.input}
                                    placeholder="https://youtube.com/watch?v=..."
                                />
                                <span className={styles.inputIcon}>
                                    <FiYoutube style={{ color: '#ff0000' }} size={18} />
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Project Assets List Section */}
                    <div className={styles.assetsSection}>
                        <div className={styles.assetsHeader}>
                            <label className={styles.label} style={{ marginBottom: 0, fontWeight: 600 }}>Project Gallery / Slide Assets ({editingItem.assets?.length || 0})</label>
                            <button
                                type="button"
                                onClick={() => {
                                    const currentAssets = editingItem.assets || [];
                                    setEditingItem({
                                        ...editingItem,
                                        assets: [...currentAssets, { type: 'image', url: '' }]
                                    });
                                }}
                                className={styles.addAssetBtn}
                            >
                                <FiPlus size={14} /> Add Slide Asset
                            </button>
                        </div>

                        {(!editingItem.assets || editingItem.assets.length === 0) ? (
                            <p className={styles.noAssetsText}>
                                No assets added yet. Slideshow will fallback to default thumbnail/video.
                            </p>
                        ) : (
                            <div className={styles.assetsList}>
                                {editingItem.assets.map((asset, index) => (
                                    <div key={index} className={styles.assetCard}>
                                        {/* Remove Asset Button */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const currentAssets = [...(editingItem.assets || [])];
                                                currentAssets.splice(index, 1);
                                                setEditingItem({ ...editingItem, assets: currentAssets });
                                            }}
                                            className={styles.deleteAssetBtn}
                                            title="Delete Asset"
                                        >
                                            <FiTrash2 size={14} />
                                        </button>

                                        <div className={styles.assetRow}>
                                            <div className={styles.assetTypeCol}>
                                                <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px', color: 'var(--color-text-secondary)' }}>Asset Type</label>
                                                <select
                                                    value={asset.type}
                                                    onChange={(e) => {
                                                        const currentAssets = [...(editingItem.assets || [])];
                                                        currentAssets[index].type = e.target.value as any;
                                                        setEditingItem({ ...editingItem, assets: currentAssets });
                                                    }}
                                                    className={styles.select}
                                                    style={{ height: '40px', padding: '4px 8px', fontSize: '0.85rem' }}
                                                >
                                                    <option value="image">Image</option>
                                                    <option value="video">Direct Video (.mp4)</option>
                                                    <option value="youtube">YouTube URL</option>
                                                    <option value="loom">Loom Video</option>
                                                    <option value="external">External Frame</option>
                                                </select>
                                            </div>

                                            <div className={styles.assetUrlCol}>
                                                <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px', color: 'var(--color-text-secondary)' }}>Asset URL / Upload</label>
                                                {asset.type === 'image' ? (
                                                    <FileUpload
                                                        value={asset.url}
                                                        onChange={(url) => {
                                                            const currentAssets = [...(editingItem.assets || [])];
                                                            currentAssets[index].url = url;
                                                            setEditingItem({ ...editingItem, assets: currentAssets });
                                                        }}
                                                        accept="image/*"
                                                    />
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={asset.url}
                                                        onChange={(e) => {
                                                            const currentAssets = [...(editingItem.assets || [])];
                                                            currentAssets[index].url = e.target.value;
                                                            setEditingItem({ ...editingItem, assets: currentAssets });
                                                        }}
                                                        className={styles.input}
                                                        placeholder={
                                                            asset.type === 'youtube' ? 'https://youtube.com/watch?v=...' :
                                                            asset.type === 'loom' ? 'https://loom.com/share/...' :
                                                            'https://...'
                                                        }
                                                        style={{ height: '40px', padding: '4px 12px', fontSize: '0.85rem' }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

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
                            <div className={styles.iconInputWrapper}>
                                <input
                                    type="text"
                                    value={editingItem.githubUrl}
                                    onChange={(e) => setEditingItem({ ...editingItem, githubUrl: e.target.value })}
                                    className={styles.input}
                                />
                                <span className={styles.inputIcon}>
                                    <FiGithub size={18} />
                                </span>
                            </div>
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Live Link</label>
                            <div className={styles.iconInputWrapper}>
                                <input
                                    type="text"
                                    value={editingItem.liveUrl}
                                    onChange={(e) => setEditingItem({ ...editingItem, liveUrl: e.target.value })}
                                    className={styles.input}
                                />
                                <span className={styles.inputIcon}>
                                    <FiExternalLink size={18} />
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>Order (Sort Hierarchy)</label>
                            <input
                                type="number"
                                value={editingItem.order}
                                onChange={(e) => setEditingItem({ ...editingItem, order: parseInt(e.target.value) || 0 })}
                                className={styles.input}
                                placeholder="Lower numbers appear first"
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={editingItem.isVisible !== false}
                                    onChange={(e) => setEditingItem({ ...editingItem, isVisible: e.target.checked })}
                                    className={styles.checkboxInput}
                                />
                                Publicly Visible
                            </label>
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
                        projects.map((project, index) => (
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
                                    <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className={projectStyles.actionBtn}>
                                        <FiArrowUp size={16} />
                                    </button>
                                    <button onClick={() => handleMove(index, 'down')} disabled={index === projects.length - 1} className={projectStyles.actionBtn}>
                                        <FiArrowDown size={16} />
                                    </button>
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
