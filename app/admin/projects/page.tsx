'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiCheck, FiGithub, FiExternalLink, FiImage, FiYoutube, FiArrowUp, FiArrowDown, FiCopy, FiBookOpen, FiDownload, FiFilm, FiPlay, FiSearch } from 'react-icons/fi';
import { FileUpload } from '../components/file-upload';
import { Loader } from '@/app/components/atoms/loader';
import { getTechIcon, getTechBrandColor } from '@/app/lib/tech-icons';
import styles from '../components/editor.module.css';
import { ISkill } from '@/app/lib/models/skill';

// Local specific styles for project card grid
import projectStyles from './projects.module.css';

type ProjectCategory = 'web' | 'mobile' | 'ml' | 'web3' | 'data-science' | 'others';
type MediaType = 'image' | 'video' | 'video-url';
type CheckType = 'feature' | 'goal' | 'archive';

interface CheckItem {
    type: CheckType;
    label: string;
    description?: string;
}

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
    blogUrl?: string;
    order: number;
    isVisible: boolean;
    checks: CheckItem[];
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
    blogUrl: '',
    order: 0,
    isVisible: true,
    checks: [],
};

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<ProjectItem[]>([]);
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [editingItem, setEditingItem] = useState<ProjectItem | null>(null);
    const [techInput, setTechInput] = useState('');
    const [selectedSkills, setSelectedSkills] = useState<ISkill[]>([]);
    const [availableSkills, setAvailableSkills] = useState<ISkill[]>([]);
    const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
    const [skillSearchQuery, setSkillSearchQuery] = useState('');
    const [checks, setChecks] = useState<CheckItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const skillsLoadingRef = useRef(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [formUploadMode, setFormUploadMode] = useState<'storage' | 'base64'>('storage');
    const [importSourceType, setImportSourceType] = useState<'product' | 'project'>('product');
    const [selectedImportId, setSelectedImportId] = useState('');

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

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/product-projects?admin=true');
            setAllProducts(response.data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    useEffect(() => {
        fetchProjects();
        fetchProducts();
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        if (skillsLoadingRef.current) return;
        skillsLoadingRef.current = true;
        try {
            const response = await axios.get('/api/skills?isVisible=true');
            setAvailableSkills(response.data || []);
        } catch (error) {
            console.error('Failed to fetch skills:', error);
        } finally {
            skillsLoadingRef.current = false;
        }
    };

    const handleAdd = () => {
        setEditingItem({ ...emptyProject, order: projects.length });
        setTechInput('');
        setFormUploadMode('storage');
        setSelectedImportId('');
    };

    const handleEdit = (project: ProjectItem) => {
        setEditingItem({ ...project });
        setTechInput(project.technologies.join(', '));
        setChecks(project.checks || []);
        
        // Find matching skills for existing technologies
        if (project.technologies && availableSkills.length > 0) {
            const matchedSkills = availableSkills.filter(skill => 
                project.technologies!.some(t => t.toLowerCase() === skill.name.toLowerCase())
            );
            setSelectedSkills(matchedSkills);
        } else {
            setSelectedSkills([]);
        }
        
        // Detect if any existing image uses base64
        const usesBase64 = project.mediaUrl?.startsWith('data:') || 
                           project.assets?.some(a => a.url?.startsWith('data:'));
        setFormUploadMode(usesBase64 ? 'base64' : 'storage');
    };

    const handleCancel = () => {
        setEditingItem(null);
    };

    const handleImportData = () => {
        if (!selectedImportId) {
            alert('Please select an item to import.');
            return;
        }

        let sourceItem: any = null;
        if (importSourceType === 'product') {
            sourceItem = allProducts.find(p => p._id === selectedImportId);
        } else {
            sourceItem = projects.find(p => p._id === selectedImportId);
        }

        if (!sourceItem) {
            alert('Selected item not found.');
            return;
        }

        if (!editingItem) return;

        setEditingItem({
            ...editingItem,
            title: sourceItem.title || editingItem.title,
            description: sourceItem.description || editingItem.description,
            category: (importSourceType === 'project' && sourceItem.category) ? sourceItem.category : editingItem.category,
            mediaType: sourceItem.mediaType || editingItem.mediaType,
            mediaUrl: sourceItem.mediaUrl || editingItem.mediaUrl,
            assets: sourceItem.assets ? JSON.parse(JSON.stringify(sourceItem.assets)) : [],
            technologies: sourceItem.technologies || editingItem.technologies,
            githubUrl: sourceItem.githubUrl || editingItem.githubUrl || '',
            liveUrl: sourceItem.liveUrl || editingItem.liveUrl,
            blogUrl: sourceItem.blogUrl || editingItem.blogUrl || '',
        });

        if (sourceItem.technologies) {
            setTechInput(sourceItem.technologies.join(', '));
        }

        const usesBase64 = sourceItem.mediaUrl?.startsWith('data:') || 
                           sourceItem.assets?.some((a: any) => a.url?.startsWith('data:'));
        setFormUploadMode(usesBase64 ? 'base64' : 'storage');

        setMessage({ type: 'success', text: `Successfully imported content from "${sourceItem.title}"!` });
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
        // Use selected skills if available, otherwise parse from input
        if (selectedSkills.length > 0) {
            const techs = selectedSkills.map(s => s.name);
            setEditingItem({ ...editingItem, technologies: techs });
        } else {
            const techs = techInput.split(',').map((t) => t.trim()).filter((t) => t);
            setEditingItem({ ...editingItem, technologies: techs });
        }
    };

    const handleSkillSelect = (skill: ISkill) => {
        if (!selectedSkills.find(s => s._id === skill._id)) {
            setSelectedSkills([...selectedSkills, skill]);
            setTechInput(selectedSkills.map(s => s.name).join(', '));
        }
        setShowSkillSuggestions(false);
        setSkillSearchQuery('');
    };

    const handleSkillRemove = (skillId: any) => {
        const updated = selectedSkills.filter(s => s._id.toString() !== skillId.toString());
        setSelectedSkills(updated);
        setTechInput(updated.map(s => s.name).join(', '));
    };

    const filteredSkills = availableSkills.filter(skill =>
        skill.name.toLowerCase().includes(skillSearchQuery.toLowerCase()) &&
        !selectedSkills.find(s => s._id === skill._id)
    ).slice(0, 8);

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
                        {['web', 'mobile', 'ml', 'data-science', 'web3', 'others'].map(cat => (
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

                    {/* Gemini AI Project Generator */}
                    <div style={{ background: 'rgba(99, 102, 241, 0.05)', border: '1px dashed rgba(99, 102, 241, 0.3)', padding: '16px', borderRadius: '8px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className={styles.label} style={{ fontWeight: 600, color: 'var(--color-accent)', marginBottom: 0 }}>Gemini AI Project Generator</label>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Describe what project you built, and Gemini will generate a professional title, detailed summary, and technology list.</span>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                            <input
                                type="text"
                                id="gemini-ai-project-prompt"
                                placeholder="e.g. a decentralized file sharing application using IPFS and Ethereum smart contracts"
                                className={styles.input}
                                style={{ flex: 1 }}
                            />
                            <button
                                type="button"
                                onClick={async () => {
                                    const promptInput = document.getElementById('gemini-ai-project-prompt') as HTMLInputElement;
                                    if (!promptInput || !promptInput.value.trim()) {
                                        alert('Please enter a project description.');
                                        return;
                                    }
                                    setIsSaving(true);
                                    try {
                                        const res = await axios.post('/api/generate', { prompt: promptInput.value, type: 'project' });
                                        if (res.data) {
                                            setEditingItem({
                                                ...editingItem,
                                                title: res.data.title || editingItem.title,
                                                description: res.data.description || editingItem.description,
                                                technologies: res.data.technologies || editingItem.technologies
                                            });
                                            setTechInput(res.data.technologies ? res.data.technologies.join(', ') : '');
                                            if (res.data.checks && Array.isArray(res.data.checks)) {
                                                setChecks(res.data.checks);
                                            }
                                            alert('Project details generated successfully!');
                                        }
                                    } catch (err: any) {
                                        console.error(err);
                                        alert('Failed to generate project: ' + (err.response?.data?.error || err.message));
                                    } finally {
                                        setIsSaving(false);
                                    }
                                }}
                                className={styles.addAssetBtn}
                                style={{ height: '44px', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', background: 'var(--color-accent)' }}
                                disabled={isSaving}
                            >
                                {isSaving ? 'Generating...' : 'Generate Details'}
                            </button>
                        </div>
                    </div>

                    {/* Import/Exchange Data Block */}
                    <div style={{ background: 'rgba(var(--color-accent-rgb, 99, 102, 241), 0.05)', border: '1px dashed rgba(var(--color-accent-rgb, 99, 102, 241), 0.3)', padding: '16px', borderRadius: '8px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className={styles.label} style={{ fontWeight: 600, color: 'var(--color-accent)', marginBottom: 0 }}>Import / Exchange Data</label>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Pre-fill this form by importing details, assets, and properties from an existing product or project.</span>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                            <select
                                value={importSourceType}
                                onChange={(e) => {
                                    setImportSourceType(e.target.value as any);
                                    setSelectedImportId('');
                                }}
                                className={styles.select}
                                style={{ minWidth: '150px', height: '44px' }}
                            >
                                <option value="product">From Product</option>
                                <option value="project">From Project</option>
                            </select>
                            <select
                                value={selectedImportId}
                                onChange={(e) => setSelectedImportId(e.target.value)}
                                className={styles.select}
                                style={{ flex: 1, minWidth: '200px', height: '44px' }}
                            >
                                <option value="">-- Select Item to Import --</option>
                                {importSourceType === 'product'
                                    ? allProducts.map(p => (
                                        <option key={p._id} value={p._id}>{p.title}</option>
                                      ))
                                    : projects.filter(p => p._id !== editingItem._id).map(p => (
                                        <option key={p._id} value={p._id}>{p.title}</option>
                                      ))
                                }
                            </select>
                            <button
                                type="button"
                                onClick={handleImportData}
                                className={styles.addAssetBtn}
                                style={{ height: '44px', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', background: 'var(--color-accent)', gap: '6px' }}
                            >
                                <FiDownload size={16} /> Import Content
                            </button>
                        </div>
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
                                <option value="mobile">Mobile Development</option>
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
                                <option value="video-url">Video URL (.mp4)</option>
                            </select>
                        </div>
                    </div>

                    {editingItem.mediaType === 'image' ? (
                        <FileUpload
                            value={editingItem.mediaUrl}
                            onChange={(url) => setEditingItem({ ...editingItem, mediaUrl: url })}
                            label="Project Thumbnail"
                            accept="image/*"
                            uploadMode={formUploadMode}
                            onUploadModeChange={setFormUploadMode}
                        />
                    ) : editingItem.mediaType === 'video-url' ? (
                        <div className={styles.field}>
                            <label className={styles.label}>Video URL (.mp4 / .webm)</label>
                            <div className={styles.iconInputWrapper}>
                                <input
                                    type="text"
                                    value={editingItem.mediaUrl}
                                    onChange={(e) => setEditingItem({ ...editingItem, mediaUrl: e.target.value })}
                                    className={styles.input}
                                    placeholder="https://example.com/demo.mp4"
                                />
                                <span className={styles.inputIcon}>
                                    <FiFilm style={{ color: '#8b5cf6' }} size={18} />
                                </span>
                            </div>
                            {editingItem.mediaUrl && (
                                <div style={{ marginTop: '10px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--color-border)', background: '#000' }}>
                                    <video
                                        controls
                                        muted
                                        playsInline
                                        preload="auto"
                                        style={{ width: '100%', maxHeight: '260px', display: 'block', objectFit: 'contain' }}
                                    >
                                        <source src={editingItem.mediaUrl} />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            )}
                        </div>
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
                            {editingItem.mediaUrl && (() => {
                                const match = editingItem.mediaUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/);
                                const videoId = match ? match[1] : null;
                                return videoId ? (
                                    <div style={{ marginTop: '10px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--color-border)', position: 'relative', paddingTop: '56.25%' }}>
                                        <iframe
                                            src={`https://www.youtube.com/embed/${videoId}`}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                                        />
                                    </div>
                                ) : null;
                            })()}
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
                                                        uploadMode={formUploadMode}
                                                        onUploadModeChange={setFormUploadMode}
                                                    />
                                                ) : (
                                                    <>
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
                                                                asset.type === 'video' ? 'https://example.com/demo.mp4' :
                                                                asset.type === 'youtube' ? 'https://youtube.com/watch?v=...' :
                                                                asset.type === 'loom' ? 'https://loom.com/share/...' :
                                                                'https://...'
                                                            }
                                                            style={{ height: '40px', padding: '4px 12px', fontSize: '0.85rem' }}
                                                        />
                                                        {/* Inline video preview for video URL assets */}
                                                        {asset.type === 'video' && asset.url && (
                                                            <div style={{ marginTop: '8px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--color-border)', background: '#000' }}>
                                                                <video
                                                                    controls
                                                                    muted
                                                                    playsInline
                                                                    preload="auto"
                                                                    style={{ width: '100%', maxHeight: '200px', display: 'block', objectFit: 'contain' }}
                                                                >
                                                                    <source src={asset.url} />
                                                                </video>
                                                            </div>
                                                        )}
                                                        {/* Inline YouTube preview */}
                                                        {asset.type === 'youtube' && asset.url && (() => {
                                                            const match = asset.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/);
                                                            const videoId = match ? match[1] : null;
                                                            return videoId ? (
                                                                <div style={{ marginTop: '8px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--color-border)', position: 'relative', paddingTop: '56.25%' }}>
                                                                    <iframe
                                                                        src={`https://www.youtube.com/embed/${videoId}`}
                                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                        allowFullScreen
                                                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                                                                    />
                                                                </div>
                                                            ) : null;
                                                        })()}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Technologies / Skills</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)', minHeight: '44px' }}>
                                {selectedSkills.map(skill => (                                        <span 
                                        key={skill._id?.toString() || skill.name} 
                                        style={{ 
                                            display: 'inline-flex', 
                                            alignItems: 'center', 
                                            gap: '6px',
                                            padding: '4px 10px',
                                            background: 'var(--color-accent-light)',
                                            border: '1px solid var(--color-accent)',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            color: 'var(--color-accent)',
                                        }}
                                    >
                                        <span>{skill.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleSkillRemove(skill._id!)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', color: 'inherit', display: 'flex' }}
                                            title="Remove"
                                        >
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                                                <path d="M9.5 3.5L8.5 2.5L6 5L3.5 2.5L2.5 3.5L5 6L2.5 8.5L3.5 9.5L6 7L8.5 9.5L9.5 8.5L7 6L9.5 3.5Z"/>
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                                {selectedSkills.length === 0 && (
                                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', padding: '4px 0' }}>
                                        Select from existing skills or type to add
                                    </span>
                                )}
                            </div>
                            <input
                                type="text"
                                value={skillSearchQuery}
                                onChange={(e) => {
                                    setSkillSearchQuery(e.target.value);
                                    setShowSkillSuggestions(true);
                                }}
                                onFocus={() => setShowSkillSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSkillSuggestions(false), 200)}
                                className={styles.input}
                                style={{ 
                                    marginTop: '4px',
                                    border: 'none',
                                    background: 'transparent',
                                    color: 'var(--color-text)',
                                    outline: 'none',
                                    paddingLeft: '12px'
                                }}
                                placeholder="Search skills... (e.g. React, TypeScript)"
                            />
                        </div>
                        
                        {/* Skill Suggestions Dropdown */}
                        {showSkillSuggestions && filteredSkills.length > 0 && (
                            <div style={{ 
                                position: 'relative', 
                                marginTop: '4px',
                                background: 'var(--color-card)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                maxHeight: '200px',
                                overflowY: 'auto',
                                zIndex: 50,
                                padding: '4px',
                                width: '100%'
                            }}>
                                {filteredSkills.map(skill => {
                                    const IconComponent = getTechIcon(skill.iconName);
                                    const brandColor = skill.color || getTechBrandColor(skill.iconName);
                                    return (
                                        <button
                                            key={skill._id?.toString() || skill.name}
                                            type="button"
                                            onClick={() => handleSkillSelect(skill)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                width: '100%',
                                                padding: '8px 12px',
                                                background: 'transparent',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                color: 'var(--color-text)',
                                                transition: 'background 0.15s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-secondary)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <IconComponent size={18} color={brandColor || 'var(--color-text-secondary)'} />
                                            <span style={{ fontSize: '0.85rem' }}>{skill.name}</span>
                                            <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--color-text-secondary)', textTransform: 'capitalize' }}>
                                                {skill.category}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                        💡 Select skills from the dropdown to ensure proper logo display
                    </p>

                    {/* Checks / Features Section */}
                    <div className={styles.section} style={{ margin: '16px 0', padding: '16px', background: 'var(--color-bg-secondary)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <FiCheck size={18} style={{ color: 'var(--color-accent)' }} />
                            <label className={styles.label} style={{ marginBottom: 0, fontWeight: 600 }}>What I Delivered (Checks / Features)</label>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: '0 0 16px 0' }}>
                            Add key features, goals achieved, or archived items for this project.
                        </p>
                        
                        <div className={styles.checksList}>
                            {checks.map((check, index) => (
                                <div key={index} className={styles.checkItem}>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                        {/* Type Selector */}
                                        <select
                                            value={check.type}
                                            onChange={(e) => {
                                                const updated = [...checks];
                                                updated[index] = { ...updated[index], type: e.target.value as CheckType };
                                                setChecks(updated);
                                            }}
                                            style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                border: '1px solid var(--color-border)',
                                                background: 'var(--color-bg-secondary)',
                                                color: 'var(--color-text)',
                                                fontSize: '0.8rem',
                                                marginRight: '8px',
                                            }}
                                        >
                                            <option value="feature">Feature</option>
                                            <option value="goal">Goal</option>
                                            <option value="archive">Archived</option>
                                        </select>
                                        
                                        {/* Label Input */}
                                        <input
                                            type="text"
                                            value={check.label}
                                            onChange={(e) => {
                                                const updated = [...checks];
                                                updated[index] = { ...updated[index], label: e.target.value };
                                                setChecks(updated);
                                            }}
                                            placeholder="What was delivered/achieved?"
                                            style={{
                                                flex: 1,
                                                padding: '6px 10px',
                                                borderRadius: '4px',
                                                border: '1px solid var(--color-border)',
                                                background: 'var(--color-bg-secondary)',
                                                color: 'var(--color-text)',
                                                fontSize: '0.85rem',
                                            }}
                                        />
                                        
                                        {/* Description Input */}
                                        <input
                                            type="text"
                                            value={check.description || ''}
                                            onChange={(e) => {
                                                const updated = [...checks];
                                                updated[index] = { ...updated[index], description: e.target.value };
                                                setChecks(updated);
                                            }}
                                            placeholder="Optional details"
                                            style={{
                                                flex: 1,
                                                padding: '6px 10px',
                                                borderRadius: '4px',
                                                border: '1px solid var(--color-border)',
                                                background: 'var(--color-bg-secondary)',
                                                color: 'var(--color-text)',
                                                fontSize: '0.85rem',
                                            }}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const updated = checks.filter((_, i) => i !== index);
                                            setChecks(updated);
                                        }}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--color-text-secondary)',
                                            cursor: 'pointer',
                                            padding: '4px',
                                            marginLeft: '8px',
                                            borderRadius: '4px',
                                        }}
                                        title="Remove check"
                                    >
                                        <FiTrash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        
                        <button
                            type="button"
                            onClick={() => {
                                setChecks([...checks, { type: 'feature', label: '', description: '' }]);
                            }}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '8px 16px',
                                background: 'var(--color-accent)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                marginTop: '8px',
                            }}
                        >
                            <FiPlus size={14} /> Add Check
                        </button>
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

                    <div className={styles.field}>
                        <label className={styles.label}>Blog Post Link / URL (Optional)</label>
                        <div className={styles.iconInputWrapper}>
                            <input
                                type="text"
                                value={editingItem.blogUrl || ''}
                                onChange={(e) => setEditingItem({ ...editingItem, blogUrl: e.target.value })}
                                className={styles.input}
                                placeholder="e.g. /blog/my-project-writeup or https://..."
                            />
                            <span className={styles.inputIcon}>
                                <FiBookOpen size={18} />
                            </span>
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
