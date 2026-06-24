'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    FiPlus, FiTrash2, FiEdit2, FiX, FiCheck, FiImage, FiEye, FiEyeOff, FiCalendar, FiTag,
    FiDownload, FiShare2
} from 'react-icons/fi';
import { FileUpload, RichTextEditor } from '../components';
import { Loader } from '@/app/components/atoms/loader';
import styles from '../components/editor.module.css';

interface BlogPostItem {
    _id?: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    coverImage?: string;
    assets?: { type: 'image' | 'video' | 'youtube' | 'loom' | 'external'; url: string }[];
    tags: string[];
    isVisible: boolean;
    views?: number;
    createdAt?: string;
}

const emptyBlog: BlogPostItem = {
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    coverImage: '',
    assets: [],
    tags: [],
    isVisible: true,
};

export default function AdminBlogPage() {
    const [blogs, setBlogs] = useState<BlogPostItem[]>([]);
    const [allProjects, setAllProjects] = useState<any[]>([]);
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [editingItem, setEditingItem] = useState<BlogPostItem | null>(null);
    const [tagsInput, setTagsInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [formUploadMode, setFormUploadMode] = useState<'storage' | 'base64'>('storage');
    const [blogImportSourceType, setBlogImportSourceType] = useState<'product' | 'project'>('product');
    const [selectedBlogImportId, setSelectedBlogImportId] = useState('');

    const fetchBlogs = async () => {
        try {
            const response = await axios.get('/api/blog?admin=true');
            setBlogs(response.data);
        } catch (error) {
            console.error('Failed to fetch blog posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await axios.get('/api/projects?admin=true');
            setAllProjects(response.data);
        } catch (error) {
            console.error('Failed to fetch projects for blog import:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/product-projects?admin=true');
            setAllProducts(response.data);
        } catch (error) {
            console.error('Failed to fetch products for blog import:', error);
        }
    };

    useEffect(() => {
        fetchBlogs();
        fetchProjects();
        fetchProducts();
    }, []);

    const handleAdd = () => {
        setEditingItem({ ...emptyBlog });
        setTagsInput('');
        setFormUploadMode('storage');
        setSelectedBlogImportId('');
    };

    const handleEdit = (blog: BlogPostItem) => {
        setEditingItem({ ...blog, assets: blog.assets || [] });
        setTagsInput(blog.tags.join(', '));
        setFormUploadMode(blog.coverImage?.startsWith('data:') ? 'base64' : 'storage');
        setSelectedBlogImportId('');
    };

    const handleCancel = () => {
        setEditingItem(null);
    };

    const handleGenerateBlogFromData = async () => {
        if (!selectedBlogImportId) {
            alert('Please select a project or product.');
            return;
        }

        let selectedItem: any = null;
        if (blogImportSourceType === 'product') {
            selectedItem = allProducts.find(p => p._id === selectedBlogImportId);
        } else {
            selectedItem = allProjects.find(p => p._id === selectedBlogImportId);
        }

        if (!selectedItem) {
            alert('Selected item not found.');
            return;
        }

        setIsSaving(true);
        setMessage(null);

        const aiPrompt = `Write a comprehensive, professional, and detailed technical blog post about our ${blogImportSourceType} "${selectedItem.title}". 
Here are the details of the ${blogImportSourceType}:
Description: ${selectedItem.description}
Technologies used: ${selectedItem.technologies?.join(', ')}
${selectedItem.githubUrl ? `GitHub repository: ${selectedItem.githubUrl}` : ''}
${selectedItem.liveUrl ? `Live URL / Demo: ${selectedItem.liveUrl}` : ''}

The blog post should explain what the ${blogImportSourceType} is, the problem it solves, the technical implementation details (such as the architecture and how the technologies were used), and any key highlights/achievements. Make it engaging, educational, and structured with headings, bullet points, and code snippets where appropriate.`;

        try {
            const res = await axios.post('/api/generate', { prompt: aiPrompt, type: 'blog' });
            if (res.data) {
                setEditingItem({
                    ...editingItem!,
                    title: res.data.title || `Introducing ${selectedItem.title}`,
                    excerpt: res.data.excerpt || selectedItem.description.substring(0, 150),
                    content: res.data.content || '',
                    tags: res.data.tags || selectedItem.technologies || [],
                    coverImage: selectedItem.mediaUrl || editingItem?.coverImage || ''
                });
                setTagsInput(res.data.tags ? res.data.tags.join(', ') : (selectedItem.technologies ? selectedItem.technologies.join(', ') : ''));
                alert('Blog post generated successfully from the project/product details!');
            }
        } catch (err: any) {
            console.error(err);
            alert('Failed to generate content: ' + (err.response?.data?.error || err.message));
        } finally {
            setIsSaving(false);
        }
    };

    const handleSave = async () => {
        if (!editingItem) return;
        if (!editingItem.title.trim() || !editingItem.content.trim()) {
            setMessage({ type: 'error', text: 'Title and content are required.' });
            return;
        }

        setIsSaving(true);
        setMessage(null);

        try {
            if (editingItem._id) {
                await axios.put('/api/blog', editingItem);
            } else {
                await axios.post('/api/blog', editingItem);
            }
            await fetchBlogs();
            setEditingItem(null);
            setMessage({ type: 'success', text: 'Blog post saved successfully!' });
        } catch (error: any) {
            console.error('Failed to save blog:', error);
            const errMsg = error.response?.data?.error || 'Failed to save blog post.';
            setMessage({ type: 'error', text: errMsg });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this blog post?')) return;

        try {
            await axios.delete(`/api/blog?id=${id}`);
            await fetchBlogs();
            setMessage({ type: 'success', text: 'Blog post deleted successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete blog post.' });
        }
    };

    const copyShareLink = (slug: string) => {
        const url = `${window.location.origin}/blog/${slug}`;
        navigator.clipboard.writeText(url);
        setMessage({ type: 'success', text: 'Blog post share link copied to clipboard!' });
    };

    const handleTagsBlur = () => {
        if (!editingItem) return;
        const tags = tagsInput.split(',').map((t) => t.trim()).filter((t) => t);
        setEditingItem({ ...editingItem, tags });
    };

    const getAssetHTML = (type: string, url: string) => {
        if (!url) return '';
        if (type === 'image') {
            return `<img src="${url}" alt="Blog Image" style="max-width:100%; border-radius:6px; margin:15px 0; display:block;" />`;
        }
        if (type === 'video') {
            return `<video src="${url}" controls style="max-width:100%; border-radius:6px; margin:15px 0; display:block;"></video>`;
        }
        if (type === 'youtube') {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = url.match(regExp);
            const id = (match && match[2].length === 11) ? match[2] : null;
            const embedUrl = id ? `https://www.youtube.com/embed/${id}` : url;
            return `<iframe src="${embedUrl}" width="100%" height="450" frameborder="0" allowfullscreen style="border-radius:6px; margin:15px 0; border:none;"></iframe>`;
        }
        if (type === 'loom') {
            const loomId = url.split('/').pop()?.split('?')[0];
            const embedUrl = `https://www.loom.com/embed/${loomId}`;
            return `<iframe src="${embedUrl}" width="100%" height="450" frameborder="0" allowfullscreen style="border-radius:6px; margin:15px 0; border:none;"></iframe>`;
        }
        return `<iframe src="${url}" width="100%" height="450" frameborder="0" allowfullscreen style="border-radius:6px; margin:15px 0; border:none;"></iframe>`;
    };

    const copyToClipboard = (type: string, url: string) => {
        const html = getAssetHTML(type, url);
        if (!html) return;
        navigator.clipboard.writeText(html);
        alert('HTML Embed Code copied to clipboard! You can paste (Ctrl+V or Cmd+V) it anywhere in your document or in HTML Source view.');
    };

    const appendToArticle = (type: string, url: string) => {
        const html = getAssetHTML(type, url);
        if (!html || !editingItem) return;
        setEditingItem({
            ...editingItem,
            content: editingItem.content + html
        });
        alert('Media asset appended to the end of the article content. You can rearrange it in the editor.');
    };

    if (isLoading) {
        return <Loader variant="section" />;
    }

    return (
        <div className={styles.editor}>
            <div className={styles.header}>
                <h1 className={styles.title}>Manage Technical Blog Posts</h1>
                {!editingItem && (
                    <button onClick={handleAdd} className={styles.addBtn}>
                        <FiPlus size={18} />
                        New Blog Post
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
                        {editingItem._id ? 'Edit Blog Post' : 'Create New Blog Post'}
                    </div>

                    {/* Gemini AI Writer */}
                    <div style={{ background: 'rgba(99, 102, 241, 0.05)', border: '1px dashed rgba(99, 102, 241, 0.3)', padding: '16px', borderRadius: '8px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className={styles.label} style={{ fontWeight: 600, color: 'var(--color-accent)', marginBottom: 0 }}>Gemini AI Article Writer</label>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Type a topic below to auto-generate the title, excerpt, tags, and complete rich HTML document content.</span>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                            <input
                                type="text"
                                id="gemini-ai-blog-prompt"
                                placeholder="e.g. Comprehensive guide on Event-Driven microservices with Kafka in Node.js"
                                className={styles.input}
                                style={{ flex: 1 }}
                            />
                            <button
                                type="button"
                                onClick={async () => {
                                    const promptInput = document.getElementById('gemini-ai-blog-prompt') as HTMLInputElement;
                                    if (!promptInput || !promptInput.value.trim()) {
                                        alert('Please enter a generation topic.');
                                        return;
                                    }
                                    setIsSaving(true);
                                    try {
                                        const res = await axios.post('/api/generate', { prompt: promptInput.value, type: 'blog' });
                                        if (res.data) {
                                            setEditingItem({
                                                ...editingItem,
                                                title: res.data.title || editingItem.title,
                                                excerpt: res.data.excerpt || editingItem.excerpt,
                                                content: res.data.content || editingItem.content,
                                                tags: res.data.tags || editingItem.tags
                                            });
                                            setTagsInput(res.data.tags ? res.data.tags.join(', ') : '');
                                            alert('Blog post generated successfully! You can now refine it in the MS Word editor below.');
                                        }
                                    } catch (err: any) {
                                        console.error(err);
                                        alert('Failed to generate content: ' + (err.response?.data?.error || err.message));
                                    } finally {
                                        setIsSaving(false);
                                    }
                                }}
                                className={styles.addAssetBtn}
                                style={{ height: '44px', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', background: 'var(--color-accent)' }}
                                disabled={isSaving}
                            >
                                {isSaving ? 'Writing...' : 'Generate Draft'}
                            </button>
                        </div>
                    </div>

                    {/* AI Blog Generator from Product/Project */}
                    <div style={{ background: 'rgba(var(--color-accent-rgb, 99, 102, 241), 0.05)', border: '1px dashed rgba(var(--color-accent-rgb, 99, 102, 241), 0.3)', padding: '16px', borderRadius: '8px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className={styles.label} style={{ fontWeight: 600, color: 'var(--color-accent)', marginBottom: 0 }}>AI Blog Generator from Product/Project</label>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Select a product or project to have Gemini write a technical blog post detailing its features, stack, and demo.</span>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                            <select
                                value={blogImportSourceType}
                                onChange={(e) => {
                                    setBlogImportSourceType(e.target.value as any);
                                    setSelectedBlogImportId('');
                                }}
                                className={styles.select}
                                style={{ minWidth: '150px', height: '44px' }}
                            >
                                <option value="product">From Product</option>
                                <option value="project">From Project</option>
                            </select>
                            <select
                                value={selectedBlogImportId}
                                onChange={(e) => setSelectedBlogImportId(e.target.value)}
                                className={styles.select}
                                style={{ flex: 1, minWidth: '200px', height: '44px' }}
                            >
                                <option value="">-- Select Product/Project --</option>
                                {blogImportSourceType === 'product'
                                    ? allProducts.map(p => (
                                        <option key={p._id} value={p._id}>{p.title}</option>
                                      ))
                                    : allProjects.map(p => (
                                        <option key={p._id} value={p._id}>{p.title}</option>
                                      ))
                                }
                            </select>
                            <button
                                type="button"
                                onClick={handleGenerateBlogFromData}
                                className={styles.addAssetBtn}
                                style={{ height: '44px', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', background: 'var(--color-accent)', gap: '6px' }}
                                disabled={isSaving}
                            >
                                <FiDownload size={16} /> {isSaving ? 'Writing...' : 'Generate Blog from Data'}
                            </button>
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Post Title</label>
                        <input
                            type="text"
                            value={editingItem.title}
                            onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                            className={styles.input}
                            placeholder="e.g. Building an Event-Driven System with RabbitMQ"
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>Custom Slug (Optional - auto-generated if blank)</label>
                            <input
                                type="text"
                                value={editingItem.slug}
                                onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                                className={styles.input}
                                placeholder="e.g. event-driven-rabbitmq"
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Tags (comma-separated)</label>
                            <input
                                type="text"
                                value={tagsInput}
                                onChange={(e) => setTagsInput(e.target.value)}
                                onBlur={handleTagsBlur}
                                className={styles.input}
                                placeholder="backend, architecture, rabbitmq"
                            />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Brief Excerpt/Summary</label>
                        <textarea
                            value={editingItem.excerpt}
                            onChange={(e) => setEditingItem({ ...editingItem, excerpt: e.target.value })}
                            className={styles.textarea}
                            placeholder="Short overview shown in listings..."
                            style={{ minHeight: '60px' }}
                        />
                    </div>

                    <FileUpload
                        value={editingItem.coverImage || ''}
                        onChange={(url) => setEditingItem({ ...editingItem, coverImage: url })}
                        label="Cover Image"
                        accept="image/*"
                        uploadMode={formUploadMode}
                        onUploadModeChange={setFormUploadMode}
                    />

                    {/* Blog Assets Management Block */}
                    <div className={styles.assetsSection}>
                        <div className={styles.assetsHeader}>
                            <label className={styles.label} style={{ marginBottom: 0, fontWeight: 600 }}>Blog Post Media Assets & Video Uploads ({editingItem.assets?.length || 0})</label>
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
                                <FiPlus size={14} /> Add Media Asset
                            </button>
                        </div>

                        {(!editingItem.assets || editingItem.assets.length === 0) ? (
                            <p className={styles.noAssetsText}>
                                No custom assets uploaded for this post yet. You can upload images or link Loom/YouTube videos below.
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
                                                    <option value="image">Image Upload</option>
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

                                        {asset.url && (
                                            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => copyToClipboard(asset.type, asset.url)}
                                                    className={styles.cancelBtn}
                                                    style={{ padding: '6px 12px', fontSize: '0.8rem', height: 'auto' }}
                                                >
                                                    Copy Embed HTML
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => appendToArticle(asset.type, asset.url)}
                                                    className={styles.addAssetBtn}
                                                    style={{ padding: '6px 12px', fontSize: '0.8rem', height: 'auto', background: '#107c41' }}
                                                >
                                                    Append to Article
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Word-style Rich Text Editor */}
                    <div className={styles.field}>
                        <label className={styles.label}>Technical Write-Up Content (MS Office Ribbon Editor)</label>
                        <RichTextEditor
                            value={editingItem.content}
                            onChange={(content) => setEditingItem({ ...editingItem, content })}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.checkboxLabel} style={{ paddingTop: '10px' }}>
                            <input
                                type="checkbox"
                                checked={editingItem.isVisible}
                                onChange={(e) => setEditingItem({ ...editingItem, isVisible: e.target.checked })}
                                className={styles.checkboxInput}
                            />
                            Publicly Published
                        </label>
                    </div>

                    <div className={styles.actions}>
                        <button onClick={handleSave} disabled={isSaving} className={styles.submitBtn}>
                            <FiCheck size={18} />
                            {isSaving ? 'Saving...' : 'Save Blog Post'}
                        </button>
                        <button onClick={handleCancel} className={styles.cancelBtn}>
                            <FiX size={18} />
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className={styles.grid}>
                    {blogs.length === 0 ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--color-muted)' }}>
                            No technical blog posts found. Write your first one!
                        </div>
                    ) : (
                        blogs.map((blog) => (
                            <div key={blog._id} className={styles.assetCard} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                    {blog.coverImage ? (
                                        <img 
                                            src={blog.coverImage} 
                                            alt={blog.title} 
                                            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--color-border)' }} 
                                        />
                                    ) : (
                                        <div style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg-secondary)', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                                            <FiImage size={24} style={{ color: 'var(--color-muted)' }} />
                                        </div>
                                    )}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {blog.title}
                                        </h3>
                                        <div style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                                <FiCalendar size={12} />
                                                {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'Draft'}
                                            </span>
                                            <span style={{ color: 'var(--color-muted)' }}>•</span>
                                            {blog.isVisible ? (
                                                <span style={{ color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '3px' }}><FiEye size={12} /> Published</span>
                                            ) : (
                                                <span style={{ color: '#dc2626', display: 'inline-flex', alignItems: 'center', gap: '3px' }}><FiEyeOff size={12} /> Hidden</span>
                                            )}
                                            <span style={{ color: 'var(--color-muted)' }}>•</span>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}><FiEye size={12} /> {blog.views || 0} views</span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {blog.excerpt}
                                        </p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                                    {blog.tags && blog.tags.map(tag => (
                                        <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', padding: '2px 8px', background: 'var(--color-bg-secondary)', borderRadius: '12px', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>
                                            <FiTag size={10} />
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid var(--color-border)', paddingTop: '12px', marginTop: '6px' }}>
                                    <button 
                                        onClick={() => copyShareLink(blog.slug)} 
                                        className={styles.cancelBtn} 
                                        style={{ padding: '6px 12px', fontSize: '0.85rem', height: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    >
                                        <FiShare2 size={12} /> Share
                                    </button>
                                    <button 
                                        onClick={() => handleEdit(blog)} 
                                        className={styles.cancelBtn} 
                                        style={{ padding: '6px 12px', fontSize: '0.85rem', height: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    >
                                        <FiEdit2 size={12} /> Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(blog._id!)} 
                                        className={styles.cancelBtn} 
                                        style={{ padding: '6px 12px', fontSize: '0.85rem', height: 'auto', display: 'flex', alignItems: 'center', gap: '4px', borderColor: '#fee2e2', color: '#dc2626' }}
                                    >
                                        <FiTrash2 size={12} /> Delete
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
